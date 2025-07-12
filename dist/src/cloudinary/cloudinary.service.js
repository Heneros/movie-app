"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const path = __importStar(require("path"));
const streamifier = require('streamifier');
const prisma_service_1 = require("../prisma/prisma.service");
const nest_winston_1 = require("nest-winston");
let CloudinaryService = class CloudinaryService {
    logger;
    prisma;
    constructor(logger, prisma) {
        this.logger = logger;
        this.prisma = prisma;
    }
    async uploadFileAvatarUser(userId, file, originalName) {
        try {
            if (!file.mimetype.startsWith('image/')) {
                throw new common_1.BadRequestException({
                    message: 'Invalid image file',
                    name: 'Error',
                    http_code: 400,
                });
            }
            const avatar = await this.prisma.avatar.findUnique({
                where: { userId },
            });
            if (!avatar) {
                throw new common_1.NotFoundException('Avatar not found');
            }
            if (avatar) {
                await this.deleteImage(avatar.publicId);
                await this.prisma.avatar.delete({
                    where: { id: avatar.id },
                });
            }
            const mainFolder = 'nestjsMoviedb';
            const fileName = path.parse(originalName).name;
            const uniqueFileName = `${fileName}_${Date.now()}`;
            const filePathOnCloudinary = `${mainFolder}/${uniqueFileName};`;
            const imageC = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    public_id: filePathOnCloudinary,
                    resource_type: 'image',
                    fetch_format: 'auto',
                    quality: 'auto:eco',
                    crop: 'limit',
                }, (err, result) => {
                    if (err) {
                        this.logger.error(`Cloudinary:  ${err}`);
                        reject(err);
                    }
                    else if (result && result.secure_url) {
                        resolve({ url: result.secure_url });
                    }
                    else {
                        reject(new Error('Failed to get secure_url from Cloudinary response'));
                    }
                });
                streamifier
                    .createReadStream(file.buffer)
                    .pipe(uploadStream);
            });
            const newAvatar = await this.prisma.avatar.create({
                data: {
                    url: imageC.url,
                    publicId: filePathOnCloudinary,
                    userId: userId,
                },
            });
            return { avatar: newAvatar.id };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error in uploadToCloudinary::  ${error}`);
        }
    }
    async uploadFromUrl(imageUrl, publicId) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(imageUrl, {
                public_id: publicId,
                resource_type: 'image',
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result?.secure_url) {
                    return reject(new Error('Upload failed'));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            });
        });
    }
    async deleteImage(publicId) {
        return cloudinary_1.v2.uploader.destroy(publicId);
    }
    async uploadGalleryImages(movieId, files) {
        const mainFolder = 'nestjsMoviedb';
        const savedImages = [];
        for (const file of files) {
            const originalName = file.originalname;
            const fileName = path.parse(originalName).name;
            const uniqueFileName = `${fileName}_${Date.now()}`;
            const filePathOnCloudinary = `${mainFolder}/${uniqueFileName}`;
            const uploaded = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    public_id: filePathOnCloudinary,
                    resource_type: 'image',
                    fetch_format: 'auto',
                    quality: 'auto:eco',
                }, (err, result) => {
                    if (err)
                        reject(err);
                    else if (result?.secure_url)
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    else
                        reject(new Error('No Cloudinary URL'));
                });
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
            const newGallery = await this.prisma.gallery.create({
                data: {
                    url: uploaded.url,
                    publicId: uploaded.publicId,
                },
            });
            await this.prisma.movie.update({
                where: { id: movieId },
                data: {
                    galleryId: newGallery.id,
                },
            });
            savedImages.push(newGallery);
        }
        return { images: savedImages };
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map
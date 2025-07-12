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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieModule = void 0;
const common_1 = require("@nestjs/common");
const movie_controller_1 = require("./movie.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const movie_resolver_1 = require("./movie.resolver");
const cqrs_1 = require("@nestjs/cqrs");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const Handlers = __importStar(require("./handlers"));
const movie_repository_1 = require("./repositories/movie.repository");
const review_repository_1 = require("./repositories/review.repository");
const redis_module_1 = require("../redis/redis.module");
const winston_1 = require("winston");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_service_1 = require("../redis/redis.service");
let MovieModule = class MovieModule {
};
exports.MovieModule = MovieModule;
exports.MovieModule = MovieModule = __decorate([
    (0, common_1.Module)({
        controllers: [movie_controller_1.MovieController],
        providers: [
            ...Object.values(Handlers),
            movie_repository_1.MovieRepository,
            review_repository_1.ReviewRepository,
            movie_resolver_1.MovieResolver,
            redis_service_1.RedisService,
        ],
        imports: [
            prisma_module_1.PrismaModule,
            cqrs_1.CqrsModule,
            cloudinary_module_1.CloudinaryModule,
            redis_module_1.RedisModule,
            winston_1.Logger,
            cache_manager_1.CacheModule.register(),
        ],
    })
], MovieModule);
//# sourceMappingURL=movie.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY = exports.isTest = exports.isDevelopment = exports.isProduction = exports.tempRequestPassDate = exports.tempLoginDate = exports.tempRegisterDate = exports.tempTokenDate = exports.domainClient = exports.domain = exports.roundsOfHashing = exports.jwtConstants = exports.PAGINATION_LIMIT = void 0;
exports.PAGINATION_LIMIT = parseInt(process.env.PAGINATION, 10);
exports.jwtConstants = {
    secret: process.env.JWT_SECRET,
};
exports.roundsOfHashing = 10;
exports.domain = process.env.DOMAIN_DEV;
exports.domainClient = process.env.DOMAIN_CLIENT;
exports.tempTokenDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
exports.tempRegisterDate = new Date(Date.now() + 10 * 60 * 1000);
exports.tempLoginDate = new Date(Date.now() + 31 * 60 * 60 * 1000);
exports.tempRequestPassDate = new Date(Date.now() + 15 * 60 * 1000);
exports.isProduction = process.env.NODE_ENV === 'production';
exports.isDevelopment = process.env.NODE_ENV === 'development';
exports.isTest = process.env.NODE_ENV === 'test';
exports.CLOUDINARY = 'CLOUDINARY';
//# sourceMappingURL=defaultData.js.map
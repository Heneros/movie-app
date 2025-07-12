"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
let ProfileOwnerGuard = class ProfileOwnerGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        let request;
        let idFromParams = null;
        if (context.getType().toString() === 'http') {
            request = context.switchToHttp().getRequest();
            idFromParams = +request.params.userId;
        }
        else {
            const gqlContext = graphql_1.GqlExecutionContext.create(context);
            request = gqlContext.getContext().req;
            const args = gqlContext.getArgs();
            idFromParams = +args.userId || +args.id || args.input.userId;
        }
        const authHeader = request.headers?.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('No authorization header');
        }
        const token = authHeader?.split('Bearer ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        let userIdFromToken;
        try {
            const decodedToken = this.jwtService.verify(token);
            userIdFromToken = decodedToken.id || decodedToken.userId;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        if (!idFromParams || userIdFromToken !== idFromParams) {
            throw new common_1.ForbiddenException('You are not authorized to have access to this profile');
        }
        return true;
    }
};
exports.ProfileOwnerGuard = ProfileOwnerGuard;
exports.ProfileOwnerGuard = ProfileOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], ProfileOwnerGuard);
//# sourceMappingURL=ProfileOwner.guard.js.map
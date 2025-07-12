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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt = __importStar(require("jsonwebtoken"));
const public_decorator_1 = require("../decorators/public.decorator");
const graphql_1 = require("@nestjs/graphql");
const nest_winston_1 = require("nest-winston");
let AuthGuard = class AuthGuard {
    logger;
    reflector;
    prismaService;
    constructor(logger, reflector, prismaService) {
        this.logger = logger;
        this.reflector = reflector;
        this.prismaService = prismaService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
        let request;
        const contextType = context.getType().toString();
        if (contextType === 'http') {
            request = context.switchToHttp().getRequest();
        }
        else if (contextType === 'ws') {
            const wsClient = context.switchToWs().getClient();
            request = wsClient.handshake;
        }
        else {
            const gqlContext = graphql_1.GqlExecutionContext.create(context);
            request = gqlContext.getContext().req;
        }
        const authHeader = request.headers?.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('No authorization header');
        }
        const token = authHeader?.split('Bearer ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (roles?.length) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: payload.id,
                    },
                });
                if (!user)
                    return false;
                const hasRole = user.roles.some((role) => roles.includes(role));
                if (!hasRole) {
                    return false;
                }
                if (roles.some((role) => payload.roles.includes(role))) {
                    request.user = payload;
                    return true;
                }
                return false;
            }
            catch (error) {
                this.logger.debug('error authguard', error);
                return false;
            }
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [Object, core_1.Reflector,
        prisma_service_1.PrismaService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map
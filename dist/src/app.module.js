"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const node_path_1 = require("node:path");
const users_module_1 = require("./users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const movie_module_1 = require("./movie/movie.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const mail_module_1 = require("./mail/mail.module");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const cqrs_1 = require("@nestjs/cqrs");
const gql_throttler_guard_1 = require("./guards/gql-throttler.guard");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const nest_winston_1 = require("nest-winston");
const Logger_1 = require("./Logger");
const winston_1 = require("winston");
const redis_module_1 = require("./redis/redis.module");
const defaultData_1 = require("./data/defaultData");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            movie_module_1.MovieModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                expandVariables: true,
                envFilePath: defaultData_1.isProduction ? './.env.prod' : './.env',
            }),
            redis_module_1.RedisModule,
            nest_winston_1.WinstonModule.forRoot(Logger_1.winstonLoggerOptions),
            winston_1.Logger,
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, node_path_1.join)(process.cwd(), 'src/schema.gql'),
                installSubscriptionHandlers: process.env.NODE_ENV !== 'test',
                subscriptions: process.env.NODE_ENV === 'test'
                    ? false
                    : { 'graphql-ws': true },
                context: ({ req, res }) => ({
                    req,
                    res,
                }),
            }),
            cqrs_1.CqrsModule.forRoot(),
            cloudinary_module_1.CloudinaryModule,
        ],
        controllers: [],
        providers: [
            winston_1.Logger,
            {
                provide: core_1.APP_GUARD,
                useClass: gql_throttler_guard_1.GqlThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("module-alias/register");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
require("reflect-metadata");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const common_1 = require("@nestjs/common");
const defaultData_1 = require("./data/defaultData");
const Logger_1 = require("./Logger");
const nest_winston_1 = require("nest-winston");
const memorystore_1 = __importDefault(require("memorystore"));
let app;
async function bootstrap() {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: nest_winston_1.WinstonModule.createLogger(Logger_1.winstonLoggerOptions),
            bufferLogs: true,
        });
        app.enableShutdownHooks();
        app.enableCors({
            origin: [defaultData_1.domain, defaultData_1.domainClient],
            credentials: true,
        });
        app.use((0, cookie_parser_1.default)());
        const MemoryStore = (0, memorystore_1.default)(express_session_1.default);
        app.use((0, express_session_1.default)({
            store: new MemoryStore({
                checkPeriod: 86400000,
            }),
            secret: process.env.SECRET_SESSION,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 31 * 1000 * 60 * 60 * 24,
            },
        }));
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.session());
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors) => {
                return new common_1.BadRequestException(errors.map((err) => ({
                    field: err.property,
                    errors: Object.values(err.constraints),
                })));
            },
        }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Movie')
            .setDescription('The Movie REST API description')
            .setVersion('0.1')
            .addTag('Auth', 'Registration for became a user. Login, Reset password, verify email')
            .addTag('Users', 'Only available for authorized user or admin role. Actions: remove user, deactivate user, delete my account, change profile data, get all users')
            .addTag('Movie', 'Only available for authorized user, editor and admin role. Actions for movie. Rate and review movie, CRUD operations with movie')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'cookie',
        }, 'access-token')
            .addSecurity('cookie-auth', {
            type: 'apiKey',
            in: 'header',
            name: 'Cookie',
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                security: [
                    {
                        'access-token': [],
                        'cookie-auth': [],
                    },
                ],
            },
        });
        await app.init();
    }
    return app;
}
async function handler(req, res) {
    const app = await bootstrap();
    return app.getHttpAdapter().getInstance()(req, res);
}
if (process.env.NODE_ENV !== 'production') {
    bootstrap().then((app) => {
        app.listen(3000, () => {
            console.log('Application is running on port 3000');
        });
    });
}
//# sourceMappingURL=main.js.map
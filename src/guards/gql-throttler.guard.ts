import { ThrottlerGuard } from '@nestjs/throttler';
import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const reqType = context.getType<ContextType | 'graphql'>();

        if (reqType === 'graphql') {
            const gqlCtx = GqlExecutionContext.create(context);
            const ctx = gqlCtx.getContext();

            const req = ctx.req ||
                ctx.request || {
                    headers: {},
                    ip: '0.0.0.0',
                };

            const res = ctx.res ||
                ctx.response || {
                    header: (...args: any[]) => {
                        /* stub */
                    },
                    setHeader: (...args: any[]) => {},
                    getHeader: (...args: any[]) => {},
                };

            return { req, res };
            // const gqlContext = GqlExecutionContext.create(context);
            // request = gqlContext.getContext().req;
            // const args = gqlContext.getArgs();
            // return args;

            // // return { req: ctx.req, res: ctx.res };
        } else if (reqType === 'http') {
            //    console.log(4555);
            return {
                req: context.switchToHttp().getRequest(),
                res: context.switchToHttp().getResponse(),
            };
        } else if (reqType === 'ws') {
            const wsClient = context.switchToWs().getClient();
            // request = wsClient.handshake;
            // console.log(123);
            return { req: wsClient.handshake, res: null };
        }
    }
}

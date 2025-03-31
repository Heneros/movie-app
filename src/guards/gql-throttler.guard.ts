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
            // console.log(12345);
            return { req: ctx.req, res: ctx.res };
        } else if (reqType === 'http') {
            return {
                req: context.switchToHttp().getRequest(),
                res: context.switchToHttp().getResponse(),
            };
        } else if (reqType === 'ws') {
            const wsClient = context.switchToWs().getClient();
            // request = wsClient.handshake;
            return { req: wsClient.handshake, res: null };
        }
    }
}

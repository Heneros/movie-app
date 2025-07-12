import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
export declare class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
}

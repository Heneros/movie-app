import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export interface User {
  id: number;
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

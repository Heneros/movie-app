import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export interface User {
  id: number;
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContextHost) => {
    // const request = context.switchToHttp().getRequest<Request>();

    let request: any;

    if (context.getType().toString() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }
    // console.log(request.headers.authorization);
    const authHeader = request.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // console.log(payload);
    return (request.user as User) || payload;
  },
);

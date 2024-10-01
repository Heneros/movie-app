// import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   /// app.useGlobalPipes(new ValidationPipe());

//   app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
//   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

//   const config = new DocumentBuilder()
//     .setTitle('Median')
//     .setDescription('The Median API description')
//     .setVersion('0.1')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   const { httpAdapter } = app.get(HttpAdapterHost);

//   app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

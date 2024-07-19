import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ApiKeyAuthGuard } from './auth/guard/apiKey-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);




  //Testing kishan
  //security

  app.useGlobalGuards(new ApiKeyAuthGuard());
  app.enableCors();
  app.use(helmet());


  app.enableVersioning({
    type: VersioningType.URI
  })



  //OpenAPi swagger documentation
  const config = new DocumentBuilder()
    .setTitle("FinopTix API")
    .setDescription("Finoptix is an API that allows you to organize your data in way thatt is easy to use  and understand  witht he power of large laguage model ")
    .setVersion('1.0')
    .addApiKey({
      type: "apiKey",
      name: 'X-API-KEY',
      in: "header",
      description: "API kye for authentiion for registered applications",
    },
      'apiKey',)
    .addTag("Finoptix")
    .build()


  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document);




  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

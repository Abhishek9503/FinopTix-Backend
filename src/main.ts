import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//security
app.enableCors();
app.use(helmet());


  //OpenAPi swagger documentation
  const config = new DocumentBuilder()
  .setTitle("FinopTix API")
  .setDescription("Finoptix is an API that allows you to organize your data in way thatt is easy to use  and understand  witht he power of large laguage model ")
  .setVersion("1.0")
  .addTag("Finoptix")
  .build()

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("api", app, document);

  app.enableVersioning({
    type:VersioningType.URI,
  })


  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

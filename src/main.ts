import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );


  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Guardia Médica API')
    .setDescription('Endpoints de pacientes, triage y signos vitales')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  // Config .env
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3000);
  const NODE_ENV = configService.get<string>('NODE_ENV', 'development');

  await app.listen(PORT, () => {
    Logger.log(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`, 'main.ts');
    Logger.log(` Swagger docs: http://localhost:${PORT}/api-docs`, 'main.ts');
  });
}
bootstrap();
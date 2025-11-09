import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
    }),
  );

    app.enableCors({
    origin: '*', 
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
  });

   app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // excludePrefixes: ['password'],
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT',3000);
  const NODE_ENV = configService.get<string>('NODE_ENV');

  await app.listen(PORT, () => {
    Logger.log(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`, 'main.ts');	
  });
}
bootstrap();

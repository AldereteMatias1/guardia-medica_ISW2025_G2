import { Module } from '@nestjs/common';
import { IngresoModule } from './ingreso.module';
import { ObraSocialModule } from './obra-social.module';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '../config/env-validation';
import { EnfermeraModule } from './enfermera.module';
import { PacienteModule } from './paciente.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    EnfermeraModule,
    PacienteModule,
    IngresoModule,
    AuthModule,
    ObraSocialModule,
  ]
})
export class AppModule {}

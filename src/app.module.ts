import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { IngresoModule } from './models/ingreso/ingreso.module';
import { EnfermeraModule } from './models/enfermera/enfermera.module';
import { PacienteModule } from './models/paciente/paciente.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env-validation';

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
  ],
  providers: [AppService],
})
export class AppModule {}

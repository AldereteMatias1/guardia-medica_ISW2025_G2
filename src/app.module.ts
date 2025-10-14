import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngresoModule } from './models/ingreso/ingreso.module';
import { EnfermeraModule } from './models/enfermera/enfermera.module';
import { PacienteModule } from './models/paciente/paciente.module';

@Module({
  imports: [EnfermeraModule, PacienteModule, IngresoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

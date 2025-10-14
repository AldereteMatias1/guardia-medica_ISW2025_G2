import { Module } from '@nestjs/common';
import {INGRESO_SERVICIO} from '../../app/interfaces/urgencia.service'
import { IngresoServiceImpl } from 'src/app/services/ingreso.service';
import { PacienteModule } from '../paciente/paciente.module';

@Module({
    imports: [PacienteModule],
     providers: [
        {
          provide: INGRESO_SERVICIO, 
          useClass: IngresoServiceImpl,
        },
      ],
      exports: [INGRESO_SERVICIO],
})
export class IngresoModule {
}

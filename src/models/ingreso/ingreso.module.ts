import { Module } from '@nestjs/common';
import { SERVICIO_INGRESO } from '../../app/interfaces/ingreso/ingreso.service.interface'
import { IngresoServiceImpl } from 'src/app/services/ingreso.service';
import { PacienteModule } from '../paciente/paciente.module';
import { DatabaseModule } from '../../../src/config/database/database.module';

@Module({
    imports: [PacienteModule, DatabaseModule],
     providers: [
        {
          provide: SERVICIO_INGRESO, 
          useClass: IngresoServiceImpl,
        },
      ],
      exports: [SERVICIO_INGRESO],
})
export class IngresoModule {
}

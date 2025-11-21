import { Module } from '@nestjs/common';
import { SERVICIO_INGRESO } from '../../app/interfaces/ingreso/ingreso.service.interface'
import { IngresoService } from '../../../src/app/services/ingreso.service';
import { PacienteModule } from '../paciente/paciente.module';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { PACIENTE_REPOSITORIO } from '../../../src/app/interfaces/paciente/patient.repository.interface';
import { PatientRepositoryImpl } from '../../../src/persistence/patient.repository';
import { INGRESO_REPOSITORIO } from '../../../src/app/interfaces/ingreso/ingreso.repository.interface';
import { IngresoRepositorio } from '../../../src/persistence/ingreso.repository';
import { SERVICIO_ENFERMERO } from '../../../src/app/interfaces/enfemera/enfermera.service.interface';
import { ServicioEnfermero } from '../../../src/app/services/enfermero.service';
import { ENFERMERO_REPOSITORIO } from '../../../src/app/interfaces/enfemera/enfermera.repository';
import { EnfermeroRepositorio } from '../../../src/persistence/enfermero.repository';
import { IngresoController } from '../../../src/presentation/ingreso.controller';
import { ESTADO_INGRESO_REPOSITORIO } from '../../../src/app/interfaces/estado-ingreso/estado.ingreso.repository.interface';
import { EstadoIngresoRepositorio } from '../../../src/persistence/estado.ingreso.repository';

@Module({
    imports: [PacienteModule, DatabaseModule],
    controllers: [IngresoController],
     providers: [
        {
          provide: SERVICIO_INGRESO, 
          useClass: IngresoService,
        },
        {
        provide: PACIENTE_REPOSITORIO,
        useClass: PatientRepositoryImpl,
        },
        {
          provide: INGRESO_REPOSITORIO,
          useClass: IngresoRepositorio,   
        },
        {
          provide: SERVICIO_ENFERMERO,
          useClass: ServicioEnfermero,
        },
        {
          provide: ENFERMERO_REPOSITORIO,
          useClass: EnfermeroRepositorio
        },
        {
          provide: ESTADO_INGRESO_REPOSITORIO, 
          useClass: EstadoIngresoRepositorio,
        }
        ],
      exports: [SERVICIO_INGRESO],
})
export class IngresoModule {
}

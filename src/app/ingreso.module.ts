import { Module } from '@nestjs/common';
import { IngresoService } from '../business/ingreso/service/ingreso.service';
import { PACIENTE_REPOSITORIO } from '../persistence/paciente/patient.repository.interface';
import { INGRESO_REPOSITORIO } from '../persistence/ingreso/ingreso.repository.interface';
import { IngresoRepositorio } from '../persistence/ingreso/ingreso.repository';
import { SERVICIO_ENFERMERO } from '../business/enfermera/service/enfermera.service.interface';
import { ENFERMERO_REPOSITORIO } from '../persistence/enfermero/enfermera.repository.interface';
import { IngresoController } from '../presentation/ingreso.controller';
import { ESTADO_INGRESO_REPOSITORIO } from '../persistence/estado-ingreso/estado.ingreso.repository.interface';
import { EstadoIngresoRepositorio } from '../persistence/estado-ingreso/estado.ingreso.repository';
import { SERVICIO_ESTADO_INGRESO } from '../business/estado-ingreso/service/estado.ingreso.service.interface';
import { NIVEL_EMERGENCIA_REPOSITORIO } from '../persistence/nivel-emergencia/nivel.emergencia.repository.interface';
import { NivelEmergenciaRepositorio } from '../persistence/nivel-emergencia/nivel.emergencia.repository';
import { NIVEL_EMERGENCIA_SERVICIO } from '../business/nivel-emergencia/service/nivel.emergencia.service.interface';
import { PacienteModule } from './paciente.module';
import { DatabaseModule } from './database.module';
import { SERVICIO_INGRESO } from '../../src/business/ingreso/service/ingreso.service.interface';
import { PatientRepositoryImpl } from '../../src/persistence/paciente/patient.repository';
import { ServicioEnfermero } from '../../src/business/enfermera/service/enfermero.service';
import { EnfermeroRepositorio } from '../../src/persistence/enfermero/enfermero.repository';
import { ServicioEstadoIngreso } from '../../src/business/estado-ingreso/service/estado.ingreso.service';
import { NivelEmergenciaServicio } from '../../src/business/nivel-emergencia/service/nivel.emergencia.service';

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
        },
        {
          provide: SERVICIO_ESTADO_INGRESO,
          useClass: ServicioEstadoIngreso
        },
        {
          provide: NIVEL_EMERGENCIA_REPOSITORIO, 
          useClass: NivelEmergenciaRepositorio,
        },
        {
          provide: NIVEL_EMERGENCIA_SERVICIO,
          useClass: NivelEmergenciaServicio
        }
        ],
      exports: [SERVICIO_INGRESO],
})
export class IngresoModule {
}

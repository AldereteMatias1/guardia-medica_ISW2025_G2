import { Module } from '@nestjs/common';
import { SERVICIO_INGRESO } from '../../app/interfaces/ingreso/ingreso.service.interface'
import { IngresoService } from '../../../src/app/services/ingreso.service';
import { PacienteModule } from '../paciente/paciente.module';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { PACIENTE_REPOSITORIO } from '../../../src/app/interfaces/paciente/patient.repository.interface';
import { PatientRepositoryImpl } from '../../../src/persistence/patient.repository';
import { INGRESO_REPOSITORIO } from '../../persistence/ingreso/ingreso.repository.interface';
import { IngresoRepositorio } from '../../persistence/ingreso/ingreso.repository';
import { SERVICIO_ENFERMERO } from '../../../src/app/interfaces/enfemera/enfermera.service.interface';
import { ServicioEnfermero } from '../../../src/app/services/enfermero.service';
import { ENFERMERO_REPOSITORIO } from '../../persistence/enfermero/enfermera.repository.interface';
import { EnfermeroRepositorio } from '../../../src/persistence/enfermero.repository';
import { IngresoController } from '../../../src/presentation/ingreso.controller';
import { ESTADO_INGRESO_REPOSITORIO } from '../../persistence/estado-ingreso/estado.ingreso.repository.interface';
import { EstadoIngresoRepositorio } from '../../persistence/estado-ingreso/estado.ingreso.repository';
import { SERVICIO_ESTADO_INGRESO } from '../../../src/app/interfaces/estado-ingreso/estado.ingreso.service.interface';
import { ServicioEstadoIngreso } from '../../../src/app/services/estado.ingreso.service';
import { NIVEL_EMERGENCIA_REPOSITORIO } from '../../persistence/nivel-emergencia/nivel.emergencia.repository.interface';
import { NivelEmergenciaRepositorio } from '../../persistence/nivel-emergencia/nivel.emergencia.repository';
import { NIVEL_EMERGENCIA_SERVICIO } from '../../../src/app/interfaces/nivel-emergencia/nivel.emergencia.service.interface';
import { NivelEmergenciaServicio } from '../../../src/app/services/nivel.emergencia.service';

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

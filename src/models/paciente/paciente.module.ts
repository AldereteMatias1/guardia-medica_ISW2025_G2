import { Module } from '@nestjs/common';
import { PACIENTE_REPOSITORIO } from '../../app/interfaces/patient.repository';
import { PatientRepositoryImpl } from '../../persistence/patient.repository';
import { SERVICIO_PACIENTE } from 'src/app/interfaces/paciente.service';
import { PacienteServicio } from 'src/app/services/paciente.service';
import { REPOSITORIO_OBRA_SOCIAL } from 'src/app/interfaces/obra.social.repository';
import { ObraSocialRepositorio } from 'src/persistence/obra.social.repository';


@Module({
  providers: [
    {
      provide: PACIENTE_REPOSITORIO, 
      useClass: PatientRepositoryImpl,
    },
    {
      provide: SERVICIO_PACIENTE,
      useClass: PacienteServicio
    },
    {
      provide: REPOSITORIO_OBRA_SOCIAL,
      useClass: ObraSocialRepositorio
    }
  ],
  exports: [PACIENTE_REPOSITORIO, SERVICIO_PACIENTE],
})
export class PacienteModule {}

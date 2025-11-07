import { Module } from '@nestjs/common';
import { PACIENTE_REPOSITORIO } from '../../app/interfaces/patient.repository';
import { PatientRepositoryImpl } from '../../persistence/patient.repository';
import { SERVICIO_PACIENTE } from 'src/app/interfaces/paciente.service';
import { PacienteServicio } from 'src/app/services/paciente.service';


@Module({
  providers: [
    {
      provide: PACIENTE_REPOSITORIO, 
      useClass: PatientRepositoryImpl,
    },
    {
      provide: SERVICIO_PACIENTE,
      useClass: PacienteServicio
    }
  ],
  exports: [PACIENTE_REPOSITORIO, SERVICIO_PACIENTE],
})
export class PacienteModule {}

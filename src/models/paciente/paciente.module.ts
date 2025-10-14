import { Module } from '@nestjs/common';
import { PACIENTE_REPOSITORIO } from '../../app/interfaces/patient.repository';
import { PatientRepositoryImpl } from '../../persistence/patient.repository';


@Module({
  providers: [
    {
      provide: PACIENTE_REPOSITORIO, 
      useClass: PatientRepositoryImpl,
    },
  ],
  exports: [PACIENTE_REPOSITORIO],
})
export class PacienteModule {}

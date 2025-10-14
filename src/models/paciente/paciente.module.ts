import { Module } from '@nestjs/common';
import { InMemoryPatientRepository} from './repository/paciente.repository.inMem';
import { PATIENT_REPOSITORY } from '../ingreso/patient.constant';


@Module({
  providers: [
    {
      provide: PATIENT_REPOSITORY, //no cree la constant la exporte de la interfaz nomas
      useClass: InMemoryPatientRepository,
    },
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PacienteModule {}

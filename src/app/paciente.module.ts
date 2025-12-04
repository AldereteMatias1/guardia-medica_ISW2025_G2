import { Module } from '@nestjs/common';
import { PACIENTE_REPOSITORIO } from '../persistence/paciente/patient.repository.interface';
import { SERVICIO_PACIENTE } from 'src/business/paciente/service/paciente.service.interface';
import { REPOSITORIO_OBRA_SOCIAL } from 'src/persistence/obra-social/obra.social.repository.interface';
import { PacienteController } from 'src/presentation/patient.controller';
import { DatabaseModule } from './database.module';
import { PatientRepositoryImpl } from '../../src/persistence/paciente/patient.repository';
import { PacienteServicio } from '../../src/business/paciente/service/paciente.service';
import { ObraSocialRepositorio } from '../../src/persistence/obra-social/obra.social.repository';


@Module({
  imports: [DatabaseModule],
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
  controllers: [PacienteController]
})
export class PacienteModule {}

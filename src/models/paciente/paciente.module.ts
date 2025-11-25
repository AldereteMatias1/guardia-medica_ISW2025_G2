import { Module } from '@nestjs/common';
import { PACIENTE_REPOSITORIO } from '../../app/interfaces/paciente/patient.repository.interface';
import { PatientRepositoryImpl } from '../../persistence/patient.repository';
import { SERVICIO_PACIENTE } from 'src/app/interfaces/paciente/paciente.service';
import { PacienteServicio } from 'src/app/services/paciente.service';
import { REPOSITORIO_OBRA_SOCIAL } from 'src/persistence/obra-social/obra.social.repository.interface';
import { ObraSocialRepositorio } from 'src/persistence/obra.social.repository';
import { PacienteController } from 'src/presentation/patient.controller';
import { DatabaseModule } from 'src/config/database/database.module';


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

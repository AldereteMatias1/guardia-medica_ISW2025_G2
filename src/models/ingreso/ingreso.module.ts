// src/app/ingreso/ingreso.module.ts
import { Module } from '@nestjs/common';
import { IngresoController } from 'src/app/controllers/ingreso.controller';
import { IngresoServiceImpl } from 'src/app/services/ingreso.service';

import { PACIENTE_REPOSITORIO } from 'src/app/interfaces/paciente/patient.repository';
import { PatientRepositoryImpl } from 'src/persistence/patient.repository';

import { ENFERMERA_REPOSITORIO } from 'src/app/interfaces/enfermera.repository';
import { EnfermeraRepositoryImpl } from 'src/persistence/enfermera.repository';

@Module({
  controllers: [IngresoController],
  providers: [
    IngresoServiceImpl,
    { provide: PACIENTE_REPOSITORIO, useClass: PatientRepositoryImpl },
    { provide: ENFERMERA_REPOSITORIO, useClass: EnfermeraRepositoryImpl },
  ],
  exports: [IngresoServiceImpl],
})
export class IngresoModule {}

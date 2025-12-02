import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { ATENCION_REPOSITORIO } from "../../src/persistence/atencion/atencion.repository.interface";
import { AtencionRepositorio } from "../../src/persistence/atencion/atencion.repository";
import { ATENCION_SERVICIO } from "../../src/business/atencion/service/atencion.service.interface";
import { AtencionServicio } from "../../src/business/atencion/service/atencion.service";
import { ESTADO_INGRESO_REPOSITORIO } from "../../src/persistence/estado-ingreso/estado.ingreso.repository.interface";
import { EstadoIngresoRepositorio } from "../../src/persistence/estado-ingreso/estado.ingreso.repository";
import { INGRESO_REPOSITORIO } from "../../src/persistence/ingreso/ingreso.repository.interface";
import { IngresoRepositorio } from "../../src/persistence/ingreso/ingreso.repository";
import { AtencionController } from "../../src/presentation/atencion.controller";
import { NIVEL_EMERGENCIA_REPOSITORIO } from "../../src/persistence/nivel-emergencia/nivel.emergencia.repository.interface";
import { NivelEmergenciaRepositorio } from "../../src/persistence/nivel-emergencia/nivel.emergencia.repository";
import { MEDICO_REPOSITORIO } from "../../src/persistence/medico/medico.repository.interface";
import { MedicoRepositorio } from "../../src/persistence/medico/medico.repository";
import { PACIENTE_REPOSITORIO } from "../../src/persistence/paciente/patient.repository.interface";
import { PatientRepositoryImpl } from "../../src/persistence/paciente/patient.repository";


@Module({
  imports: [DatabaseModule],
  controllers: [AtencionController],
  providers: [
    {
        provide: PACIENTE_REPOSITORIO,
        useClass: PatientRepositoryImpl,
    },
    {
        provide: ATENCION_SERVICIO,
        useClass: AtencionServicio,
    },
    {
      provide: ATENCION_REPOSITORIO, 
      useClass: AtencionRepositorio,
    },
    {
      provide: ESTADO_INGRESO_REPOSITORIO, 
      useClass: EstadoIngresoRepositorio,
    },
    {
        provide: NIVEL_EMERGENCIA_REPOSITORIO, 
        useClass: NivelEmergenciaRepositorio,
    },
    {
      provide: MEDICO_REPOSITORIO,
      useClass: MedicoRepositorio
    },
    {
      provide: INGRESO_REPOSITORIO,
      useClass: IngresoRepositorio
    }
    
  ],
  exports: [ATENCION_SERVICIO]
})
export class AtencionModule {}
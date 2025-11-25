import { Module } from "@nestjs/common";
import { NIVEL_EMERGENCIA_REPOSITORIO } from "../persistence/nivel-emergencia/nivel.emergencia.repository.interface";
import { NIVEL_EMERGENCIA_SERVICIO } from "../business/nivel-emergencia/service/nivel.emergencia.service.interface";
import { NivelEmergenciaRepositorio } from "../persistence/nivel-emergencia/nivel.emergencia.repository";
import { DatabaseModule } from "./database.module";
import { NivelEmergenciaServicio } from "../../src/business/nivel-emergencia/service/nivel.emergencia.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        {
          provide: NIVEL_EMERGENCIA_REPOSITORIO, 
          useClass: NivelEmergenciaRepositorio,
        },
        {
          provide: NIVEL_EMERGENCIA_SERVICIO,
          useClass: NivelEmergenciaServicio
        }
      ],
      exports: [NIVEL_EMERGENCIA_REPOSITORIO, NIVEL_EMERGENCIA_SERVICIO],
})
export class NivelEmergenciaModule {}
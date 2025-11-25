import { Module } from "@nestjs/common";
import { NIVEL_EMERGENCIA_REPOSITORIO } from "../../persistence/nivel-emergencia/nivel.emergencia.repository.interface";
import { NIVEL_EMERGENCIA_SERVICIO } from "../../../src/app/interfaces/nivel-emergencia/nivel.emergencia.service.interface";
import { NivelEmergenciaServicio } from "../../../src/app/services/nivel.emergencia.service";
import { DatabaseModule } from "../../../src/config/database/database.module";
import { NivelEmergenciaRepositorio } from "../../persistence/nivel-emergencia/nivel.emergencia.repository";

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
import { Module } from "@nestjs/common";
import { ESTADO_INGRESO_REPOSITORIO } from "../../../src/app/interfaces/estado-ingreso/estado.ingreso.repository.interface";
import { DatabaseModule } from "../../../src/config/database/database.module";
import { EstadoIngresoRepositorio } from "../../../src/persistence/estado.ingreso.repository";


@Module({
    imports: [DatabaseModule],
    providers: [
        {
          provide: ESTADO_INGRESO_REPOSITORIO, 
          useClass: EstadoIngresoRepositorio,
        }
      ],
      exports: [ESTADO_INGRESO_REPOSITORIO],
})
export class EstadoIngresoModule {}

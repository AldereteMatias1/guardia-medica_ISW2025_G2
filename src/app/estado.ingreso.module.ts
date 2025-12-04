import { Module } from "@nestjs/common";
import { ESTADO_INGRESO_REPOSITORIO } from "../persistence/estado-ingreso/estado.ingreso.repository.interface";
import { EstadoIngresoRepositorio } from "../persistence/estado-ingreso/estado.ingreso.repository";
import { SERVICIO_ESTADO_INGRESO } from "../business/estado-ingreso/service/estado.ingreso.service.interface";
import { DatabaseModule } from "./database.module";
import { ServicioEstadoIngreso } from "../../src/business/estado-ingreso/service/estado.ingreso.service";


@Module({
    imports: [DatabaseModule],
    providers: [
        {
          provide: ESTADO_INGRESO_REPOSITORIO, 
          useClass: EstadoIngresoRepositorio,
        },
        {
            provide: SERVICIO_ESTADO_INGRESO,
            useClass: ServicioEstadoIngreso
        }
      ],
      exports: [ESTADO_INGRESO_REPOSITORIO, SERVICIO_ESTADO_INGRESO],
})
export class EstadoIngresoModule {}

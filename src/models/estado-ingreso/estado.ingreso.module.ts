import { Module } from "@nestjs/common";
import { ESTADO_INGRESO_REPOSITORIO } from "../../../src/app/interfaces/estado-ingreso/estado.ingreso.repository.interface";
import { DatabaseModule } from "../../../src/config/database/database.module";
import { EstadoIngresoRepositorio } from "../../../src/persistence/estado.ingreso.repository";
import { SERVICIO_ESTADO_INGRESO } from "../../../src/app/interfaces/estado-ingreso/estado.ingreso.service.interface";
import { ServicioEstadoIngreso } from "../../../src/app/services/estado.ingreso.service";


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

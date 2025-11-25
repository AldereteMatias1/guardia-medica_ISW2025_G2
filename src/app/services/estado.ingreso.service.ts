import { Inject, Injectable } from "@nestjs/common";
import { IEstadoIngresoServicio } from "../interfaces/estado-ingreso/estado.ingreso.service.interface";
import { ESTADO_INGRESO_REPOSITORIO } from "../../persistence/estado-ingreso/estado.ingreso.repository.interface";
import { EstadoIngresoRepositorio } from "src/persistence/estado-ingreso/estado.ingreso.repository";

@Injectable()
export class ServicioEstadoIngreso implements IEstadoIngresoServicio {

    constructor(
        @Inject(ESTADO_INGRESO_REPOSITORIO)
        private readonly estadoIngresoRepo: EstadoIngresoRepositorio,
    ){}

    async obtenerIdPorNombre(estado: string): Promise<Number | null> {
        return await this.estadoIngresoRepo.obtenerIdPorNombre(estado);
    }
    
}
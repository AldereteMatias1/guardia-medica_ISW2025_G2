import { Inject, Injectable } from "@nestjs/common";
import * as estadoIngresoRepositoryInterface from "../../../../src/persistence/estado-ingreso/estado.ingreso.repository.interface";
import { IEstadoIngresoServicio } from "./estado.ingreso.service.interface";

@Injectable()
export class ServicioEstadoIngreso implements IEstadoIngresoServicio {

    constructor(
        @Inject(estadoIngresoRepositoryInterface.ESTADO_INGRESO_REPOSITORIO)
        private readonly estadoIngresoRepo: estadoIngresoRepositoryInterface.IEstadoIngresoRepositorio,
    ){}

    async obtenerIdPorNombre(estado: string): Promise<Number | null> {
        return await this.estadoIngresoRepo.obtenerIdPorNombre(estado);
    }
    
}
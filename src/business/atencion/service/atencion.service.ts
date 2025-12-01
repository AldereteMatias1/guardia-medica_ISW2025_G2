import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ATENCION_SERVICIO, IAtencionServicio } from "./atencion.service.interface";
import { Atencion } from "../atencion.entity";
import * as atencionRepositoryInterface from "../../../../src/persistence/atencion/atencion.repository.interface";

@Injectable()
export class AtencionServicio implements IAtencionServicio {

    constructor(
        @Inject(atencionRepositoryInterface.ATENCION_REPOSITORIO)
        private readonly atencionRepositorio: atencionRepositoryInterface.IAtencionRepositorio
    ) {}

    async traerAtencion(idMedico: number): Promise<Atencion | null> {
        const atencion = await this.atencionRepositorio.traerAtencion(idMedico);
        if(!atencion){
            throw new NotFoundException();
        }
        return atencion;
    }

}
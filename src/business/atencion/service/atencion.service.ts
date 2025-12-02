import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Atencion } from "../atencion.entity";
import * as atencionRepositoryInterface from "../../../../src/persistence/atencion/atencion.repository.interface";
import { CompletarAtencionDto } from "../dto/completar.atencion.dto";
import * as ingresoRepositoryInterface from "../../../../src/persistence/ingreso/ingreso.repository.interface";
import { IAtencionServicio } from "./atencion.service.interface";

@Injectable()
export class AtencionServicio implements IAtencionServicio {

    constructor(
        @Inject(atencionRepositoryInterface.ATENCION_REPOSITORIO)
        private readonly atencionRepositorio: atencionRepositoryInterface.IAtencionRepositorio,
        @Inject(ingresoRepositoryInterface.INGRESO_REPOSITORIO)
        private readonly ingresoRepo : ingresoRepositoryInterface.IIngresoRepositorio
    ) {}

    async completarAtencion(completarAtencion: CompletarAtencionDto): Promise<void> {
        const atencion = await this.atencionRepositorio.traerAtencion(completarAtencion.idMedico);
        if(!atencion){
            throw new NotFoundException();
        }
        if(!completarAtencion.informe){
            throw new BadRequestException("El campo informe es obligatorio");
        }
        await this.atencionRepositorio.completarAtencion(atencion.getId(), completarAtencion.informe);
        await this.ingresoRepo.finalizarIngreso(atencion.getIngreso().getId());
    }

    async asociarAtencion(idMedico: number, idIngreso: number): Promise<void> {
        this.asociarAtencion(idMedico, idIngreso);
    }

    async hasIngresoEnProceso(idMedico: number): Promise<boolean> {
        return this.atencionRepositorio.hasIngresoEnProceso(idMedico);
    }

    async traerAtencion(idMedico: number): Promise<Atencion | null> {
        const atencion = await this.atencionRepositorio.traerAtencion(idMedico);
        if(!atencion){
            throw new NotFoundException();
        }
        return atencion;
    }

    

}
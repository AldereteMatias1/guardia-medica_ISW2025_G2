import { Controller, Get, Inject, Param } from "@nestjs/common";
import * as atencionServiceInterface from "../../src/business/atencion/service/atencion.service.interface";

@Controller('atencion')
export class AtencionController {

    constructor(
        @Inject(atencionServiceInterface.ATENCION_SERVICIO)
        private readonly atencionServicio: atencionServiceInterface.IAtencionServicio
    ) {}

    @Get(':idMedico')
    async traerAtencion(@Param('idMedico') idMedico: number){
        return this.atencionServicio.traerAtencion(idMedico);
    }

}
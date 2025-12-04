import { Body, Controller, Get, Inject, Param, Patch } from "@nestjs/common";
import * as atencionServiceInterface from "../../src/business/atencion/service/atencion.service.interface";
import { CompletarAtencionDto } from "../../src/business/atencion/dto/completar.atencion.dto";
import { Roles } from "../../src/auth/decorators/roles.decorator";
import { RolUsuario } from "../../src/business/usuario/usuario";

@Controller('atencion')
export class AtencionController {

    constructor(
        @Inject(atencionServiceInterface.ATENCION_SERVICIO)
        private readonly atencionServicio: atencionServiceInterface.IAtencionServicio
    ) {}

    @Get(':idMedico')
    @Roles(RolUsuario.MEDICO)
    async traerAtencion(@Param('idMedico') idMedico: number){
        return this.atencionServicio.traerAtencion(idMedico);
    }

    @Patch()
    @Roles(RolUsuario.MEDICO)
    async completarAtencion(@Body() completarAtencion: CompletarAtencionDto){
        return this.atencionServicio.completarAtencion(completarAtencion);
    }

}
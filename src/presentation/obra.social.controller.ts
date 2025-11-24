import { Controller, Get, Inject } from "@nestjs/common";
import * as obraSociaServiceInterface from "../../src/app/interfaces/obraSocial/obra.socia.service.interface";

@Controller('obra_social')
export class ObraSocialController {

    constructor(
        @Inject(obraSociaServiceInterface.OBRA_SOCIAL_SERVICIO)
        private readonly obraSocialServicio: obraSociaServiceInterface.IObraSocialServicio
    ) {}


    @Get()
    traerObrasSociales(){
        return this.obraSocialServicio.traerTodaslasObrasSociales();
    }

}
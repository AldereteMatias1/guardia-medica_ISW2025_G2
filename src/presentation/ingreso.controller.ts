import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { CreateIngresoDto } from "../business/ingreso/create-ingreso.dto";
import * as ingresoServiceInterface from "../../src/business/ingreso/service/ingreso.service.interface";

@Controller('ingreso')
export class IngresoController {

    constructor(
    @Inject(ingresoServiceInterface.SERVICIO_INGRESO)
    private readonly servicioIngreso: ingresoServiceInterface.IIngresoServicio 
    ) {}

    @Post()
    registrarIngreso(@Body() ingreso: CreateIngresoDto) {
            return this.servicioIngreso.registrarIngreso(ingreso.cuilPaciente, 
                                                         ingreso.idEnfermera, 
                                                         ingreso.informe, 
                                                         ingreso.nivelEmergencia, 
                                                         ingreso.temperatura,
                                                         ingreso.frecuenciaCardiaca,
                                                         ingreso.frecuenciaRespiratoria,
                                                         ingreso.presionSistolica,
                                                         ingreso.presionDiastolica);
    }

    @Get()
    traerIngresosPendientes(){
        return this.servicioIngreso.obtenerPendientes();
    }

}
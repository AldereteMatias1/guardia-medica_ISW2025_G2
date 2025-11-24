import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import * as ingresoServiceInterface from "../../src/app/interfaces/ingreso/ingreso.service.interface";
import { CreateIngresoDto } from "../../src/models/ingreso/create-ingreso.dto";

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
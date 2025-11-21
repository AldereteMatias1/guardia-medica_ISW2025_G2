import { Inject, Injectable } from "@nestjs/common";
import { INivelEmergenciaServicio } from "../interfaces/nivel-emergencia/nivel.emergencia.service.interface";
import { NIVEL_EMERGENCIA_REPOSITORIO } from "../interfaces/nivel-emergencia/nivel.emergencia.repository.interface";

@Injectable()
export class NivelEmergenciaServicio implements INivelEmergenciaServicio {

    constructor(
        @Inject(NIVEL_EMERGENCIA_REPOSITORIO)
        private readonly nivelEmergenciaRepo: NivelEmergenciaServicio
    ){}

    async obtenerIdPorNombre(estado: string): Promise<number | null> {
        return this.nivelEmergenciaRepo.obtenerIdPorNombre(estado);
    }
    
}
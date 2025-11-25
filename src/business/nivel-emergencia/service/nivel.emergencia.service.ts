import { Inject, Injectable } from "@nestjs/common";
import { INivelEmergenciaServicio } from "./nivel.emergencia.service.interface";
import { NIVEL_EMERGENCIA_REPOSITORIO } from "../../../../src/persistence/nivel-emergencia/nivel.emergencia.repository.interface";
import { NivelEmergenciaRepositorio } from "../../../../src/persistence/nivel-emergencia/nivel.emergencia.repository";

@Injectable()
export class NivelEmergenciaServicio implements INivelEmergenciaServicio {

    constructor(
        @Inject(NIVEL_EMERGENCIA_REPOSITORIO)
        private readonly nivelEmergenciaRepo: NivelEmergenciaRepositorio
    ){}

    async obtenerIdPorNombre(estado: string): Promise<number | null> {
        return this.nivelEmergenciaRepo.obtenerIdPorNombre(estado);
    }
    
}
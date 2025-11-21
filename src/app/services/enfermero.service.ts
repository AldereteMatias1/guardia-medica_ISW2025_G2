import { Inject, Injectable } from "@nestjs/common";
import { IEnfermeroServicio } from "../interfaces/enfemera/enfermera.service.interface";
import { Enfermera } from "../../../src/models/enfermera/enfermera.entity";
import * as enfermeraRepository from "../interfaces/enfemera/enfermera.repository";

@Injectable()
export class ServicioEnfermero implements IEnfermeroServicio{
    
    constructor(
        @Inject(enfermeraRepository.ENFERMERO_REPOSITORIO)
        private readonly enfermeroRepo: enfermeraRepository.IEnfermeroRepositorio
    ) {}

    async obtenerPorId(id: number): Promise<Enfermera | null> {
        return await this.enfermeroRepo.obtenerPorId(id);      
    }

}
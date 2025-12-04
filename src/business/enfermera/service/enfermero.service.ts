import { Inject, Injectable } from "@nestjs/common";
import { IEnfermeroServicio } from "./enfermera.service.interface";
import * as enfermeraRepositoryInterface from "../../../../src/persistence/enfermero/enfermera.repository.interface";
import { Enfermera } from "../enfermera.entity";


@Injectable()
export class ServicioEnfermero implements IEnfermeroServicio{
    
    constructor(
        @Inject(enfermeraRepositoryInterface.ENFERMERO_REPOSITORIO)
        private readonly enfermeroRepo: enfermeraRepositoryInterface.IEnfermeroRepositorio
    ) {}

    async obtenerPorId(id: number): Promise<Enfermera | null> {
        return await this.enfermeroRepo.obtenerPorId(id);      
    }

}
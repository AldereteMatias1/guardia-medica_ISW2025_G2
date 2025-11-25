import { Inject, Injectable } from "@nestjs/common";
import { IObraSocialServicio, OBRA_SOCIAL_SERVICIO } from "../interfaces/obraSocial/obra.socia.service.interface";
import * as obraSocialRepository from "../../persistence/obra-social/obra.social.repository.interface";

@Injectable()
export class ObraSocialServicio implements IObraSocialServicio {

    constructor(
        @Inject(obraSocialRepository.REPOSITORIO_OBRA_SOCIAL)
        private readonly obraSocialRepo: obraSocialRepository.IObraSocialRepositorio
    ) {}

    async traerTodaslasObrasSociales(): Promise<string[] | null> {
        return await this.obraSocialRepo.traerTodasLasObrasSociales();
    }

}
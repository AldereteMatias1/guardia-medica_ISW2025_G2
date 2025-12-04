import { Inject, Injectable } from "@nestjs/common";
import { IObraSocialServicio } from "./obra.socia.service.interface";
import * as obraSocialRepositoryInterface from "../../../../src/persistence/obra-social/obra.social.repository.interface";

@Injectable()
export class ObraSocialServicio implements IObraSocialServicio {

    constructor(
        @Inject(obraSocialRepositoryInterface.REPOSITORIO_OBRA_SOCIAL)
        private readonly obraSocialRepo: obraSocialRepositoryInterface.IObraSocialRepositorio
    ) {}

    async traerTodaslasObrasSociales(): Promise<string[] | null> {
        return await this.obraSocialRepo.traerTodasLasObrasSociales();
    }

}
import { Paciente } from "src/models/paciente/paciente";
import { IPacienteServicio } from "../interfaces/paciente.service";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REPOSITORIO_OBRA_SOCIAL } from "../interfaces/obra.social.repository";
import { ObraSocialRepositorio } from "../../persistence/obra.social.repository";


@Injectable()
export class PacienteServicio implements IPacienteServicio {
    private readonly pacientes: Paciente[] = [];

    constructor(
        @Inject(REPOSITORIO_OBRA_SOCIAL)
        private readonly obraSocialRepo: ObraSocialRepositorio,
      ) {}

    registrarPaciente(paciente: Paciente, numeroAfiliado: number): Paciente {
        
        if(numeroAfiliado !== 0){
            if(!this.obraSocialRepo.existePorNombre(paciente.ObraSocial) || !this.obraSocialRepo.afiliadoAlPaciente(paciente.Cuil, numeroAfiliado)){
                throw new NotFoundException();
            }
        }
        this.pacientes.push(paciente);
        return paciente;
    }

}
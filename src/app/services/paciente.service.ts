import { Paciente } from "src/models/paciente/paciente";
import { IPacienteServicio } from "../interfaces/paciente.service";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REPOSITORIO_OBRA_SOCIAL } from "../interfaces/obra.social.repository";
import { ObraSocialRepositorio } from "../../persistence/obra.social.repository";
import * as patientRepository from "../interfaces/patient.repository";


@Injectable()
export class PacienteServicio implements IPacienteServicio {
    private readonly pacientes: Paciente[] = [];

    constructor(
        @Inject(REPOSITORIO_OBRA_SOCIAL)
        private readonly obraSocialRepo: ObraSocialRepositorio,
        @Inject(patientRepository.PACIENTE_REPOSITORIO)
        private readonly patientRepo: patientRepository.PacienteRepositorio
      ) {}

        buscarPacientePorCuil(cuil: string): Paciente | null {
            return this.pacientes.find(p => p.getCuil() === cuil) ?? null;
        }

        registrarPaciente(paciente: Paciente): Paciente {
        const afiliado = paciente.getObraSocial();

        if (afiliado !== undefined) {
            const nombreObra = afiliado.getObraSocial().getNombre();

            const existe = this.obraSocialRepo.existePorNombre(nombreObra);
            const vinculado = this.obraSocialRepo.afiliadoAlPaciente(
            paciente.getCuil(),
            afiliado.getNumeroAfiliado()
            );

            if (!existe) throw new NotFoundException('Obra social inexistente');
            if (!vinculado) throw new NotFoundException('Afiliacion no existente');
        }

        this.pacientes.push(paciente);
        return paciente;
        }

}
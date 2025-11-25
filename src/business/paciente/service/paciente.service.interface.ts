import { CreatePacienteDto } from "../dto/create.patient.dto";
import { Paciente } from "../paciente";

export const SERVICIO_PACIENTE = Symbol('SERVICIO_PACIENTE');

export interface IPacienteServicio {
    registrarPaciente(createPacienteDto: CreatePacienteDto) : Promise<Paciente>;
    buscarPacientePorCuil(cuil: string): Promise<Paciente | null>;
}
import { CreatePacienteDto } from "../../../models/paciente/dto/create.patient.dto";
import { Paciente } from "../../../models/paciente/paciente";

export const SERVICIO_PACIENTE = Symbol('SERVICIO_PACIENTE');

export interface IPacienteServicio {
    registrarPaciente(createPacienteDto: CreatePacienteDto) : Paciente;
    buscarPacientePorCuil(cuil: string): Paciente | null;
}
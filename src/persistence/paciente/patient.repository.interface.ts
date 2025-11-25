import { Paciente } from "../../../src/business/paciente/paciente";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface IPacienteRepositorio {
    guardarPaciente(patient: Paciente): Promise<void>;
    buscarPacientePorCuil(cuil: string): Promise<Paciente | null>;
};

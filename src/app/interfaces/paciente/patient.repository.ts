import { Paciente } from "src/models/paciente/paciente";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface PacienteRepositorio {
    guardarPaciente(patient: Paciente): void;
    buscarPacientePorCuil(cuil: string): Paciente | null;
    obtenerTodos(): Paciente[];
    borrarPorCuil(cuil: string): void;
    clear(): void;
};

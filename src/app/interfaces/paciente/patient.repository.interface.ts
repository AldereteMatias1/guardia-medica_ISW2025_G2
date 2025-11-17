import { Paciente } from "src/models/paciente/paciente";

export const PACIENTE_REPOSITORIO = Symbol('PACIENTE_REPOSITORIO');

export interface IPacienteRepositorio {
    guardarPaciente(patient: Paciente): Promise<void>;
    buscarPacientePorCuil(cuil: string): Promise<Paciente | null>;
    obtenerTodos(): Paciente[];
    borrarPorCuil(cuil: string): void;
    clear(): void;
};

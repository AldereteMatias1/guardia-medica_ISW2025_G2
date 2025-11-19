import { Paciente } from "../../src/models/paciente/paciente";

export interface PacienteRepositorio {
    buscarPacientePorCuil(cuil: string): Paciente | null;
    guardarPaciente(paciente: Paciente): void;
    obtenerTodos(): Paciente[];
    borrarPorCuil(cuil: string): void;
    clear(): void;
}
import { Paciente } from "../../src/business/paciente/paciente";


export interface PacienteRepositorio {
    buscarPacientePorCuil(cuil: string): Paciente | null;
    guardarPaciente(paciente: Paciente): void;
    obtenerTodos(): Paciente[];
    borrarPorCuil(cuil: string): void;
    clear(): void;
}
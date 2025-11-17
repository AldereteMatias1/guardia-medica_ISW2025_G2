

import { Paciente } from "src/models/paciente/paciente"; 
import { PacienteRepositorio } from "./paciente.repository.interface.mock";

export class DataBaseInMemory implements  PacienteRepositorio {

  private patients: Paciente[] = [];

  buscarPacientePorCuil(cuil: string): Paciente | null {
    return this.patients.find(p => p.getCuil() === cuil) ?? null;
  }

  guardarPaciente(paciente: Paciente): void {
    const index = this.patients.findIndex(p => p.getCuil() === paciente.getCuil());
    if (index !== -1) this.patients[index] = paciente;
    else this.patients.push(paciente);
  }
  obtenerTodos(): Paciente[] {
    return [...this.patients];
  }

  borrarPorCuil(cuil: string): void {
    const index = this.patients.findIndex(p => p.getCuil() === cuil);
    if (index !== -1) this.patients.splice(index, 1);
  }
  clear(): void {
    this.patients.length = 0;
  }
}


import { PacienteRepositorio } from "../../src/app/interfaces/patient.repository";
import { Paciente } from "src/models/paciente/paciente"; 

export class DataBaseInMemory implements  PacienteRepositorio {

  private patients: Paciente[] = [];

  buscarPacientePorCuil(cuil: string): Paciente | null {
    return this.patients.find(p => p.Cuil === cuil) ?? null;
  }

  guardarPaciente(paciente: Paciente): void {
    const index = this.patients.findIndex(p => p.Cuil === paciente.Cuil);
    if (index !== -1) this.patients[index] = paciente;
    else this.patients.push(paciente);
  }
  obtenerTodos(): Paciente[] {
    return [...this.patients];
  }

  borrarPorCuil(cuil: string): void {
    const index = this.patients.findIndex(p => p.Cuil === cuil);
    if (index !== -1) this.patients.splice(index, 1);
  }
  clear(): void {
    this.patients.length = 0;
  }
}

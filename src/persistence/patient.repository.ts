import { Injectable } from "@nestjs/common";
import { PacienteRepositorio } from "src/app/interfaces/paciente/patient.repository";
import { Paciente } from "src/models/paciente/paciente";

@Injectable()
export class PatientRepositoryImpl implements PacienteRepositorio {
  pacientes : Paciente[];
  obtenerTodos(): Paciente[] {
    return [...this.pacientes]; //copia
  }
  borrarPorCuil(cuil: string): void {
    this.pacientes = this.pacientes.filter(p => p.getCuil() !== cuil);
  }
  clear(): void {
    this.pacientes = [];
  }
  buscarPacientePorCuil(cuil: string): Paciente| null {
    const paciente = this.pacientes.find(p=>p.getCuil() === cuil)
    return paciente ?? null;
  }
  guardarPaciente(patient: Paciente): void {
    this.pacientes.push();
  }
}
// src/models/paciente/repository/patient.repository.inMem.ts
import { Paciente } from '../paciente';
import { PatientRepository } from './paciente.repository';


export class InMemoryPatientRepository implements PatientRepository {
  private readonly pacientes: Paciente[] = [];

  save(paciente: Paciente): void {
    const i = this.pacientes.findIndex(p => p.Cuil === paciente.Cuil);
    if (i !== -1) this.pacientes[i] = paciente;
    else this.pacientes.push(paciente);
  }

  findAll(): Paciente[] {
    return [...this.pacientes];
  }

  buscarPacientePorCuil(cuil: string): Paciente | null {
    return this.pacientes.find(p => p.Cuil === cuil) ?? null;
  }

  borrarPorCuil(cuil: string): void {
    const i = this.pacientes.findIndex(p => p.Cuil === cuil);
    if (i !== -1) this.pacientes.splice(i, 1);
  }

  clear(): void {
    this.pacientes.length = 0;
  }
}

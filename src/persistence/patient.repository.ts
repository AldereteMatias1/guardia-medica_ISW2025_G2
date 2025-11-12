import { Injectable } from '@nestjs/common';
import { PacienteRepositorio } from 'src/app/interfaces/paciente/patient.repository';
import { Paciente } from 'src/models/paciente/paciente';

@Injectable()
export class PatientRepositoryImpl implements PacienteRepositorio {
  obtenerTodos(): Paciente[] {
    throw new Error('Method not implemented.');
  }
  borrarPorCuil(cuil: string): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  buscarPacientePorCuil(cuil: string): Paciente | null {
    throw new Error('Method not implemented.');
  }
  guardarPaciente(patient: Paciente): void {
    throw new Error('Method not implemented.');
  }
}

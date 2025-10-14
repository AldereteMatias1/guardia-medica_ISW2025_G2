import { Paciente } from '../paciente';

export interface PatientRepository {
  save(paciente: Paciente): void;
  findAll(): Paciente[];
  buscarPacientePorCuil(cuil: string): Paciente | null;
  borrarPorCuil(cuil: string): void;
  clear(): void;
}

import { Paciente } from 'src/models/paciente/paciente';

export const SERVICIO_PACIENTE = Symbol('SERVICIO_PACIENTE');

export interface IPacienteServicio {
  registrarPaciente(paciente: Paciente): Paciente;
  buscarPacientePorCuil(cuil: string): Paciente | null;
}

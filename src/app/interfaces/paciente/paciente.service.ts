import { Paciente } from 'src/models/paciente/paciente';

export const SERVICIO_PACIENTE = Symbol('SERVICIO_PACIENTE');

export interface IPacienteServicio {
  registrarPaciente(paciente: Paciente, numeroAfiliado: number): Paciente;
  buscarPacientePorCuil(cuil: string): Paciente | null;
}

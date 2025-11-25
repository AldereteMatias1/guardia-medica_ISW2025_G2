import { Medico } from '../../models/medico/medico.entity';

export const MEDICO_REPOSITORIO = 'MEDICO_REPOSITORIO';

export interface IMedicoRepositorio {
  obtenerPorEmail(email: string): Promise<Medico | null>;
  obtenerPorId(id: number): Promise<Medico | null>;
  actualizarMedico(medico: Medico): Promise<void>;
  asociarUsuarioMedico(medicoId: number, usuarioId: number): Promise<void>;
}
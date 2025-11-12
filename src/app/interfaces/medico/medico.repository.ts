import { Medico } from '../../../models/medico/medico.entity';

export const MEDICO_REPOSITORIO = 'MEDICO_REPOSITORIO';

export interface IMedicoRepositorio {
  obtenerPorEmail(email: string): Medico | null;
  actualizarMedico(medico: Medico): void;
}
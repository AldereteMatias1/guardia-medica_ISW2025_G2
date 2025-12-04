import { Enfermera } from "../../../src/business/enfermera/enfermera.entity";


export const ENFERMERO_REPOSITORIO = 'ENFERMERA_REPOSITORIO';

export interface IEnfermeroRepositorio {
  obtenerPorEmail(email: string): Promise<Enfermera | null>;
  obtenerPorId(id: number): Promise<Enfermera | null>;
  actualizarEnfermera(enfermera: Enfermera): Promise<void>;
  asociarUsuarioEnfermera(enfermeraId: number, usuarioId: number): Promise<void>;
}
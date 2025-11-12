import { Enfermera } from "../../../models/enfermera/enfermera.entity";

export const ENFERMERO_REPOSITORIO = 'ENFERMERA_REPOSITORIO';

export interface IEnfermeroRepositorio {
  obtenerPorEmail(email: string): Enfermera | null;
  obtenerPorId(id: number): Enfermera | null;
  actualizarEnfermera(enfermera: Enfermera): void;
}
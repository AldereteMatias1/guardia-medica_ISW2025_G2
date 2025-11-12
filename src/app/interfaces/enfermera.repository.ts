import { Enfermera } from 'src/models/enfermera/enfermera.entity';

export const ENFERMERA_REPOSITORIO = Symbol('ENFERMERA_REPOSITORIO');

export interface IEnfermeraRepositorio {
  buscarPorId(id: number): Enfermera | null;
  obtenerTodas(): Enfermera[];
  guardar(enfermera: Enfermera): void;
}

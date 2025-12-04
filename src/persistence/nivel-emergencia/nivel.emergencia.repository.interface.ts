
export const NIVEL_EMERGENCIA_REPOSITORIO = 'NIVEL_EMERGENCIA_REPOSITORIO';

export interface INivelEmergenciaRepositorio {
  obtenerIdPorNombre(estado: string): Promise<number | null>;
}
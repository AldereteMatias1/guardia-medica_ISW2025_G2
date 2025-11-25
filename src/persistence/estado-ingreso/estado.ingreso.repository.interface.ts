
export const ESTADO_INGRESO_REPOSITORIO = 'ESTADO_INGRESO_REPOSITORIO';

export interface IEstadoIngresoRepositorio {
  obtenerIdPorNombre(estado: string): Promise<number | null>;
}
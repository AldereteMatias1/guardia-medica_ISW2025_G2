
export const SERVICIO_ESTADO_INGRESO = 'SERVICIO_ESTADO_INGRESO';

export interface IEstadoIngresoServicio {
  obtenerIdPorNombre(estado: string): Promise<Number | null>;
}
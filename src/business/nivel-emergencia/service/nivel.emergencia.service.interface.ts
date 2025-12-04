
export const NIVEL_EMERGENCIA_SERVICIO = 'NIVEL_EMERGENCIA_SERVICIO';

export interface INivelEmergenciaServicio {
  obtenerIdPorNombre(estado: string): Promise<number | null>;
}
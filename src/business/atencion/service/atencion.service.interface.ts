import { Atencion } from "../atencion.entity";

export const ATENCION_SERVICIO = "ATENCION_SERVICIO";

export interface IAtencionServicio {
    traerAtencion(idMedico: number): Promise<Atencion | null>;
    hasIngresoEnProceso(idMedico: number): Promise<boolean>;
    asociarAtencion(idMedico: number, idIngreso: number): Promise<void>;
}
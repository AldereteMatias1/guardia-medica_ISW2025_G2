import { Atencion } from "src/business/atencion/atencion.entity";

export const ATENCION_REPOSITORIO = "ATENCION_REPOSITORIO";

export interface IAtencionRepositorio {
    completarAtencion(idIngreso: number, informe: string): Promise<void>;
    traerAtencion(idMedico: number): Promise<Atencion | null>;
    asociarAtencion(idMedico: number, idIngreso: number): Promise<void>;
    hasIngresoEnProceso(idMedico: number): Promise<boolean>;
}
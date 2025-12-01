import { Atencion } from "src/business/atencion/atencion.entity";

export const ATENCION_REPOSITORIO = "ATENCION_REPOSITORIO";

export interface IAtencionRepositorio {
    traerAtencion(idMedico: number): Promise<Atencion | null>;
    guardarAtencion(idMedico: number, idIngreso: number): Promise<void>;
}
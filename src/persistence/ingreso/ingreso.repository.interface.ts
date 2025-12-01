import { Ingreso } from "../../business/ingreso/ingreso";

export const INGRESO_REPOSITORIO = Symbol('INGRESO_REPOSITORIO');

export interface IIngresoRepositorio {
  reclamarSiguienteIngreso(): Promise<Ingreso | null>;
  guardar(ingreso: Ingreso): Promise<void>;
  obtenerPendientes(): Promise<Ingreso[]>;
}
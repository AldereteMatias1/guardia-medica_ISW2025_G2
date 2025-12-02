import { Ingreso } from "../../business/ingreso/ingreso";

export const INGRESO_REPOSITORIO = Symbol('INGRESO_REPOSITORIO');

export interface IIngresoRepositorio {
  finalizarIngreso(idIngreso: number): Promise<void>;
  findById(idIngreso: number): Promise<Ingreso | null>;
  reclamarSiguienteIngreso(): Promise<Ingreso | null>;
  guardar(ingreso: Ingreso): Promise<void>;
  obtenerPendientes(): Promise<Ingreso[]>;
}
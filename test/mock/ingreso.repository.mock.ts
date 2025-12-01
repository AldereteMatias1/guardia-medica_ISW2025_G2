import { IIngresoRepositorio } from "../../src/persistence/ingreso/ingreso.repository.interface";
import { Ingreso } from "../../src/business/ingreso/ingreso";

export class IngresoRepoInMemory implements IIngresoRepositorio {
  
  reclamarSiguienteIngreso(): Promise<Ingreso | null> {
    throw new Error("Method not implemented.");
  }

  private ingresos: Ingreso[] = [];

  async guardar(ingreso: Ingreso): Promise<void> {
    this.ingresos.push(ingreso);
  }

  async obtenerPendientes(): Promise<Ingreso[]> {
    return this.ingresos.filter(i => i.getEstadoIngreso() === "Pendiente");
  }

  clear() {
    this.ingresos = [];
  }
}
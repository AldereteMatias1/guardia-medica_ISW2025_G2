import { IIngresoRepositorio } from "../../src/app/interfaces/ingreso/ingreso.repository.interface";
import { Ingreso } from "../../src/models/ingreso/ingreso";

export class IngresoRepoInMemory implements IIngresoRepositorio {

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
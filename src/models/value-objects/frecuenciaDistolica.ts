import { Frecuencia } from "./frecuencia";

export class FrecuenciaDistolica extends Frecuencia {
  public constructor(valor: number) {
    super("presion diastolica", valor);
  }
}

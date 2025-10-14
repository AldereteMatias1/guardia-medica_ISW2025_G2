import { Frecuencia } from "./frecuencia";

export class FrecuenciaSistolica extends Frecuencia {
  public constructor(valor: number) {
    // Se usa como componente de Tension arterial
    super("presion sistolica", valor);
  }
}

import { Frecuencia } from "./frecuencia";

export class FrecuenciaRespiratoria extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia respiratoria", valor);
    //pidem frecuencia Cardiaca
  }
}

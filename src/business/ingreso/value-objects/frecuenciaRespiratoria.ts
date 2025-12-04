import { Frecuencia } from "./frecuencia";

export class FrecuenciaRespiratoria extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia respiratoria", valor);
    //preg si ponemos rangos validos
  }
}

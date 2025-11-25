import { Frecuencia } from "./frecuencia";

export class FrecuenciaCardiaca extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia cardiaca", valor); 
    //preg si establecemos un rango o no
  }
}

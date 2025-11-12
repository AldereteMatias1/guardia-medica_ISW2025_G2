import { Frecuencia } from "./frecuencia";

export class FrecuenciaCardiaca extends Frecuencia {
  public constructor(valor: number) {
    super("frecuencia cardiaca", valor); 
    //por conveniencia no se estableció un rango- si se valida de todas maneras
  }
}

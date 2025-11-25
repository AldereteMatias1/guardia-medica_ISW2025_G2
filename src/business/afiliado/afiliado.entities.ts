import { ObraSocial } from "../obra-social/obra-social.entity";

export class Afiliado {
  id: number;
  numeroAfiliado: number;
  obraSocial: ObraSocial;

  constructor(numeroAfiliado: number, obraSocial: ObraSocial);
  constructor(id: number, numeroAfiliado: number, obraSocial: ObraSocial);

  constructor(
    idOrNumero: number,
    numeroOrObra: number | ObraSocial,
    obraSocialMaybe?: ObraSocial,
  ) {
    if (obraSocialMaybe) {
      this.id = idOrNumero;
      this.numeroAfiliado = numeroOrObra as number;
      this.obraSocial = obraSocialMaybe;
    } else {
      this.numeroAfiliado = idOrNumero;
      this.obraSocial = numeroOrObra as ObraSocial;
    }
  }

  public getNumeroAfiliado(): number {
    return this.numeroAfiliado;
  }

  public getObraSocial(): ObraSocial {
    return this.obraSocial;
  }

}
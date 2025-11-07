import { Afiliado } from "../afiliado/afiliado.entities";
import { Domicilio } from "../domicilio/domicililio.entities";

export class Paciente {
  private nombre: string;
  private apellido: string;
  private cuil: string;
  private obraSocial: string;
  private domicilio?: Domicilio;
  private afiliado?: Afiliado;

  constructor(nombre: string, apellido: string, cuil: string, obraSocial: string);
  constructor(
    nombre: string,
    apellido: string,
    cuil: string,
    obraSocial: string,
    domicilio: Domicilio,
    afiliado?: Afiliado
  );

  constructor(
    nombre: string,
    apellido: string,
    cuil: string,
    obraSocial: string,
    domicilio?: Domicilio,
    afiliado?: Afiliado
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.cuil = cuil;
    this.obraSocial = obraSocial;
    if (domicilio) this.domicilio = domicilio;
    if (afiliado) this.afiliado = afiliado;
  }


  public get Cuil(): string {
    return this.cuil;
  }

  public get Domicilio(): Domicilio | undefined {
    return this.domicilio;
  }

  public get ObraSocial(): string {
    return this.obraSocial;
  }

}
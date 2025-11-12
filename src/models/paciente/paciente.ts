import { Afiliado } from '../afiliado/afiliado.entities';
import { Domicilio } from '../domicilio/domicililio.entities';
import { Persona } from '../persona/persona.entity';

export class Paciente extends Persona {
  private obraSocial?: Afiliado;
  private domicilio?: Domicilio;

  constructor(
    nombre: string,
    apellido: string,
    cuil: string,
    obraSocial?: Afiliado,
    domicilio?: Domicilio,
  );

  constructor(
    nombre: string,
    apellido: string,
    cuil: string,
    obraSocial?: Afiliado,
    domicilio?: Domicilio,
  ) {
    super(nombre, apellido, cuil);
    this.obraSocial = obraSocial;
    this.domicilio = domicilio;
  }

  public getDomicilio(): Domicilio | undefined {
    return this.domicilio;
  }

  public getObraSocial(): Afiliado | undefined {
    return this.obraSocial;
  }
}

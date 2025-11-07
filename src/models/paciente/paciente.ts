import { Afiliado } from "../afiliado/afiliado.entities";
import { Domicilio } from "../domicilio/domicililio.entities";
import { Persona } from "../persona/persona.entity";
import { Cuil } from "../value-objects/cuil";

export class Paciente extends Persona{
  
  private obraSocial?: Afiliado;
  private domicilio?: Domicilio; 

  constructor(
    nombre: string,
    apellido: string,
    cuil: Cuil,
    obraSocial?: Afiliado,
    domicilio?: Domicilio
  );

  constructor(
    nombre: string,
    apellido: string,
    cuil: Cuil,
    email: string,
    obraSocial?: Afiliado,
    domicilio?: Domicilio
  );

  constructor(
    nombre: string,
    apellido: string,
    cuil: Cuil,
    emailOrObraSocial?: string | Afiliado,
    obraSocialOrDomicilio?: Afiliado | Domicilio,
    domicilioOpt?: Domicilio
  ) {
    if (typeof emailOrObraSocial === "string") {
      super(nombre, apellido, cuil, emailOrObraSocial);
      this.obraSocial = obraSocialOrDomicilio as Afiliado;
      this.domicilio = domicilioOpt;
    } else {
      super(nombre, apellido, cuil, "");
      this.obraSocial = emailOrObraSocial as Afiliado;
      this.domicilio = obraSocialOrDomicilio as Domicilio;
    }
  }

  public getDomicilio(): Domicilio | undefined {
    return this.domicilio;
  }

  public getObraSocial(): Afiliado | undefined {
    return this.obraSocial;
  }
 
}
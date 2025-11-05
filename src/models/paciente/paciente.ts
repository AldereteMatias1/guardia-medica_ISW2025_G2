import { Afiliado } from "../afiliado/afiliado.entities";
import { Domicilio } from "../domicilio/domicililio.entities";

export class Paciente {
  private nombre: string;
  private apellido: string;
  private cuil: string;
  private obraSocial: string;
  private domicilio?: Domicilio;
  private afiliado?: Afiliado;

  public constructor(
    nombre: string,
    apellido: string,
    cuil: string,
    obraSocial: string,
){
    this.nombre = nombre;
    this.apellido = apellido;
    this.cuil = cuil;
    this.obraSocial = obraSocial;
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

  public asignarDomicilio(domicilio: Domicilio): void {
  this.domicilio = domicilio;
}
  public afiliarObraSocial(): void{
    this.afiliado = this.afiliado;
  }
}
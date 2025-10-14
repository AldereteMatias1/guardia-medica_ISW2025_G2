export class Paciente {
  private nombre: string;
  private apellido: string;
  private cuil: string;
  private obraSocial: string;

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
}
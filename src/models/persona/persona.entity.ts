export abstract class Persona {
  protected nombre: string;
  protected apellido: string;
  protected cuil: string;

  constructor(nombre: string, apellido: string, cuil: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.cuil = cuil;
  }

  getNombre(): string {
    return this.nombre;
  }
  getApellido(): string {
    return this.apellido;
  }
  getCuil(): string {
    return this.cuil;
  }
}

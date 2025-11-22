import { Usuario } from '../usuario/usuario';

export class Medico {
  private id: number;
  private nombre: string;
  private apellido: string;
  private matricula: string | undefined;
  private usuario: Usuario | undefined;

  public constructor(nombre: string, apellido: string);
  public constructor(nombre: string, apellido: string, matricula: string);
  public constructor(
    nombre: string,
    apellido: string,
    matricula: string,
    id: number,
  );

  public constructor(
    nombre: string,
    apellido: string,
    matricula?: string,
    id?: number,
  ) {
    this.nombre = nombre;
    this.apellido = apellido;

    if (matricula) this.matricula = matricula;
    if (id) this.id = id;
  }

  asociarUsuario(usuario: Usuario) {
    this.usuario = usuario;
  }

  public getId(): number {
    return this.id;
  }
}

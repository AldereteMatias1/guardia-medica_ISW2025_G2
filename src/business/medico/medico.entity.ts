import { Usuario } from '../usuario/usuario';

export class Medico {
  private id: number;
  private nombre: string;
  private apellido: string;
  private matricula: string | undefined;
  private usuario: Usuario | undefined;
  private id_usuario: number | undefined;

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
    id_usuario?: number,
  ) {
    this.nombre = nombre;
    this.apellido = apellido;

    if (matricula) this.matricula = matricula;
    if (id) this.id = id;
    if (id_usuario) this.id_usuario = id_usuario;
  }

  asociarUsuario(usuario: Usuario) {
    this.usuario = usuario;
  }

  public getId(): number {
    return this.id;
  }
  public getUsuario() {
    return this.id_usuario;
  }
}

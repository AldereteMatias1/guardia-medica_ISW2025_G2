import { Usuario } from "../usuario/usuario";

export class Medico {
    private nombre:string;
    private apellido:string;
    private matricula:string | undefined;
    private usuario: Usuario | undefined;

    public constructor(nombre: string, apellido: string);

    public constructor(nombre: string, apellido: string, matricula: string);
    public constructor(nombre: string, apellido: string, matricula?: string) {
        this.nombre = nombre;
        this.apellido = apellido;        
        if (matricula) {
            this.matricula = matricula;
        }
    }

    asociarUsuario(usuario: Usuario) {
        this.usuario = usuario;
    }
}

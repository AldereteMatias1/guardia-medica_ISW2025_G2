import { Usuario } from "../usuario/usuario";

export class Medico {
    private nombre:string;
    private apellido:string;
    private usuario: Usuario | undefined;

    public constructor(nombre:string,apellido:string){
        this.nombre = nombre;
        this.apellido = apellido;
    }

    asociarUsuario(usuario: Usuario) {
        this.usuario = usuario;
    }
}

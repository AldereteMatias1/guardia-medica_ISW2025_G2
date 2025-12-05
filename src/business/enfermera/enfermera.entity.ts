import { Usuario } from "../usuario/usuario";

export class Enfermera {
    private id: number;
    private nombre:string;
    private apellido:string;
    private cuil:string | undefined;
    private matricula:string | undefined;
    private id_usuario:number | undefined;
    private usuario: Usuario | undefined;

    public constructor(nombre: string, apellido: string);
    public constructor(nombre: string, apellido: string, matricula: string);
    public constructor(nombre: string, apellido: string, id: number);
    public constructor(nombre: string, apellido: string, matricula: string, id: number);
    public constructor(nombre: string, apellido: string, matricula: string, cuil: string, id_usuario: number);


    public constructor(
        nombre: string,
        apellido: string,
        tercero?: string | number,
        cuarto?: number | string,
        quinto?: number
    ) {
        this.nombre = nombre;
        this.apellido = apellido;

        if (typeof tercero === 'string') {
            this.matricula = tercero;
        } else if (typeof tercero === 'number') {
            this.id = tercero;
        }

        if (typeof cuarto === 'number') {
            this.id = cuarto;
        }else if (typeof cuarto === 'string') {
            this.cuil = cuarto;
        }
        if (typeof quinto === 'number') {
            this.id_usuario = quinto;
        }

    }

    asociarUsuario(usuario: Usuario) {
        this.usuario = usuario;
    }

    public getNombre(){
        return this.nombre;
    }

    public getApellido(){
        return this.apellido;
    }

    public getId(){
        return this.id;
    }

    public getUsuario(){
        return this.id_usuario;
    }

}

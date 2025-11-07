export abstract class Persona {
    protected nombre: string;
    protected apellido: string;
    protected cuil: string;
    protected email?: string;

    constructor(nombre: string, apellido: string, cuil: string, email?: string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.cuil = cuil;
        this.email = email;
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

    getEmail(): string | undefined{
        return this.email;
    }
}
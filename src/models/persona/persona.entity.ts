
export abstract class Persona {
    private nombre: string;
    private apellido: string;
    private cuil: string;
    private email?: string;

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
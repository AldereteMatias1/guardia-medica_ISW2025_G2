import { UUID } from "crypto";
import { Afiliado } from "../afiliado/afiliado.entities";

export class ObraSocial {
    id: UUID; 
    nombre: string;
    afiliados: Afiliado[] = [];;

    constructor(nombre: string);
    constructor(id: UUID, nombre: string);

    
    constructor(idOrNombre: UUID | string, nombreMaybe?: string) {
        if (nombreMaybe !== undefined) {
            this.id = idOrNombre as UUID;
            this.nombre = nombreMaybe;
        } else {
            this.nombre = idOrNombre as string;
        }
    }

    public getNombre(): string {
        return this.nombre;
    }

    public agregarAfiliado(afiliado: Afiliado){
        this.afiliados.push(afiliado);
    }

    public getAfiliados(): readonly Afiliado[] {
    return this.afiliados;
    }
}
import { UUID } from "crypto";
import { Afiliado } from "../afiliado/afiliado.entities";

export class ObraSocial {
    id: UUID; 
    nombre: string;
    afiliados: Afiliado[] = [];;

    constructor(id: UUID, nombre: string){
        this.id = id;
        this.nombre = nombre;
    }

    public agregarAfiliado(afiliado: Afiliado){
        this.afiliados.push(afiliado);
    }
}
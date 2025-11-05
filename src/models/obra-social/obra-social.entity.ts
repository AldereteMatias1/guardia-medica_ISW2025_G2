import { UUID } from "crypto";
import { Afiliado } from "../afiliado/afiliado.entities";

export class ObraSocial {
    id: UUID; 
    nombre: string;
    afiliados: Afiliado[];
}
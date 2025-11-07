import { ObraSocial } from "../obra-social/obra-social.entity";

export class Afiliado {
    id: number;
    numeroAfiliado: number;
    obraSocial: ObraSocial;


    constructor(id: number, numeroAfiliado: number, obraSocial: ObraSocial){
        this.id = id,
        this.numeroAfiliado = numeroAfiliado;
        this.obraSocial = obraSocial;
    }

    public getNumeroAfiliado(): number {
    return this.numeroAfiliado;
    }

    public getObraSocial(): ObraSocial {
        return this.obraSocial; 
    }

}
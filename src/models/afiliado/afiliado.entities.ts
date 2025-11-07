import { ObraSocial } from "../obra-social/obra-social.entity";
import { Paciente } from "../paciente/paciente";

export class Afiliado {
    id: number;
    numeroAfiliado: number;
    obraSocial: ObraSocial;
    paciente: Paciente;

    constructor(id: number, numeroAfiliado: number, obraSocial: ObraSocial, paciente: Paciente){
        this.id = id,
        this.numeroAfiliado = numeroAfiliado;
        this.obraSocial = obraSocial;
        this.paciente = paciente;
    }

}
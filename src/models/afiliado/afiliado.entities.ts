import { ObraSocial } from "../obra-social/obra-social.entity";
import { Paciente } from "../paciente/paciente";

export class Afiliado {
    numeroAfiliado: number;
    obraSocial: ObraSocial;
    paciente: Paciente;
}
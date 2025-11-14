import { Injectable } from "@nestjs/common";
import { IObraSocial } from "src/app/interfaces/obraSocial/obra.social.repository";
import { Afiliado } from "../models/afiliado/afiliado.entities";
import { ObraSocial } from "../models/obra-social/obra-social.entity";

@Injectable()
export class ObraSocialRepositorio implements IObraSocial {
    private obrasSociales:Map<string,ObraSocial> = new Map();
    private afiliaciones:Map<string,Afiliado[]>= new Map();
    constructor(){
        const osecac = new ObraSocial("OSECAC");
        const afiliado = new Afiliado(15820,osecac); 
        osecac.agregarAfiliado(afiliado); //vinculamos
        this.obrasSociales.set(osecac.getNombre(),osecac);
        this.afiliaciones.set("20-41383873-9",[afiliado]);
    }
    
    existePorNombre(nombre: string): boolean {
        for(const obra of this.obrasSociales.values()){
            if(obra.getNombre() === nombre){
                return true;
            }
        }
        return false;
    }
    afiliadoAlPaciente(cuil: string, numeroAfiliado: number): boolean {
        const afiliaciones = this.afiliaciones.get(cuil);
        if (!afiliaciones) return false;

        return afiliaciones.some(afiliado=>
            afiliado.getNumeroAfiliado()=== numeroAfiliado);
    }
    
}
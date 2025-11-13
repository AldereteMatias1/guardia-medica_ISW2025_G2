import { IObraSocial } from "src/app/interfaces/obraSocial/obra.social.repository";

export class ObraSocialRepositorio implements IObraSocial {
    
    existePorNombre(nombre: string): Boolean {
        return true;
    }
    afiliadoAlPaciente(cuil: string, numeroAfiliado: number): Boolean {
        return true;
    }
    
}
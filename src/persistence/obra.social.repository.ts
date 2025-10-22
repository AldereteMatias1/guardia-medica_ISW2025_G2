import { IObraSocial } from "src/app/interfaces/obra.social.repository";

export class ObraSocialRepositorio implements IObraSocial {
    existePorNombre(nombre: string): Boolean {
        throw new Error("Method not implemented.");
    }
    afiliadoAlPaciente(cuil: string, numeroAfiliado: number): Boolean {
        throw new Error("Method not implemented.");
    }
    
}
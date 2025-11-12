import { IMedicoRepositorio } from "src/app/interfaces/medico/medico.repository";
import { Medico } from "src/models/medico/medico.entity";

export class MedicoRepositorio implements IMedicoRepositorio {
    
    obtenerPorEmail(email: string): Medico | null {
        throw new Error("Method not implemented.");
    }
    obtenerPorId(id: number): Medico | null {
        throw new Error("Method not implemented.");
    }
    actualizarMedico(medico: Medico): void {
        throw new Error("Method not implemented.");
    }
    
}
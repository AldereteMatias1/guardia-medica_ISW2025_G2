import { IEnfermeroRepositorio } from "src/app/interfaces/enfemera/enfermera.repository";
import { Enfermera } from "src/models/enfermera/enfermera.entity";

export class EnfermeroRepositorio implements IEnfermeroRepositorio {
    
    obtenerPorEmail(email: string): Enfermera | null {
        throw new Error("Method not implemented.");
    }
    obtenerPorId(id: number): Enfermera | null {
        throw new Error("Method not implemented.");
    }
    actualizarEnfermera(enfermera: Enfermera): void {
        throw new Error("Method not implemented.");
    }
    
}
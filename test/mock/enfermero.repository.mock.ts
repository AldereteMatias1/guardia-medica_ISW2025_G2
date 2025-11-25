import { IEnfermeroRepositorio } from "../../src/persistence/enfermero/enfermera.repository.interface";
import { Enfermera } from "../../src/models/enfermera/enfermera.entity";

export class EnfermeroDatabaseInMemory implements IEnfermeroRepositorio{

    
    enfermeras: Enfermera[] = [new Enfermera("Susana", "Jimenez", 1)] 
    
    asociarUsuarioEnfermera(enfermeraId: number, usuarioId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    obtenerPorEmail(email: string): Promise<Enfermera | null> {
        throw new Error("Method not implemented.");
    }
    async obtenerPorId(id: number): Promise<Enfermera | null> {
        const encontrada = this.enfermeras.find(p => p.getId() === id);
        return encontrada ?? null;
    }
    actualizarEnfermera(enfermera: Enfermera): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}
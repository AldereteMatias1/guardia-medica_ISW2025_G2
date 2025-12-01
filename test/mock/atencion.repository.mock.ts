import { IAtencionRepositorio } from "../../src/persistence/atencion/atencion.repository.interface";
import { Atencion } from "../../src/business/atencion/atencion.entity";


export class AtencionDatabaseInMemory implements IAtencionRepositorio{
    traerAtencion(idMedico: number): Promise<Atencion | null> {
        throw new Error("Method not implemented.");
    }
    asociarAtencion(idMedico: number, idIngreso: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    hasIngresoEnProceso(idMedico: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}
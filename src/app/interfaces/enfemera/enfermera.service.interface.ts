import { Enfermera } from "../../../../src/models/enfermera/enfermera.entity";

export const SERVICIO_ENFERMERO = 'SERVICIO_ENFERMERO';

export interface IEnfermeroServicio {
  obtenerPorId(id: number): Promise<Enfermera | null>;
}
import { IEnfermeraRepositorio } from 'src/app/interfaces/enfermera.repository'
import { Enfermera } from 'src/models/enfermera/enfermera.entity';

export class EnfermeraRepositoryImpl implements IEnfermeraRepositorio {
  private enfermeras = new Map<number, Enfermera>();

  constructor() {
    //HARDCODEADA X AHORA
    this.enfermeras.set(1, new Enfermera('Romina', 'Torres'));
    this.enfermeras.set(2, new Enfermera('Carla', 'López'));
  }

  buscarPorId(id: number): Enfermera | null {
    return this.enfermeras.get(id) ?? null;
  }

  obtenerTodas(): Enfermera[] {
    return Array.from(this.enfermeras.values());
  }

  guardar(enfermera: Enfermera): void {
    const nextId = this.enfermeras.size + 1;
    (enfermera as any).id = nextId;
    this.enfermeras.set(nextId, enfermera);
  }
}


import { randomUUID } from 'crypto';
import { IObraSocial } from 'src/app/interfaces/obraSocial/obra.social.repository';
import { ObraSocial } from 'src/models/obra-social/obra-social.entity';

export class ObraSocialRepositorio implements IObraSocial {
  private obras = new Map<string, ObraSocial>(); 
  private afiliaciones = new Map<string, Set<number>>(); 

  constructor() {
    const os = new ObraSocial(randomUUID(), 'PAMI');
    this.obras.set(os.getNombre().toUpperCase(), os);
    this.afiliar('20-12345678-6', 123456789);
  }
  agregarObraSocial(os: ObraSocial) {
    this.obras.set(os.getNombre().toUpperCase(), os);
  }

  afiliar(cuil: string, numeroAfiliado: number) {
    const key = cuil;
    if (!this.afiliaciones.has(key)) this.afiliaciones.set(key, new Set());
    this.afiliaciones.get(key)!.add(numeroAfiliado);
  }

  existePorNombre(nombre: string): boolean {
    return this.obras.has((nombre ?? '').toUpperCase());
  }

  afiliadoAlPaciente(cuil: string, numeroAfiliado: number): boolean {
    const set = this.afiliaciones.get(cuil);
    return !!set && set.has(numeroAfiliado);
  }
}

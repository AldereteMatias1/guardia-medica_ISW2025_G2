import { UUID } from 'crypto';
import { Afiliado } from '../afiliado/afiliado.entities';

export class ObraSocial {
  id: UUID;
  nombre: string;
  afiliados: Afiliado[] = [];

  constructor(id: UUID, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public agregarAfiliado(afiliado: Afiliado) {
    this.afiliados.push(afiliado);
  }

  public getAfiliados(): readonly Afiliado[] {
    return this.afiliados;
  }
}

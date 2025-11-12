import { FrecuenciaDistolica } from './frecuenciaDistolica';
import { FrecuenciaSistolica } from './frecuenciaSistolica';

export class TensionArterial {
  public readonly sistolica: FrecuenciaSistolica;
  public readonly diastolica: FrecuenciaDistolica;

  public constructor(sistolica: number, diastolica: number) {
    // para los mandatorios
    if (
      sistolica == null ||
      Number.isNaN(sistolica) ||
      diastolica == null ||
      Number.isNaN(diastolica)
    ) {
      throw new Error("falta el campo 'tension arterial'");
    }
    // Positivo
    if (sistolica <= 0 || diastolica <= 0) {
      throw new Error('la tension arterial debe ser positiva');
    }
    // q tenga sentido
    if (sistolica <= diastolica) {
      throw new Error('la presion sistolica debe ser mayor que la diastolica');
    }

    this.sistolica = new FrecuenciaSistolica(sistolica);
    this.diastolica = new FrecuenciaDistolica(diastolica);
  }

  toString(): string {
    return `${this.sistolica.Valor}/${this.diastolica.Valor}`;
  }
}

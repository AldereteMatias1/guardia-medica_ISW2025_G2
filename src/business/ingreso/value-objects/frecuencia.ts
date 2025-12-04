export abstract class Frecuencia {
  private readonly valor: number;
  private readonly nombre: string;

  protected constructor(nombre: string, valor: number) {
    this.nombre = nombre;
    this.assertValorPositivo(valor);
    this.valor = valor;
  }

  private assertValorPositivo(valor: number): void {
    if (valor == null || Number.isNaN(valor)) {
      throw new Error(`falta el campo '${this.nombre.toLowerCase()}'`);
    }
    if (valor <= 0) {
      throw new Error(`La ${this.nombre.toLowerCase()} debe ser positiva`);
    }
  }

  get Valor(): number {
    return this.valor;
  }
}

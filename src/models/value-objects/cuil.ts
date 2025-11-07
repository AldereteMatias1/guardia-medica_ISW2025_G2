export class Cuil {
  private readonly valor: string;

  public constructor(valor: string) {
    const cuilLimpio = this.limpiarCuil(valor);
    this.assertFormato(cuilLimpio);
    this.assertDigitoVerificador(cuilLimpio);
    this.valor = cuilLimpio;
  }


  private limpiarCuil(valor: string): string {
    return valor.replace(/[-\s]/g, '');
  }

  private assertFormato(valorLimpio: string): void {
    if (valorLimpio.length !== 11) {
      throw new Error(`El CUIL/CUIT debe tener exactamente 11 dígitos, se recibió: ${valorLimpio}`);
    }
    if (!/^\d{11}$/.test(valorLimpio)) {
      throw new Error('El CUIL/CUIT solo puede contener caracteres numéricos.');
    }
  }

  private assertDigitoVerificador(valorLimpio: string): void {
    const digitos = valorLimpio.split('').map(d => parseInt(d, 10));
    const digitoVerificador = digitos[10]; 
    const cuilBase = digitos.slice(0, 10); 
    const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    
    let suma = 0;
    for (let i = 0; i < 10; i++) {
      suma += cuilBase[i] * pesos[i];
    }

    const resto = suma % 11;
    let digitoEsperado: number;

    if (resto === 0) {
      digitoEsperado = 0;
    } else if (resto === 1) {
      digitoEsperado = 9; 
    } else {
      digitoEsperado = 11 - resto;
    }

    if (digitoVerificador !== digitoEsperado) {
      throw new Error(
        `El dígito verificador es inválido. Se esperaba ${digitoEsperado} pero se recibió ${digitoVerificador} para el CUIL/CUIT base.`
      );
    }
  }

  get Valor(): string {
    return this.valor;
  }

  get ValorFormateado(): string {
    return this.valor.replace(/^(\d{2})(\d{8})(\d{1})$/, '$1-$2-$3');
  }
}
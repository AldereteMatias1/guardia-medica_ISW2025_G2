export const REPOSITORIO_OBRA_SOCIAL = Symbol('REPOSITORIO_OBRA_SOCIAL');

export interface IObraSocial {
  existePorNombre(nombre: string): Boolean;
  afiliadoAlPaciente(cuil: string, numeroAfiliado: number): Boolean;
}

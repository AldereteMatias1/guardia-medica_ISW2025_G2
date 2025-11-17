
export const REPOSITORIO_OBRA_SOCIAL = Symbol('REPOSITORIO_OBRA_SOCIAL');

export interface IObraSocial {
    existePorNombre(nombre: string): Promise<boolean>;
    afiliadoAlPaciente(cuil:string , numeroAfiliado: number, nombreObra: string): Promise<boolean>;
}
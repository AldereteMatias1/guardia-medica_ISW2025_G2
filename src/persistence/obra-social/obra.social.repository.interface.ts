
export const REPOSITORIO_OBRA_SOCIAL = Symbol('REPOSITORIO_OBRA_SOCIAL');

export interface IObraSocialRepositorio {
    traerTodasLasObrasSociales(): string[] | PromiseLike<string[]| null >;
    existePorNombre(nombre: string): Promise<boolean>;
    afiliadoAlPaciente(cuil:string , numeroAfiliado: number, nombreObra: string): Promise<boolean>;
}
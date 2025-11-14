import { Usuario } from "../../../models/usuario/usuario"

export const USUARIO_REPOSITORIO = Symbol('USUARIO_REPOSITORIO');

export interface IUsuarioRepositorio {
    registrarUsuario(user: Usuario): Promise<Usuario>;
    login(user: Usuario): Promise<Usuario>;
    obtenerPorEmail(email: string): Promise<Usuario | null> ;
}
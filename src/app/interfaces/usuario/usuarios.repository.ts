import { Usuario } from "../../../models/usuario/usuario"

export const USUARIO_REPOSITORIO = Symbol('USUARIO_REPOSITORIO');

export interface IUsuarioRepositorio {
    registrarUsuario(user: Usuario): void;
    login(user: Usuario): Usuario;
    obtenerTodos(): Usuario[];
    obtenerPorEmail(email: string): Usuario | undefined;
    borrarPorEmail(email: string): void;
    clear(): void;
}
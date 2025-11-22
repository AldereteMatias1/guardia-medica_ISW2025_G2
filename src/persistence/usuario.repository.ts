import { DatabaseService } from "../../src/config/database/database.service";
import { IUsuarioRepositorio } from "../app/interfaces/usuario/usuarios.repository.interface";
import { RolUsuario, Usuario } from "../../src/models/usuario/usuario";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class UsuarioRepositorio implements IUsuarioRepositorio {

  constructor(
    private readonly db: DatabaseService,
  ) {}

  async registrarUsuario(user: Usuario): Promise<Usuario> {
    const rolId = await this.getRolId(user.rol);

    const existing = await this.obtenerPorEmail(user.email);
    if (existing) {
      throw new BadRequestException("El email ya está registrado");
    }

    await this.db.execute(
      `INSERT INTO usuario (email, password, id_rol)
       VALUES (?, ?, ?)`,
      [user.email, user.password, rolId]
    );

    return user; 
  }

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const rows = await this.db.query<{
      email: string;
      password: string;
      rol_nombre: string;
    }>(
      `SELECT u.email, u.password, r.nombre AS rol_nombre
       FROM usuario u
       JOIN rol r ON r.id = u.id_rol
       WHERE u.email = ?`,
       [email]
    );

    if (!rows.length) return null;

    return {
      email: rows[0].email,
      password: rows[0].password,
      rol: rows[0].rol_nombre as RolUsuario,
    };
  }

  async login(user: Usuario): Promise<Usuario> {
    const found = await this.obtenerPorEmail(user.email);
    if (!found) throw new BadRequestException("Usuario o contraseña inválidos");

    if (found.password !== user.password) {
      throw new BadRequestException("Usuario o contraseña inválidos");
    }

    return found;
  }

  private async getRolId(rol: RolUsuario): Promise<number> {
    const rows = await this.db.query<{ id: number }>(
      "SELECT id FROM rol WHERE nombre = ?",
      [rol]
    );

    if (!rows.length) {
      throw new InternalServerErrorException(`El rol ${rol} no existe en la base de datos`);
    }

    return rows[0].id;
  }

}
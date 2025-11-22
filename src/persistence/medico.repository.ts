import { InternalServerErrorException } from "@nestjs/common";
import { IMedicoRepositorio } from "../../src/app/interfaces/medico/medico.repository";
import { DatabaseService } from "../../src/config/database/database.service";
import { Medico } from "../../src/models/medico/medico.entity";
import { RolUsuario, Usuario } from "../../src/models/usuario/usuario";

export class MedicoRepositorio implements IMedicoRepositorio {

    constructor(
            private readonly db: DatabaseService,
    ) {}
    
    async obtenerPorEmail(email: string): Promise<Medico | null> {
        const rows = await this.db.query<{
          id_medico: number;
          nombre: string;
          apellido: string;
          cuil: string;
          matricula: string;
          email: string;
          rol_nombre: string;
        }>(
          `SELECT m.id              AS id_medico,
                  p.nombre          AS nombre,
                  p.apellido        AS apellido,
                  p.cuil            AS cuil,
                  m.matricula       AS matricula,
                  u.email           AS email,
                  r.nombre          AS rol_nombre
           FROM usuario u
           JOIN rol r          ON r.id = u.id_rol
           JOIN medico m    ON m.id_usuario = u.id
           JOIN persona p      ON p.id = m.id
           WHERE u.email = ?`,
          [email],
        );
    
        if (!rows.length) return null;
    
        const row = rows[0];
    
        const medico = new (require("src/models/medico/medico.entity").Medico)(
          row.nombre,
          row.apellido,
          row.matricula
        ) as Medico;
    
        const usuario: Usuario = {
          email: row.email,
          rol: row.rol_nombre as RolUsuario
        };
    
        (medico as any).asociarUsuario(usuario);
    
        return medico;
    }

    async obtenerPorId(id: number): Promise<Medico | null> {
    const rows = await this.db.query<{
      id_medico: number;
      nombre: string;
      apellido: string;
      cuil: string;
      matricula: string;
      id_usuario: number | null;
      email: string | null;
      rol_nombre: string | null;
    }>(
      `SELECT m.id          AS id_medico,
              p.nombre      AS nombre,
              p.apellido    AS apellido,
              p.cuil        AS cuil,
              m.matricula   AS matricula,
              u.id          AS id_usuario,
              u.email       AS email,
              r.nombre      AS rol_nombre
       FROM medico m
       JOIN persona p    ON p.id = m.id
       LEFT JOIN usuario u ON u.id = m.id_usuario
       LEFT JOIN rol r      ON r.id = u.id_rol
       WHERE m.id = ?`,
      [id],
    );

    if (!rows.length) return null;

    const row = rows[0];

    const medico = new (require("src/models/medico/medico").Medico)(
      row.nombre,
      row.matricula,
    ) as Medico;

    if ((medico as any).setId) {
      (medico as any).setId(row.id_medico);
    }

    if (row.email && row.rol_nombre) {
      const usuario: Usuario = {
        email: row.email,
        rol: row.rol_nombre as RolUsuario,
      };
      if ((medico as any).asociarUsuario) {
        (medico as any).asociarUsuario(usuario);
      }
    }

    return medico;
  }

  async actualizarMedico(medico: Medico): Promise<void> {
    const id = (medico as any).getId?.();
    const matricula = (medico as any).getMatricula?.();
    const usuario: Usuario | undefined = (medico as any).getUsuario?.();

    if (id == null) {
      throw new InternalServerErrorException("El médico no tiene id definido para actualizar");
    }

    let usuarioId: number | null = null;

    if (usuario) {
      // buscamos el id del usuario por email
      const rowsUsuario = await this.db.query<{ id: number }>(
        `SELECT id FROM usuario WHERE email = ?`,
        [usuario.email],
      );

      if (!rowsUsuario.length) {
        throw new InternalServerErrorException(
          `No existe un usuario con email ${usuario.email} para asociar al médico`,
        );
      }

      usuarioId = rowsUsuario[0].id;
    }

    await this.db.execute(
      `UPDATE medico
       SET matricula = ?, 
           id_usuario = ?
       WHERE id = ?`,
      [matricula, usuarioId, id],
    );
  }

  async asociarUsuarioMedico(medicoId: number, usuarioId: number): Promise<void> {
    await this.db.execute(
      `UPDATE medico
       SET id_usuario = ?
       WHERE id = ?`,
      [usuarioId, medicoId],
    );
  }

}

   

import { IEnfermeroRepositorio } from "src/app/interfaces/enfemera/enfermera.repository";
import { DatabaseService } from "src/config/database/database.service";
import { Enfermera } from "src/models/enfermera/enfermera.entity";
import { RolUsuario, Usuario } from "src/models/usuario/usuario";

export class EnfermeroRepositorio implements IEnfermeroRepositorio {

    constructor(
        private readonly db: DatabaseService,
    ) {}

    async obtenerPorId(id: number): Promise<Enfermera | null> {
        const rows = await this.db.query<{
        id: number;
        nombre: string;
        apellido: string;
        cuil: string;
        matricula: string;
        id_usuario: number | null;
        }>(
        `SELECT e.id,
                p.nombre,
                p.apellido,
                p.cuil,
                e.matricula,
                e.id_usuario
        FROM enfermero e
        JOIN persona p ON p.id = e.id
        WHERE e.id = ?`,
        [id],
        );

        if (!rows.length) return null;

        const row = rows[0];

        const enfermera = new (require("src/models/enfermera/enfermera").Enfermera)(
        row.nombre,
        row.apellido,
        row.matricula
        ) as Enfermera;

        return enfermera;
    }
   
    async obtenerPorEmail(email: string): Promise<Enfermera | null> {
    const rows = await this.db.query<{
      id_enfermero: number;
      nombre: string;
      apellido: string;
      cuil: string;
      matricula: string;
      email: string;
      rol_nombre: string;
    }>(
      `SELECT e.id              AS id_enfermero,
              p.nombre          AS nombre,
              p.apellido        AS apellido,
              p.cuil            AS cuil,
              e.matricula       AS matricula,
              u.email           AS email,
              r.nombre          AS rol_nombre
       FROM usuario u
       JOIN rol r          ON r.id = u.id_rol
       JOIN enfermero e    ON e.id_usuario = u.id
       JOIN persona p      ON p.id = e.id
       WHERE u.email = ?`,
      [email],
    );

    if (!rows.length) return null;

    const row = rows[0];

    const enfermera = new (require("src/models/enfermera/enfermera").Enfermera)(
      row.nombre,
      row.apellido,
      row.matricula
    ) as Enfermera;

    const usuario: Usuario = {
      email: row.email,
      rol: row.rol_nombre as RolUsuario,
    };

    (enfermera as any).asociarUsuario(usuario);

    return enfermera;
  }

  async actualizarEnfermera(enfermera: Enfermera): Promise<void> {
    const id = (enfermera as any).getId?.();
    const matricula = (enfermera as any).getMatricula?.();

    if (id == null) {
      throw new Error("La Enfermera no tiene id definido para actualizar");
    }

    await this.db.execute(
      `UPDATE enfermero
       SET matricula = ?
       WHERE id = ?`,
      [matricula, id],
    );
  }

    
}
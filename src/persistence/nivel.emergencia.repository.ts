import { Injectable } from "@nestjs/common";
import { INivelEmergenciaRepositorio } from "src/app/interfaces/nivel-emergencia/nivel.emergencia.repository.interface";
import { DatabaseService } from "src/config/database/database.service";

@Injectable()
export class NivelEmergenciaRepositorio implements INivelEmergenciaRepositorio {

    constructor(private readonly db: DatabaseService) {}

    async obtenerIdPorNombre(nombre: string): Promise<number | null> {
    const rows = await this.db.query<{ id: number }>(
      `
      SELECT n.id
      FROM nivel n
      JOIN nivel_emergencia ne ON ne.id = n.id_nivel_emergencia
      WHERE ne.nombre = ?
      ORDER BY n.nivel ASC
      LIMIT 1
      `,
      [nombre],
    );

    if (!rows.length) return null;

    return rows[0].id;
  }
    
}
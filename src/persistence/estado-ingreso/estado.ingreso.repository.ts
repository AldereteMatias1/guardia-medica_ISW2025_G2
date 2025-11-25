import { Injectable } from "@nestjs/common";
import { IEstadoIngresoRepositorio } from "src/persistence/estado-ingreso/estado.ingreso.repository.interface";
import { DatabaseService } from "src/config/database/database.service";

type EstadoRow = { id: number; estado: string };

@Injectable()
export class EstadoIngresoRepositorio implements IEstadoIngresoRepositorio {

    constructor(
            private readonly db: DatabaseService,
        ) {}

    async obtenerIdPorNombre(estado: string): Promise<number | null> {
    const rows = await this.db.query<EstadoRow>(
      `SELECT id, estado
       FROM estado_ingreso
       WHERE estado = ?
       LIMIT 1`,
      [estado],
    );

    if (!rows.length) {
      return null;
    }

    return rows[0].id;
  }

}
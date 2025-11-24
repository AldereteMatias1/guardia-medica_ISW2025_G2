import { Injectable } from "@nestjs/common";
import { IObraSocial } from "../../src/app/interfaces/obraSocial/obra.social.repository";
import { DatabaseService } from "../../src/config/database/database.service";

@Injectable()
export class ObraSocialRepositorio implements IObraSocial {
    
    constructor(private readonly db: DatabaseService) {}

    async existePorNombre(nombre: string): Promise<boolean> {
    const sql = `
        SELECT 1
        FROM obra_social
        WHERE nombre = ?
        LIMIT 1
    `;
    const rows = await this.db.query(sql, [nombre]);
    return Array.isArray(rows) && rows.length > 0;
    }
    async afiliadoAlPaciente(
    cuil: string,
    numeroAfiliado: number,
    nombreObra: string,
    ): Promise<boolean> {
    const sql = `
        SELECT 1
        FROM afiliado a
        JOIN obra_social o ON o.id = a.id_obra_social
        WHERE a.cuil = ?
            AND a.numero_afiliado = ?
            AND o.nombre = ?
        LIMIT 1
    `;
    const rows = await this.db.query(sql, [cuil, numeroAfiliado, nombreObra]);
    return Array.isArray(rows) && rows.length > 0;
    }
    
}
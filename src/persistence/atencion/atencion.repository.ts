import { Inject, Injectable } from "@nestjs/common";
import { IAtencionRepositorio } from "./atencion.repository.interface";
import { DatabaseService } from "../../../src/config/database/database.service";
import { Atencion } from "../../../src/business/atencion/atencion.entity";
import * as estadoIngresoRepositoryInterface from "../estado-ingreso/estado.ingreso.repository.interface";
import { EstadoIngreso } from "../../../src/business/estado-ingreso/estadoIngreso.enum";
import * as ingresoRepositoryInterface from "../ingreso/ingreso.repository.interface";
import { Ingreso } from "../../../src/business/ingreso/ingreso";
import * as medicoRepositoryInterface from "../medico/medico.repository.interface";
import { Medico } from "src/business/medico/medico.entity";

@Injectable()
export class AtencionRepositorio implements IAtencionRepositorio{

    constructor(
        private readonly db: DatabaseService,
        @Inject(estadoIngresoRepositoryInterface.ESTADO_INGRESO_REPOSITORIO)
        private readonly estadoRepo: estadoIngresoRepositoryInterface.IEstadoIngresoRepositorio,
        @Inject(ingresoRepositoryInterface.INGRESO_REPOSITORIO)
        private readonly ingresoRepo: ingresoRepositoryInterface.IIngresoRepositorio,
        @Inject(medicoRepositoryInterface.MEDICO_REPOSITORIO)
        private readonly medicoRepo: medicoRepositoryInterface.IMedicoRepositorio
    ) {}

    async completarAtencion(idIngreso:number, informe: string): Promise<void> {
            await this.db.execute(
            `
            UPDATE atencion
            SET 
                informe = ?
            WHERE 
                id_ingreso = ?
            `,
            [informe, idIngreso]
        );
    }


    async hasIngresoEnProceso(idMedico: number): Promise<boolean> {
        const idEstadoEnProceso = await this.estadoRepo.obtenerIdPorNombre(EstadoIngreso.EN_PROCESO);

        const rows = await this.db.query(
            `
            SELECT 1
            FROM atencion a
            JOIN ingreso i ON a.id_ingreso = i.id
            WHERE 
                a.id_medico = ?
                AND i.id_estado_ingreso = ?
            LIMIT 1
            `,
            [idMedico, idEstadoEnProceso]
        );
        return rows.length > 0;
    }

    async traerAtencion(idMedico: number): Promise<Atencion | null> {
        const rows = await this.db.query<{
            id: number,
            informe?: string,
            idMedico: number,
            idIngreso:number
        }>(
            `
                SELECT 
                    a.id,
                    a.informe,
                    a.id_medico,
                    a.id_ingreso AS idIngreso
                FROM 
                    atencion a
                INNER JOIN 
                    ingreso i ON a.id_ingreso = i.id
                INNER JOIN 
                    estado_ingreso ei ON i.id_estado_ingreso = ei.id
                WHERE 
                    a.id_medico = ?
                    AND ei.estado = 'En proceso'
                LIMIT 1`,
            [idMedico]
        );

        
        if (!rows.length) return null;
        
        const row = rows[0];

        const ingreso: Ingreso | null = await this.ingresoRepo.findById(row.idIngreso);

        if (!ingreso) {
            return null; 
        }

        const medico: Medico | null = await this.medicoRepo.obtenerPorId(idMedico);

        if (!medico) {
            return null; 
        }

        const atencion = new Atencion(
            row.id, 
            row.informe || '', 
            ingreso,
            medico
        );
    
        return atencion; 
    }

    async asociarAtencion(idMedico: number, idIngreso: number): Promise<void> {
        await this.db.execute(
            `
            INSERT INTO atencion (
                id_medico, 
                id_ingreso
            )
            VALUES (?, ?)
            `,
            [idMedico, idIngreso], 
        );
    }

    
}
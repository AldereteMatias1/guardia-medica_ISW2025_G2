// src/persistence/ingreso.mysql.repository.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IIngresoRepositorio } from './ingreso.repository.interface';
import { Ingreso } from '../../models/ingreso/ingreso';
import { NivelEmergencia } from '../../models/nivel-emergencia/nivelEmergencia.enum';
import { Paciente } from '../../models/paciente/paciente';
import { Enfermera } from '../../models/enfermera/enfermera.entity';
import { DatabaseService } from '../../config/database/database.service';
import * as estadoIngresoRepositoryInterface from '../estado-ingreso/estado.ingreso.repository.interface';
import * as nivelEmergenciaRepositoryInterface from '../nivel-emergencia/nivel.emergencia.repository.interface';

type IngresoRow = {
  id: number;
  descripcion: string;
  fecha_ingreso: Date;
  temperatura: number;
  frecuencia_respiratorio: number;
  frecuencia_cardiaca: number;
  tension_arterial: string;
  cuil_paciente: string;
  nombre_paciente: string;
  apellido_paciente: string;
  nombre_enfermera: string;
  apellido_enfermera: string;
  nivel_emergencia: string;
};

@Injectable()
export class IngresoRepositorio implements IIngresoRepositorio {
  constructor(
    private readonly db: DatabaseService,
    @Inject(estadoIngresoRepositoryInterface.ESTADO_INGRESO_REPOSITORIO)
    private readonly estadoRepo: estadoIngresoRepositoryInterface.IEstadoIngresoRepositorio,
    @Inject(nivelEmergenciaRepositoryInterface.NIVEL_EMERGENCIA_REPOSITORIO)
    private readonly nivelRepo: nivelEmergenciaRepositoryInterface.INivelEmergenciaRepositorio,

  ) {}

  private mapNivelToDb(nivel: NivelEmergencia): string {
    switch (nivel) {
      case NivelEmergencia.CRITICA:
        return 'CRITICA';
      case NivelEmergencia.EMERGENCIA:
        return 'EMERGENCIA';
      case NivelEmergencia.URGENCIA:
        return 'URGENCIA';
      case NivelEmergencia.URGENCIA_MENOR:
        return 'URGENCIA_MENOR';
      case NivelEmergencia.SIN_URGENCIA:
        return 'SIN_URGENCIA';
      default:
        return 'SIN_URGENCIA';
    }
  }

  async guardar(ingreso: Ingreso): Promise<void> {
    const paciente = ingreso.getPaciente();
    const enfermera = ingreso.getEnfermera();
    const nivel = ingreso.getNivelEmergencia();
    const estadoNombre = ingreso.getEstadoIngreso(); // por ej. 'PENDIENTE' o 'EN_PROCESO'

    const nivelNombre = this.mapNivelToDb(nivel);

    // 1) Buscar id_estado_ingreso por nombre
    const idEstado = await this.estadoRepo.obtenerIdPorNombre(estadoNombre);
    if (idEstado == null) {
      throw new NotFoundException(`No se encontró estado_ingreso con nombre: ${estadoNombre}`);
    }

    // 2) Buscar id_nivel por nombre de nivel de emergencia
    const idNivel = await this.nivelRepo.obtenerIdPorNombre(nivelNombre);
    if (idNivel == null) {
      throw new NotFoundException(`No se encontró nivel para nivel_emergencia: ${nivelNombre}`);
    }

    // 3) Insertar usando directamente los IDs (sin subqueries de estado/nivel)
    await this.db.execute(
      `
      INSERT INTO ingreso (
        id_enfermero,
        id_paciente,
        id_estado_ingreso,
        descripcion,
        fecha_ingreso,
        temperatura,
        frecuencia_respiratorio,
        frecuencia_cardiaca,
        tension_arterial,
        id_nivel
      )
      VALUES (
        (SELECT e.id
         FROM enfermero e
         JOIN persona pe ON pe.id = e.id
         WHERE pe.nombre = ? AND pe.apellido = ?
         LIMIT 1),
        (SELECT pa.id
         FROM paciente pa
         JOIN persona p ON p.id = pa.id
         WHERE p.cuil = ?
         LIMIT 1),
        ?,  -- id_estado_ingreso
        ?,  -- descripcion
        ?,  -- fecha_ingreso
        ?,  -- temperatura
        ?,  -- frecuencia_respiratorio
        ?,  -- frecuencia_cardiaca
        ?,  -- tension_arterial
        ?   -- id_nivel
      )
      `,
      [
        // enfermero
        enfermera.getNombre(),                    // pe.nombre = ?
        enfermera.getApellido(),                  // pe.apellido = ?
        // paciente
        paciente.getCuil(),                       // p.cuil = ?
        // directos
        idEstado,                                 // id_estado_ingreso
        ingreso.getInforme(),                     // descripcion
        ingreso.getFechaIngreso(),                // fecha_ingreso (Date o string compatible)
        ingreso.getTemperatura(),                 // temperatura
        ingreso.getFrecuenciaRespiratoria(),      // frecuencia_respiratorio
        ingreso.getFrecuenciaCardiaca(),          // frecuencia_cardiaca
        ingreso.getTensionArterialComoString(),   // tension_arterial ("120/80")
        idNivel,                                  // id_nivel
      ],
    );
  }

  async obtenerPendientes(): Promise<Ingreso[]> {
    const rows = await this.db.query<IngresoRow>(
      `
      SELECT 
        i.*,
        per.cuil            AS cuil_paciente,
        per.nombre          AS nombre_paciente,
        per.apellido        AS apellido_paciente,
        eper.nombre         AS nombre_enfermera,
        eper.apellido       AS apellido_enfermera,
        ne.nombre           AS nivel_emergencia
      FROM ingreso i
      JOIN paciente pa        ON pa.id = i.id_paciente
      JOIN persona per        ON per.id = pa.id
      JOIN enfermero enf      ON enf.id = i.id_enfermero
      JOIN persona eper       ON eper.id = enf.id
      JOIN nivel n            ON n.id = i.id_nivel
      JOIN nivel_emergencia ne ON ne.id = n.id_nivel_emergencia
      JOIN estado_ingreso ei  ON ei.id = i.id_estado_ingreso
      WHERE ei.estado = 'PENDIENTE'
      ORDER BY 
        ne.id ASC,           -- prioridad de nivel
        i.fecha_ingreso ASC  -- orden de llegada
      `,
    );

    return rows.map((row) => {
      const paciente = new Paciente(
        row.nombre_paciente,
        row.apellido_paciente,
        row.cuil_paciente,
      );

      const enf = new Enfermera(row.nombre_enfermera, row.apellido_enfermera);
      const nivel = this.mapNivelFromDb(row.nivel_emergencia);

      const [sistolicaStr, diastolicaStr] = row.tension_arterial.split('/');
      const sistolica = Number(sistolicaStr);
      const diastolica = Number(diastolicaStr);

      return new Ingreso({
        paciente,
        enfermera: enf,
        informe: row.descripcion,
        nivelEmergencia: nivel,
        temperatura: row.temperatura,
        frecuenciaCardiaca: row.frecuencia_cardiaca,
        frecuenciaRespiratoria: row.frecuencia_respiratorio,
        presionSistolica: sistolica,
        presionDiastolica: diastolica,
        fechaIngreso: new Date(row.fecha_ingreso), 
      });
    });
  }

  private mapNivelFromDb(nombre: string): NivelEmergencia {
    if (!nombre) return NivelEmergencia.SIN_URGENCIA;

    const normalized = nombre.trim().toUpperCase();

    const mapa: Record<string, NivelEmergencia> = {
        'CRITICA': NivelEmergencia.CRITICA,
        'EMERGENCIA': NivelEmergencia.EMERGENCIA,
        'URGENCIA': NivelEmergencia.URGENCIA,
        'URGENCIA_MENOR': NivelEmergencia.URGENCIA_MENOR,
        'SIN_URGENCIA': NivelEmergencia.SIN_URGENCIA
    };

    return mapa[normalized] ?? NivelEmergencia.SIN_URGENCIA;
}
}

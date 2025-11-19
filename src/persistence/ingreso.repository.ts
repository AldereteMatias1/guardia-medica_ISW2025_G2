// src/persistence/ingreso.mysql.repository.ts
import { Injectable } from '@nestjs/common';
import { IIngresoRepositorio } from '../../src/app/interfaces/ingreso/ingreso.repository.interface';
import { Ingreso } from '../../src/models/ingreso/ingreso';
import { EstadoIngreso } from '../../src/models/estado-ingreso/estadoIngreso.enum';
import { NivelEmergencia } from '../../src/models/nivel-emergencia/nivelEmergencia.enum';
import { Paciente } from '../../src/models/paciente/paciente';
import { Enfermera } from '../../src/models/enfermera/enfermera.entity';
import { DatabaseService } from '../../src/config/database/database.service';

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
  constructor(private readonly db: DatabaseService) {}

  private mapNivelToDb(nivel: NivelEmergencia): string {
    switch (nivel) {
      case NivelEmergencia.CRITICA:
        return 'Critica';
      case NivelEmergencia.EMERGENCIA:
        return 'Emergencia';
      case NivelEmergencia.URGENCIA:
        return 'Urgencia';
      case NivelEmergencia.URGENCIA_MENOR:
        return 'Urgencia menor';
      case NivelEmergencia.SIN_URGENCIA:
        return 'Sin urgencia';
      default:
        return 'Sin urgencia';
    }
  }

  async guardar(ingreso: Ingreso): Promise<void> {

    const paciente = ingreso.getPaciente();
    const enfermera = ingreso.getEnfermera();
    const nivel = ingreso.getNivelEmergencia();
    const estado = ingreso.getEstadoIngreso(); 

    const nivelNombre = this.mapNivelToDb(nivel);

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
        (SELECT p.id
         FROM paciente pa
         JOIN persona p ON p.id = pa.id
         WHERE p.cuil = ?
         LIMIT 1),
        (SELECT ei.id FROM estado_ingreso ei WHERE ei.estado = ? LIMIT 1),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        (
          SELECT n.id
          FROM nivel n
          JOIN nivel_emergencia ne ON ne.id = n.id_nivel_emergencia
          WHERE ne.nombre = ?
          ORDER BY n.nivel ASC
          LIMIT 1
        )
      )
      `,
      [
        enfermera.getNombre(),
        enfermera.getApellido(),
        paciente.getCuil(),
        estado, 
        ingreso.getInforme(),
        ingreso.getTemperatura(),
        ingreso.getFrecuenciaRespiratoria(),
        ingreso.getFrecuenciaCardiaca(),
        ingreso.getTensionArterialComoString(), 
        nivelNombre,
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
    const n = nombre.trim().toLowerCase();
    if (n === 'critica' || n === 'crítica') return NivelEmergencia.CRITICA;
    if (n === 'emergencia') return NivelEmergencia.EMERGENCIA;
    if (n === 'urgencia') return NivelEmergencia.URGENCIA;
    if (n === 'urgencia menor') return NivelEmergencia.URGENCIA_MENOR;
    if (n === 'sin urgencia') return NivelEmergencia.SIN_URGENCIA;
    return NivelEmergencia.SIN_URGENCIA;
  }
}

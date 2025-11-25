import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { IPacienteRepositorio } from "./patient.repository.interface";
import { DatabaseService } from "../../../src/config/database/database.service";
import { Paciente } from "../../../src/business/paciente/paciente";
import { Domicilio } from "../../../src/business/domicilio/domicililio.entities";
import { Afiliado } from "../../../src/business/afiliado/afiliado.entities";
import { ObraSocial } from "../../../src/business/obra-social/obra-social.entity";

@Injectable()
export class PatientRepositoryImpl implements IPacienteRepositorio {

  constructor(private readonly db: DatabaseService) {}

  async buscarPacientePorCuil(cuil: string): Promise<Paciente | null> {
    type Row = {
      persona_id: number;
      nombre: string;
      apellido: string;
      cuil: string;

      calle: string;
      numero: number;
      localidad: string;

      afiliado_id: number | null;
      numero_afiliado: number | null;
      obra_id: UUID | null;
      obra_nombre: string | null;
    };

    const rows = await this.db.query<Row>(
      `
      SELECT 
        p.id AS persona_id,
        p.nombre AS nombre,
        p.apellido AS apellido,
        p.cuil AS cuil,

        d.calle AS calle,
        d.numero AS numero,
        d.localidad AS localidad,

        a.id AS afiliado_id,
        a.numero_afiliado AS numero_afiliado,
        o.id AS obra_id,
        o.nombre AS obra_nombre

      FROM persona p
      JOIN paciente pa ON pa.id = p.id
      JOIN direccion d ON d.id = pa.id_direccion
      LEFT JOIN afiliado a ON a.id_paciente = p.id
      LEFT JOIN obra_social o ON o.id = a.id_obra_social
      WHERE p.cuil = ?
      LIMIT 1
      `,
      [cuil]
    );

    if (!rows.length) return null;
    const row = rows[0];

    const domicilio = new Domicilio(
      row.calle,
      row.localidad,
      row.numero
    );

    let afiliado: Afiliado | undefined = undefined;

    if (row.afiliado_id && row.numero_afiliado && row.obra_id && row.obra_nombre) {
      const obra = new ObraSocial(row.obra_id, row.obra_nombre);
      afiliado = new Afiliado(row.afiliado_id, row.numero_afiliado, obra);
    }

    return new Paciente(
      row.nombre,
      row.apellido,
      row.cuil,
      afiliado,
      domicilio
    );
  }
  
  async guardarPaciente(patient: Paciente): Promise<void> {
    const resultadoPersona = await this.db.execute(
      `INSERT INTO persona (nombre, apellido, cuil)
       VALUES (?, ?, ?)`,
      [patient.getNombre(), patient.getApellido(), patient.getCuil()],
    );
    const personaId = resultadoPersona.insertId;

    const dom = patient.getDomicilio();
    if (!dom) {
      throw new Error('El paciente debe tener domicilio para guardarse en la base de datos');
    }

    const resultadoDireccion = await this.db.execute(
      `INSERT INTO direccion (calle, numero, localidad)
       VALUES (?, ?, ?)`,
      [dom.calle, dom.numero, dom.localidad],
    );
    const direccionId = resultadoDireccion.insertId;

    await this.db.execute(
      `INSERT INTO paciente (id, id_direccion)
       VALUES (?, ?)`,
      [personaId, direccionId],
    );

    const af = patient.getObraSocial();
    if (af) {
      await this.db.execute(
        `UPDATE afiliado a
         JOIN obra_social o ON o.id = a.id_obra_social
         SET a.id_paciente = ?
         WHERE a.cuil = ?
           AND a.numero_afiliado = ?
           AND o.nombre = ?`,
        [
          personaId,
          patient.getCuil(),
          af.getNumeroAfiliado(),
          af.getObraSocial().getNombre(),
        ],
      );
    }
  }
}
import { EstadoIngreso } from './../estado-ingreso/estadoIngreso.enum';
import { Enfermera } from '../enfermera/enfermera.entity';
import { NivelEmergencia } from '../nivel-emergencia/nivelEmergencia.enum';
import { Paciente } from '../paciente/paciente';
import { FrecuenciaCardiaca } from '../value-objects/frecuenciaCardiaca';
import { FrecuenciaRespiratoria } from '../value-objects/frecuenciaRespiratoria';
import { TensionArterial } from '../value-objects/tensionArterial';
import { randomUUID } from 'crypto';

interface IngresoArgs {
  paciente: Paciente;
  enfermera: Enfermera;
  informe: string;
  nivelEmergencia: NivelEmergencia; // enum numérico: 1..5
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  /** presión arterial */
  presionSistolica: number;
  presionDiastolica: number;

}

export class Ingreso {
  private readonly paciente: Paciente;
  private readonly enfermera: Enfermera;
  private readonly fechaIngreso: Date;
  private readonly informe: string;
  private readonly nivelEmergencia: NivelEmergencia;
  private readonly temperatura: number;
  private readonly frecuenciaCardiaca: FrecuenciaCardiaca;
  private readonly frecuenciaRespiratoria: FrecuenciaRespiratoria;
  private readonly tensionArterial: TensionArterial;
  private estadoIngreso: EstadoIngreso;

  public constructor(args: IngresoArgs) {

    if (!args.informe || !args.informe.trim()) {
      throw new Error("falta el campo 'informe'");
    }
    if (args.nivelEmergencia == null || Number.isNaN(args.nivelEmergencia)) {
      throw new Error("falta el campo 'nivel de emergencia'");
    }
    this.paciente = args.paciente;
    this.enfermera = args.enfermera;
    this.fechaIngreso =  new Date();
    this.informe = args.informe.trim();
    this.nivelEmergencia = args.nivelEmergencia;
    this.temperatura = args.temperatura;

    this.frecuenciaCardiaca = new FrecuenciaCardiaca(args.frecuenciaCardiaca);
    this.frecuenciaRespiratoria = new FrecuenciaRespiratoria(args.frecuenciaRespiratoria);
    this.tensionArterial = new TensionArterial(args.presionSistolica, args.presionDiastolica);

    this.estadoIngreso =EstadoIngreso.PENDIENTE;
  }


  public compararCon(otro: Ingreso): number { 
    if (this.nivelEmergencia !== otro.nivelEmergencia) {
      return this.nivelEmergencia - otro.nivelEmergencia; 
    }
    return this.fechaIngreso.getTime() - otro.fechaIngreso.getTime();
  }


  public static comparator(a: Ingreso, b: Ingreso): number {
    return a.compararCon(b);
  }

  get CuilPaciente(): string { return this.paciente.Cuil; }
  get Nivel(): NivelEmergencia { return this.nivelEmergencia; }
  get Fecha(): Date { return this.fechaIngreso; }
  get Estado(): EstadoIngreso { return this.estadoIngreso; }


}

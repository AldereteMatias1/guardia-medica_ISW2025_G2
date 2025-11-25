import { EstadoIngreso } from '../estado-ingreso/estadoIngreso.enum';
import { Enfermera } from '../enfermera/enfermera.entity';
import { Paciente } from '../paciente/paciente';
import { NivelEmergencia } from '../nivel-emergencia/nivelEmergencia.enum';
import { FrecuenciaCardiaca } from './value-objects/frecuenciaCardiaca';
import { FrecuenciaRespiratoria } from './value-objects/frecuenciaRespiratoria';
import { TensionArterial } from './value-objects/tensionArterial';

interface IngresoArgs {
  paciente: Paciente;
  enfermera: Enfermera;
  informe: string;
  nivelEmergencia: NivelEmergencia; 
  temperatura: number;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  presionSistolica: number;
  presionDiastolica: number;
  fechaIngreso: Date;
}

export class Ingreso {
  private readonly paciente: Paciente;
  private readonly enfermera: Enfermera;
  private fechaIngreso: Date;
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

  get CuilPaciente(): string { return this.paciente.getCuil(); }
  get Nivel(): NivelEmergencia { return this.nivelEmergencia; }
  get Fecha(): Date { return this.fechaIngreso; }
  get Estado(): EstadoIngreso { return this.estadoIngreso; }

  public getEnfermera() {
    return this.enfermera;
  }

  public getPaciente(){
    return this.paciente;
  }

  public getEstadoIngreso(){
    return this.estadoIngreso;
  }

  public getNivelEmergencia(){
    return this.nivelEmergencia;
  }

  public getInforme(){
    return this.informe;
  }

  public getTemperatura(){
        return this.temperatura;
  }

  public getFrecuenciaRespiratoria(){
    return this.frecuenciaRespiratoria.Valor;
  }

  public getFrecuenciaCardiaca(){
    return this.frecuenciaCardiaca.Valor;
  }

  public getTensionArterialComoString(){
    return this.tensionArterial.sistolica.Valor + '/' + this.tensionArterial.diastolica.Valor
  }

  public getFechaIngreso(){
    return this.fechaIngreso;
  }
}

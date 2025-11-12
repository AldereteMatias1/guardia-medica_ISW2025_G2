import { Enfermera } from 'src/models/enfermera/enfermera.entity';
import { Ingreso } from 'src/models/ingreso/ingreso';
import { NivelEmergencia } from 'src/models/nivel-emergencia/nivelEmergencia.enum';

export const INGRESO_SERVICIO = Symbol('INGRESO_SERVICIO');

export interface ServicioIngreso {
  registrarIngreso(
    cuilPaciente: string,
    idEnfermera: number,
    informe: string,
    nivelEmergencia: NivelEmergencia,
    temperatura: number,
    frecuenciaCardiaca: number,
    frecuenciaRespiratoria: number,
    presionSistolica: number,
    presionDiastolica: number,
  ): Ingreso;

  obtenerPendientes(): Ingreso[];
}

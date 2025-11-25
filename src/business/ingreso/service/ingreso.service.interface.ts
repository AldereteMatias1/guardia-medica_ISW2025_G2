import { NivelEmergencia } from "src/business/nivel-emergencia/nivelEmergencia.enum";
import { Ingreso } from "../../../business/ingreso/ingreso";


export const SERVICIO_INGRESO = Symbol('SERVICIO_INGRESO');

export interface IIngresoServicio {
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
     ): Promise<Ingreso>;

     obtenerPendientes(): Promise<Ingreso[]>;
};
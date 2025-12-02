import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingreso } from '../ingreso';
import * as pacienteRepository from '../../../persistence/paciente/patient.repository.interface';
import { PACIENTE_REPOSITORIO } from '../../../persistence/paciente/patient.repository.interface';
import * as ingresoRepositoryInterface from '../../../persistence/ingreso/ingreso.repository.interface';
import * as enfermeraServiceInterface from '../../enfermera/service/enfermera.service.interface';
import { IIngresoServicio } from './ingreso.service.interface';
import { NivelEmergencia } from '../../../../src/business/nivel-emergencia/nivelEmergencia.enum';
import * as atencionServiceInterface from '../../../../src/business/atencion/service/atencion.service.interface';


@Injectable()
export class IngresoService implements IIngresoServicio {
  
  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: pacienteRepository.IPacienteRepositorio,

    @Inject(ingresoRepositoryInterface.INGRESO_REPOSITORIO)
    private readonly ingresoRepo: ingresoRepositoryInterface.IIngresoRepositorio,

    @Inject(enfermeraServiceInterface.SERVICIO_ENFERMERO)
    private readonly enfermeroServicio: enfermeraServiceInterface.IEnfermeroServicio,

    @Inject(atencionServiceInterface.ATENCION_SERVICIO)
    private readonly atencionServicio: atencionServiceInterface.IAtencionServicio

  ) {}

  async finalizarIngreso(idIngreso: number): Promise<void> {
    await this.ingresoRepo.finalizarIngreso(idIngreso);
  }


  async reclamarIngreso(idMedico: number): Promise<Ingreso> {
    const medicoOcupado = await this.atencionServicio.hasIngresoEnProceso(idMedico); 
    if(medicoOcupado){
      throw new BadRequestException("El medico tiene un ingreso en proceso");
    }
    const ingreso = await this.ingresoRepo.reclamarSiguienteIngreso();
    if(!ingreso) throw new NotFoundException('No hay Paciente en la lista de espera');
    await this.atencionServicio.asociarAtencion(idMedico, ingreso.getId());
    return ingreso;
  }

  async registrarIngreso(
    cuilPaciente: string,
    idEnfermera: number,
    informe: string,
    nivelEmergencia: NivelEmergencia,
    temperatura: number,
    frecuenciaCardiaca: number,
    frecuenciaRespiratoria: number,
    presionSistolica: number,
    presionDiastolica: number,
  ): Promise<Ingreso> {
    const paciente = await this.pacienteRepo.buscarPacientePorCuil(cuilPaciente);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    const enfermera = await this.enfermeroServicio.obtenerPorId(idEnfermera);
    if(!enfermera) throw new NotFoundException('Enfermera no encontrada');
    const ingreso = new Ingreso({
      paciente,
      enfermera,
      informe,
      nivelEmergencia,
      temperatura,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      presionSistolica,
      presionDiastolica,
      fechaIngreso: new Date(),
    });

    await this.ingresoRepo.guardar(ingreso);

    return ingreso;
  }

  async obtenerPendientes(): Promise<Ingreso[]> {
    const pendientes = await this.ingresoRepo.obtenerPendientes();
    return pendientes.sort(Ingreso.comparator);
  }

}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingreso } from '../../models/ingreso/ingreso';
import { Enfermera } from '../../../src/models/enfermera/enfermera.entity';
import { NivelEmergencia } from '../../models/nivel-emergencia/nivelEmergencia.enum';
import * as pacienteRepository from '../interfaces/paciente/patient.repository.interface';
import { PACIENTE_REPOSITORIO } from '../interfaces/paciente/patient.repository.interface';
import { IIngresoServicio } from '../interfaces/ingreso/ingreso.service.interface';
import * as ingresoRepositoryInterface from '../../persistence/ingreso/ingreso.repository.interface';
import * as enfermeraServiceInterface from '../interfaces/enfemera/enfermera.service.interface';


@Injectable()
export class IngresoService implements IIngresoServicio {
  
  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: pacienteRepository.IPacienteRepositorio,

    @Inject(ingresoRepositoryInterface.INGRESO_REPOSITORIO)
    private readonly ingresoRepo: ingresoRepositoryInterface.IIngresoRepositorio,

    @Inject(enfermeraServiceInterface.SERVICIO_ENFERMERO)
    private readonly enfermeroServicio: enfermeraServiceInterface.IEnfermeroServicio

  ) {}

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

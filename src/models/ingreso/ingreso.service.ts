import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingreso } from './ingreso';
import { Enfermera } from '../enfermera/enfermera.entity';
import { NivelEmergencia } from '../nivel-emergencia/nivelEmergencia.enum';
import { Paciente } from '../paciente/paciente';
import { EstadoIngreso } from '../estado-ingreso/estadoIngreso.enum';

import * as pacienteRepository from '../paciente/repository/paciente.repository';
import { PATIENT_REPOSITORY } from './patient.constant';


@Injectable()
export class IngresoService {
  private readonly listaDeIngresos: Ingreso[] = [];

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly pacienteRepo: pacienteRepository.PatientRepository,
  ) {}

  registrarIngreso(
    cuilPaciente: string,
    enfermera: Enfermera,
    informe: string,
    nivelEmergencia: NivelEmergencia,
    temperatura: number,
    frecuenciaCardiaca: number,
    frecuenciaRespiratoria: number,
    presionSistolica: number,
    presionDiastolica: number,
  ): Ingreso {
    const paciente = this.pacienteRepo.buscarPacientePorCuil(cuilPaciente);
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
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
    });


    this.listaDeIngresos.push(ingreso);

    this.ordenarPorPrioridad();

    return ingreso;
  }

  obtenerPendientes(): Ingreso[] {
    return this.listaDeIngresos.filter(
      (ing) => ing['estadoIngreso'] === EstadoIngreso.PENDIENTE,
    );
  }

  private ordenarPorPrioridad(): void {
    this.listaDeIngresos.sort(Ingreso.comparator);
  }

}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingreso } from '../../models/ingreso/ingreso';
import { Enfermera } from '../../models/enfermera/enfermera.entity';
import { NivelEmergencia } from '../../models/nivel-emergencia/nivelEmergencia.enum';
import { EstadoIngreso } from '../../models/estado-ingreso/estadoIngreso.enum';
import * as pacienteRepository from '../interfaces/paciente/patient.repository.interface';
import { PACIENTE_REPOSITORIO } from '../interfaces/paciente/patient.repository.interface';
import { ServicioIngreso } from '../interfaces/urgencia.service';


@Injectable()
export class IngresoServiceImpl implements ServicioIngreso {
  private readonly listaDeIngresos: Ingreso[] = [];

  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: pacienteRepository.IPacienteRepositorio,
  ) {}

  async registrarIngreso(
    cuilPaciente: string,
    enfermera: Enfermera,
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

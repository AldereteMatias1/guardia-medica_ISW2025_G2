// src/app/services/ingreso.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ingreso } from 'src/models/ingreso/ingreso';
import { NivelEmergencia } from 'src/models/nivel-emergencia/nivelEmergencia.enum';
import { EstadoIngreso } from 'src/models/estado-ingreso/estadoIngreso.enum';
import { ServicioIngreso } from 'src/app/interfaces/urgencia.service';

import { PatientRepositoryImpl } from 'src/persistence/patient.repository';
import { EnfermeraRepositoryImpl } from 'src/persistence/enfermera.repository';

import { PACIENTE_REPOSITORIO } from 'src/app/interfaces/paciente/patient.repository';
import { ENFERMERA_REPOSITORIO } from 'src/app/interfaces/enfermera.repository';

@Injectable()
export class IngresoServiceImpl implements ServicioIngreso {
  private readonly listaDeIngresos: Ingreso[] = [];

  constructor(
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacienteRepo: PatientRepositoryImpl,
    @Inject(ENFERMERA_REPOSITORIO)
    private readonly enfermeraRepo: EnfermeraRepositoryImpl,
  ) {}

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
  ): Ingreso {
    try {
      const paciente = this.pacienteRepo.buscarPacientePorCuil(cuilPaciente);
      if (!paciente) throw new NotFoundException('Paciente no encontrado');
      const enfermera = this.enfermeraRepo.buscarPorId(idEnfermera);
      if (!enfermera)
        throw new NotFoundException(
          'Enfermera no encontrada. Debe registrarse previamente',
        );

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
      console.log(ingreso);

      this.listaDeIngresos.push(ingreso);
      this.listaDeIngresos.sort(Ingreso.comparator);
      return ingreso;
    } catch (e: any) {
      throw new BadRequestException(e?.message ?? 'Datos de ingreso inválidos');
    }
  }

  obtenerPendientes(): Ingreso[] {
    return this.listaDeIngresos.filter(
      (ing) => ing['estadoIngreso'] === EstadoIngreso.PENDIENTE,
    );
  }
}

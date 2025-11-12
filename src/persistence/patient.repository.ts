import { Injectable } from '@nestjs/common';
import { PacienteRepositorio } from 'src/app/interfaces/paciente/patient.repository';
import { Paciente } from 'src/models/paciente/paciente';
import { Domicilio } from 'src/models/domicilio/domicililio.entities';
import { Afiliado } from 'src/models/afiliado/afiliado.entities';
import { ObraSocial } from 'src/models/obra-social/obra-social.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class PatientRepositoryImpl implements PacienteRepositorio {
  private pacientes: Map<string, Paciente> = new Map();

  constructor() {
    //datos iniciales
    const obra = new ObraSocial(randomUUID(), 'PAMI');
    const afiliado = new Afiliado(1, 12345678, obra);
    const domicilio = new Domicilio('San Martín', 'San Miguel de Tucumán', 800);
    const paciente = new Paciente('Susana', 'Gimenez', '20-12345678-6', afiliado, domicilio);

    this.pacientes.set(paciente.getCuil(), paciente);
  }

  guardarPaciente(patient: Paciente): void {
    this.pacientes.set(patient.getCuil(), patient);
  }

  buscarPacientePorCuil(cuil: string): Paciente | null {
    return this.pacientes.get(cuil) ?? null;
  }

  obtenerTodos(): Paciente[] {
    return Array.from(this.pacientes.values());
  }

  borrarPorCuil(cuil: string): void {
    this.pacientes.delete(cuil);
  }

  clear(): void {
    this.pacientes.clear();
  }
}

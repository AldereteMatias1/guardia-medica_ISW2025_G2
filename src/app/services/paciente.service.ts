import { Paciente } from '../../models/paciente/paciente';
import { IPacienteServicio } from '../interfaces/paciente/paciente.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORIO_OBRA_SOCIAL } from '../../persistence/obra-social/obra.social.repository.interface';
import { ObraSocialRepositorio } from '../../persistence/obra.social.repository';
import * as patientRepository from '../interfaces/paciente/patient.repository.interface';
import { CreatePacienteDto } from '../../models/paciente/dto/create.patient.dto';
import { Afiliado } from '../../models/afiliado/afiliado.entities';
import { Domicilio } from '../../models/domicilio/domicililio.entities';
import { ObraSocial } from '../../models/obra-social/obra-social.entity';

@Injectable()
export class PacienteServicio implements IPacienteServicio {
  constructor(
    @Inject(REPOSITORIO_OBRA_SOCIAL)
    private readonly obraSocialRepo: ObraSocialRepositorio,
    @Inject(patientRepository.PACIENTE_REPOSITORIO)
    private readonly patientRepo: patientRepository.IPacienteRepositorio,
  ) {}

  async buscarPacientePorCuil(cuil: string): Promise<Paciente | null> {

    if (!cuil || !cuil.trim()) {
      throw new BadRequestException('Debe proporcionar un CUIL');
    }

    if (!this.isCuilFormatoValido(cuil)) {
      throw new BadRequestException(
        'CUIL con formato inválido.',
      );
    }

    if (!this.isCuilChecksumValido(cuil)) {
      throw new BadRequestException(
        'CUIL inválido: el dígito verificador no coincide',
      );
    }

    const paciente = await this.patientRepo.buscarPacientePorCuil(cuil);

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return paciente;
  }

  async registrarPaciente(paciente: CreatePacienteDto): Promise<Paciente> {
    this.assertCamposMandatorios(paciente);

    const afiliado = paciente.getObraSocial();

    if (afiliado !== undefined) {
      const nombreObra = afiliado.getObraSocial();

      const existe = await this.obraSocialRepo.existePorNombre(nombreObra);
      const vinculado = await this.obraSocialRepo.afiliadoAlPaciente(
        paciente.getCuil(),
        afiliado.getNumeroAfiliado(),
        nombreObra,
      );

      if (!existe) throw new NotFoundException('Obra social inexistente');
      if (!vinculado) throw new NotFoundException('Afiliacion no existente');
    }

    const nuevoPaciente = this.construirPaciente(paciente);
    await this.patientRepo.guardarPaciente(nuevoPaciente);
    return nuevoPaciente;
  }

  private construirPaciente(pacienteDto: CreatePacienteDto): Paciente {
    const domDto = pacienteDto.getDomicilio();
    const domicilio = domDto
      ? new Domicilio(domDto.calle, domDto.localidad, domDto.numero)
      : undefined;

    const obraDto = pacienteDto.getObraSocial();
    const afiliado = obraDto
      ? new Afiliado(
          obraDto.getNumeroAfiliado(),
          new ObraSocial(obraDto.getObraSocial()),
        )
      : undefined;

    return new Paciente(
      pacienteDto.getNombre(),
      pacienteDto.getApellido(),
      pacienteDto.getCuil(),
      afiliado,
      domicilio,
    );
  }

  private assertCamposMandatorios(paciente: CreatePacienteDto): void {
    const errores: string[] = [];

    if (!paciente.getNombre()?.trim()) errores.push('nombre');
    if (!paciente.getApellido()?.trim()) errores.push('apellido');
    if (!paciente.getCuil()) errores.push('cuil');

    const dom = paciente.getDomicilio();
    if (!dom) {
      errores.push('domicilio');
    } else {
      if (!dom.calle?.trim()) errores.push('domicilio.calle');
      if (dom.numero === null || dom.numero === undefined)
        errores.push('domicilio.numero');
      if (!dom.localidad?.trim()) errores.push('domicilio.localidad');
    }

    const af = paciente.getObraSocial();
    if (af) {
      if (!af.getObraSocial()) errores.push('obraSocial.obraSocial');
      const num = (af as any).getNumeroAfiliado?.();
      if (
        num === undefined ||
        num === null ||
        (typeof num === 'string' && num.trim() === '')
      ) {
        errores.push('obraSocial.numeroAfiliado');
      }
    }

    if (errores.length) {
      throw new BadRequestException(
        `Faltan datos mandatorios: ${errores.join(', ')}`,
      );
    }

    const cuil = paciente.getCuil();
    if (!this.isCuilFormatoValido(cuil)) {
      throw new BadRequestException(
        'CUIL con formato inválido. Formato esperado: NN-NNNNNNNN-N (ej: 20-12345678-3)',
      );
    }
    if (!this.isCuilChecksumValido(cuil)) {
      throw new BadRequestException(
        'CUIL inválido: el dígito verificador no coincide',
      );
    }
  }

  private isCuilFormatoValido(cuil: string): boolean {
    return /^\d{2}-\d{8}-\d$/.test(cuil);
  }

  private isCuilChecksumValido(cuil: string): boolean {
    // Normalizamos a solo dígitos
    const digits = cuil.replace(/\D/g, '');
    if (digits.length !== 11) return false;

    const nums = digits.split('').map((n) => parseInt(n, 10));
    const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]; // se aplican a los primeros 10 dígitos
    const suma = pesos.reduce((acc, p, i) => acc + p * nums[i], 0);
    let dv = 11 - (suma % 11);
    if (dv === 11) dv = 0;
    else if (dv === 10) dv = 9;

    return dv === nums[10];
  }
}

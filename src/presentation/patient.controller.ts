import { Body, Controller, Get, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePacienteDto } from '../models/paciente/dto/create.patient.dto';

import { SERVICIO_PACIENTE } from 'src/app/interfaces/paciente/paciente.service';
import type { IPacienteServicio } from 'src/app/interfaces/paciente/paciente.service';
import { Paciente } from 'src/models/paciente/paciente';
import { Domicilio } from 'src/models/domicilio/domicililio.entities';
import { ObraSocial } from 'src/models/obra-social/obra-social.entity';
import { Afiliado } from 'src/models/afiliado/afiliado.entities';
import { randomUUID } from 'crypto';
import { PACIENTE_REPOSITORIO } from '../app/interfaces/paciente/patient.repository';
import { PatientRepositoryImpl } from 'src/persistence/patient.repository';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacienteController {
  constructor(
    @Inject(SERVICIO_PACIENTE)
    private readonly pacientes: IPacienteServicio,
    @Inject(PACIENTE_REPOSITORIO)
    private readonly pacientesRepo : PatientRepositoryImpl
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo paciente' })
  @ApiBody({
    type: CreatePacienteDto,
    examples: {
      ejemploValido: {
        summary: 'Paciente con obra social',
        value: {
          nombre: 'Susana',
          apellido: 'Gimenez',
          cuil: '20-12345678-6',
          domicilio: { calle: 'Av. Siempre Viva', localidad: 'San Miguel de Tucumán', numero: 742 },
          obraSocial: { nombre: 'PAMI', numeroAfiliado: "123456789" },
        },
      },
      sinObraSocial: {
        summary: 'Paciente sin obra social',
        value: {
          nombre: 'Juan',
          apellido: 'Pérez',
          cuil: '27-12345678-0',
          domicilio: { calle: 'Belgrano', localidad: 'Yerba Buena', numero: 123 },
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Paciente registrado correctamente' })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos (formato/ checksum de CUIL, campos faltantes, etc.)',
  })
  @ApiNotFoundResponse({
    description: 'Obra social inexistente o afiliación no existente',
  })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    
    return this.pacientes.registrarPaciente(createPacienteDto);
  }

  @Get(':cuil')
  @ApiOperation({ summary: 'Obtener paciente por CUIL' })
  @ApiParam({
    name: 'cuil',
    example: '20-12345678-6',
    description: 'Formato NN-NNNNNNNN-N',
  })
  @ApiOkResponse({ description: 'Paciente encontrado' })
  @ApiNotFoundResponse({ description: 'Paciente no registrado' })
  findByCuil(@Param('cuil') cuil: string) {
    const p = this.pacientes.buscarPacientePorCuil(cuil);
    if (!p) throw new NotFoundException('Paciente no registrado');
    return p;
  }

}
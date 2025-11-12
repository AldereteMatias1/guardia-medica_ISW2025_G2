import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateIngresoDto } from 'src/models/ingreso/create-ingreso.dto';
import { IngresoServiceImpl } from 'src/app/services/ingreso.service';
import { Enfermera } from 'src/models/enfermera/enfermera.entity';
import { EstadoIngreso } from 'src/models/estado-ingreso/estadoIngreso.enum';
import { NivelEmergencia } from 'src/models/nivel-emergencia/nivelEmergencia.enum';

@ApiTags('ingresos')
@Controller('ingresos')
export class IngresoController {
  constructor(
    @Inject(IngresoServiceImpl)
    private readonly ingresoService: IngresoServiceImpl,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo ingreso de paciente' })
  @ApiCreatedResponse({ description: 'Ingreso registrado correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o faltantes' })
  @ApiNotFoundResponse({ description: 'Paciente no encontrado' })
  create(@Body() dto: CreateIngresoDto) {
    const enfermera = new Enfermera(dto.enfermera.nombre,dto.enfermera.apellido); // TODO: Debe haber un repo para los enfermeros
    return this.ingresoService.registrarIngreso(
      dto.cuilPaciente,
      enfermera,
      dto.informe,
      dto.nivelEmergencia,
      dto.temperatura,
      dto.frecuenciaCardiaca,
      dto.frecuenciaRespiratoria,
      dto.presionSistolica,
      dto.presionDiastolica,
    );
  }

  @Get('pendientes')
  @ApiOperation({ summary: 'Obtener ingresos pendientes' })
  @ApiOkResponse({
    description: 'Listado de ingresos con estado Pendiente, ordenados por prioridad',
    schema: {
      example: [
        {
          paciente: '20-12345678-6',
          nivelEmergencia: NivelEmergencia.EMERGENCIA,
          estado: EstadoIngreso.PENDIENTE,
          fechaIngreso: '2025-11-12T10:30:00.000Z',
        },
      ],
    },
  })
  obtenerPendientes() {
    return this.ingresoService.obtenerPendientes();
  }
}

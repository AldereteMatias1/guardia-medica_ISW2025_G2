import { NotFoundException } from '@nestjs/common';

import { Ingreso } from '../../src/business/ingreso/ingreso';
import { IIngresoRepositorio } from '../../src/persistence/ingreso/ingreso.repository.interface';
import { IEnfermeroServicio } from '../../src/business/enfermera/service/enfermera.service.interface';
import { IPacienteRepositorio } from '../../src/persistence/paciente/patient.repository.interface';
import { IngresoService } from '../../src/business/ingreso/service/ingreso.service';

describe('IngresoService - reclamarIngreso', () => {
  let service: IngresoService;

  // Mocks
  let ingresoRepoMock: jest.Mocked<IIngresoRepositorio>;
  let pacienteRepoMock: jest.Mocked<IPacienteRepositorio>;
  let enfermeroServicioMock: jest.Mocked<IEnfermeroServicio>;

  beforeEach(() => {

    pacienteRepoMock = {
    } as unknown as jest.Mocked<IPacienteRepositorio>;

    ingresoRepoMock = {
      reclamarSiguienteIngreso: jest.fn(),
    } as unknown as jest.Mocked<IIngresoRepositorio>;

    enfermeroServicioMock = {
    } as unknown as jest.Mocked<IEnfermeroServicio>;

    service = new IngresoService(
      pacienteRepoMock,
      ingresoRepoMock,
      enfermeroServicioMock
    );
  });

  it('debe devolver el ultimo ingreso cuando existe al menos uno', async () => {
    const ingresoMock = {} as Ingreso;

    ingresoRepoMock.reclamarSiguienteIngreso.mockResolvedValue(ingresoMock);

    const result = await service.reclamarIngreso();

    expect(ingresoRepoMock.reclamarSiguienteIngreso).toHaveBeenCalledTimes(1);
    expect(result).toBe(ingresoMock);
  });

  it('No hay ingresos pendientes, se lanza exception', async () => {
    ingresoRepoMock.reclamarSiguienteIngreso.mockResolvedValue(null);

    await expect(service.reclamarIngreso())
      .rejects
      .toThrow(new NotFoundException('No hay Paciente en la lista de espera'));
  });
});

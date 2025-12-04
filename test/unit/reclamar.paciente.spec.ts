import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Ingreso } from '../../src/business/ingreso/ingreso';
import { IIngresoRepositorio } from '../../src/persistence/ingreso/ingreso.repository.interface';
import { IEnfermeroServicio } from '../../src/business/enfermera/service/enfermera.service.interface';
import { IPacienteRepositorio } from '../../src/persistence/paciente/patient.repository.interface';
import { IAtencionServicio } from '../../src/business/atencion/service/atencion.service.interface'; // Importar la interfaz
import { IngresoService } from '../../src/business/ingreso/service/ingreso.service';

describe('IngresoService - reclamarIngreso', () => {
  let service: IngresoService;

  let ingresoRepoMock: jest.Mocked<IIngresoRepositorio>;
  let pacienteRepoMock: jest.Mocked<IPacienteRepositorio>;
  let enfermeroServicioMock: jest.Mocked<IEnfermeroServicio>;
  let atencionServicioMock: jest.Mocked<IAtencionServicio>; 

  const ID_MEDICO = 42;
  const ID_INGRESO = 101;
  let ingresoMock: Ingreso;

  beforeEach(() => {

    pacienteRepoMock = {} as unknown as jest.Mocked<IPacienteRepositorio>;
    enfermeroServicioMock = {} as unknown as jest.Mocked<IEnfermeroServicio>;

    ingresoRepoMock = {
      reclamarSiguienteIngreso: jest.fn(),
    } as unknown as jest.Mocked<IIngresoRepositorio>;

    atencionServicioMock = {
      hasIngresoEnProceso: jest.fn(), 
      asociarAtencion: jest.fn(),    
    } as unknown as jest.Mocked<IAtencionServicio>;

    ingresoMock = {
      getId: jest.fn(() => ID_INGRESO),
    } as unknown as Ingreso;
    
    service = new IngresoService(
      pacienteRepoMock,
      ingresoRepoMock,
      enfermeroServicioMock,
      atencionServicioMock 
    );
  });

  it('debe devolver el ingreso, asociar la atención y actualizar el estado cuando el médico está libre', async () => {
    // Arrange
    atencionServicioMock.hasIngresoEnProceso.mockResolvedValue(false); // Médico libre
    ingresoRepoMock.reclamarSiguienteIngreso.mockResolvedValue(ingresoMock);

    // Act
    const result = await service.reclamarIngreso(ID_MEDICO);

    // Assert
    expect(atencionServicioMock.hasIngresoEnProceso).toHaveBeenCalledWith(ID_MEDICO); 
    expect(ingresoRepoMock.reclamarSiguienteIngreso).toHaveBeenCalledTimes(1); 
    expect(atencionServicioMock.asociarAtencion).toHaveBeenCalledWith(ID_MEDICO, ID_INGRESO); // NUEVA VERIFICACIÓN
    expect(result).toBe(ingresoMock);
  });

  it('debe lanzar NotFoundException si no hay ingresos pendientes', async () => {
    // Arrange
    atencionServicioMock.hasIngresoEnProceso.mockResolvedValue(false); 
    ingresoRepoMock.reclamarSiguienteIngreso.mockResolvedValue(null); 

    // Act & Assert
    await expect(service.reclamarIngreso(ID_MEDICO))
      .rejects
      .toThrow(new NotFoundException('No hay Paciente en la lista de espera'));
      
    expect(atencionServicioMock.hasIngresoEnProceso).toHaveBeenCalledTimes(1);
    expect(atencionServicioMock.asociarAtencion).not.toHaveBeenCalled(); 
  });
  


  it('debe lanzar BadRequestException si el médico ya tiene un ingreso en proceso', async () => {
    // Arrange
    atencionServicioMock.hasIngresoEnProceso.mockResolvedValue(true); 
    
    // Act & Assert
    await expect(service.reclamarIngreso(ID_MEDICO))
      .rejects
      .toThrow(new BadRequestException('El medico tiene un ingreso en proceso'));
      
    expect(atencionServicioMock.hasIngresoEnProceso).toHaveBeenCalledWith(ID_MEDICO);
    expect(ingresoRepoMock.reclamarSiguienteIngreso).not.toHaveBeenCalled();
    expect(atencionServicioMock.asociarAtencion).not.toHaveBeenCalled();
  });
});
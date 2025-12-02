import { NotFoundException, BadRequestException } from '@nestjs/common';

import { IAtencionRepositorio } from '../../src/persistence/atencion/atencion.repository.interface'; 
import { IIngresoServicio } from '../../src/business/ingreso/service/ingreso.service.interface'; 
import { AtencionServicio } from '../../src/business/atencion/service/atencion.service';
import { IIngresoRepositorio } from '../../src/persistence/ingreso/ingreso.repository.interface';

const mockIngreso = { 
    getId: jest.fn(() => 101) 
} as any; 

const mockAtencion = { 
    getId: jest.fn(() => 505),
    getIngreso: jest.fn(() => mockIngreso)
} as any; 

const mockCompletarAtencionDto = {
    idMedico: 42,
    informe: 'El paciente fue estabilizado y dado de alta.'
};

const mockCompletarAtencionSinInforme = {
    idMedico: 42,
    informe: '' 
};

describe('AtencionServicio.completarAtencion', () => {
    let service: AtencionServicio;
    
    let atencionRepositorioMock: jest.Mocked<IAtencionRepositorio>;
    let ingresoRepositorioMock: jest.Mocked<IIngresoRepositorio>;

    beforeEach(() => {
        atencionRepositorioMock = {
            traerAtencion: jest.fn(),
            completarAtencion: jest.fn().mockResolvedValue(undefined),
        } as unknown as jest.Mocked<IAtencionRepositorio>;

        ingresoRepositorioMock = {
            finalizarIngreso: jest.fn().mockResolvedValue(undefined),
        } as unknown as jest.Mocked<IIngresoRepositorio>;

        service = new AtencionServicio(
            atencionRepositorioMock,
            ingresoRepositorioMock
        );

        jest.clearAllMocks();
    });

    it('debe completar la atención y finalizar el ingreso cuando los datos son válidos', async () => {
        // Arrange
        atencionRepositorioMock.traerAtencion.mockResolvedValue(mockAtencion);

        // Act
        await service.completarAtencion(mockCompletarAtencionDto);

        // Assert
        expect(atencionRepositorioMock.traerAtencion).toHaveBeenCalledWith(mockCompletarAtencionDto.idMedico);
        
        expect(atencionRepositorioMock.completarAtencion).toHaveBeenCalledWith(
            mockAtencion.getId(), 
            mockCompletarAtencionDto.informe
        );
        
        expect(mockAtencion.getIngreso().getId).toHaveBeenCalled();
        expect(ingresoRepositorioMock.finalizarIngreso).toHaveBeenCalledWith(101); 
    });

    it('debe lanzar NotFoundException si no se encuentra la atención para el médico', async () => {
        // Arrange
        atencionRepositorioMock.traerAtencion.mockResolvedValue(null);

        // Act & Assert
        await expect(service.completarAtencion(mockCompletarAtencionDto))
            .rejects
            .toThrow(NotFoundException);
        expect(atencionRepositorioMock.completarAtencion).not.toHaveBeenCalled();
        expect(ingresoRepositorioMock.finalizarIngreso).not.toHaveBeenCalled();
    });

    // test/unit/completar.atencion.spec.ts (CORREGIDO)

it('debe lanzar BadRequestException si el informe está vacío', async () => {
    // Arrange
    atencionRepositorioMock.traerAtencion.mockResolvedValue(mockAtencion);
    
    const promise = service.completarAtencion(mockCompletarAtencionSinInforme);

    // Assert
    await expect(promise).rejects.toThrow(BadRequestException);
    
    await expect(promise).rejects.toThrow('El campo informe es obligatorio');

    expect(atencionRepositorioMock.traerAtencion).toHaveBeenCalledTimes(1);
    expect(atencionRepositorioMock.completarAtencion).not.toHaveBeenCalled();
    expect(ingresoRepositorioMock.finalizarIngreso).not.toHaveBeenCalled();
});

});
import { Test, TestingModule } from "@nestjs/testing";
import { SERVICIO_PACIENTE } from "../../src/app/interfaces/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { Paciente } from "../../src/models/paciente/paciente";
import { Domicilio } from "../../src/models/domicilio/domicililio.entities";
import { REPOSITORIO_OBRA_SOCIAL } from "../../src/app/interfaces/obra.social.repository";
import { PACIENTE_REPOSITORIO } from "../../src/app/interfaces/patient.repository";
import { NotFoundException } from "@nestjs/common";


describe('Registrar paciente (unit)', () => {
  let moduleRef: TestingModule;
  let pacienteServicio: PacienteServicio;

    const obraSocialRepoMock = {
    existePorNombre: jest.fn() as jest.MockedFunction<(nombre: string) => boolean>,
    afiliadoAlPaciente: jest.fn() as jest.MockedFunction<(cuil: string, numeroAfiliado: number) => boolean>,
  };

  const pacienteRepoMock = {
    guardarPaciente: jest.fn(),
    buscarPacientePorCuil: jest.fn(),
    existePorCuil: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        { provide: SERVICIO_PACIENTE, useClass: PacienteServicio },
        { provide: REPOSITORIO_OBRA_SOCIAL, useValue: obraSocialRepoMock },
        { provide: PACIENTE_REPOSITORIO, useValue: pacienteRepoMock }
      ],
    }).compile();

    pacienteServicio = moduleRef.get<PacienteServicio>(SERVICIO_PACIENTE);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Se registra el paciente exitosamente con obra social", () => {
    const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    const paciente = new Paciente("Ivan", "Ochoa", "20-41383873-9", "OSECAC", domicilio);
    const numeroAfiliado = 15820;

    // Arrange 
    obraSocialRepoMock.existePorNombre.mockReturnValue(true);
    obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

    // Act
    const p = pacienteServicio.registrarPaciente(paciente, numeroAfiliado);

    // Assert
    expect(p.Cuil).toBe("20-41383873-9");
    expect(pacienteServicio.buscarPacientePorCuil("20-41383873-9")).not.toBeNull();
    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
    expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith("20-41383873-9", 15820);

  });

  it("Se registra el paciente exitosamente sin obra social", () => {
    const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    const paciente = new Paciente("Ivan", "Ochoa", "20-41383873-9", "", domicilio);
    
    const p = pacienteServicio.registrarPaciente(paciente, 0);

    expect(p.Cuil).toBe("20-41383873-9");
    expect(pacienteServicio.buscarPacientePorCuil("20-41383873-9")).not.toBeNull();

    expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
    expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
  });

  // it("No se registra el paciente cuando la obra social no existe o no puede afiliar", () => {
  //   const paciente = new Paciente("Ivan", "Ochoa", "20-41383873-9", "FICTICIA");
  //   const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
  //   paciente["domicilio"] = domicilio;

  //   obraSocialRepoMock.existePorNombre.mockReturnValue(false);
  //   obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(false); 

  //   expect(() => pacienteServicio.registrarPaciente(paciente, 12345)).toThrow(NotFoundException);
  //   expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("FICTICIA");
  //   // No debería afiliar si no existe
  //   expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();

  //   // (opcional) Caso B: existe pero falla la afiliación
  //   jest.clearAllMocks();
  //   obraSocialRepoMock.existePorNombre.mockReturnValue(true);
  //   obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(false);

  //   expect(() => pacienteServicio.registrarPaciente(paciente, 12345)).toThrow(NotFoundException);
  //   expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("FICTICIA");
  //   expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith("20-41383873-9", 12345);
  // });

  

});
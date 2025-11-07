import { Test, TestingModule } from "@nestjs/testing";
import { SERVICIO_PACIENTE } from "../../src/app/interfaces/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { Paciente } from "../../src/models/paciente/paciente";
import { Domicilio } from "../../src/models/domicilio/domicililio.entities";
import { REPOSITORIO_OBRA_SOCIAL } from "../../src/app/interfaces/obra.social.repository";
import { PACIENTE_REPOSITORIO } from "../../src/app/interfaces/patient.repository";
import { ObraSocial } from "../../src/models/obra-social/obra-social.entity";
import { Afiliado } from "../../src/models/afiliado/afiliado.entities";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Cuil } from "../../src/models/value-objects/cuil";


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
      // Arrange
      const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);

      const numeroAfiliado = 15820;
      const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
      const afiliado = new Afiliado(1, numeroAfiliado, obra);
      const cuil = new Cuil("20-41383873-9");

      const paciente = new Paciente(
        "Ivan",
        "Ochoa",
        cuil,
        "ivan.ochoa@mail.com", 
        afiliado,
        domicilio
      );

      obraSocialRepoMock.existePorNombre.mockReturnValue(true);
      obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

      // Act
      const p = pacienteServicio.registrarPaciente(paciente);

      // Assert
      expect(p.getCuil().ValorFormateado).toBe("20-41383873-9");
      expect(pacienteServicio.buscarPacientePorCuil("20-41383873-9")).not.toBeNull();

      expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledTimes(1);
      expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");

      expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledTimes(1);
      expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
        "20-41383873-9",
        numeroAfiliado
      );
  });

  it("No se registra el paciente si la obra social no existe", () => {
    const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 15820, obra);
    const paciente = new Paciente(
      "Ivan",
      "Ochoa",
      new Cuil("20-41383873-9"),
      "ivan.ochoa@mail.com",
      afiliado,
      domicilio
    );

    obraSocialRepoMock.existePorNombre.mockReturnValue(false); 
    obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(new NotFoundException("Obra social inexistente"));

    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
  });

  it("No se registra el paciente si la afiliacion a la obra social no existe", () => {
    const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 15820, obra);

    const paciente = new Paciente(
      "Ivan",
      "Ochoa",
      new Cuil("20-41383873-9"),
      "ivan.ochoa@mail.com",
      afiliado,
      domicilio
    );

    obraSocialRepoMock.existePorNombre.mockReturnValue(true);
    obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(false); 

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(new NotFoundException("Afiliacion no existente"));

    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
    expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
      "20-41383873-9",
      15820
    );
  });

  it("Se registra el paciente exitosamente con obra social si no tiene obra social", () => {
    const domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    const afiliado = undefined; 

    const paciente = new Paciente(
      "Ivan",
      "Ochoa",
      new Cuil("20-41383873-9"),
      "ivan.ochoa@mail.com",
      afiliado,
      domicilio
    );

    const p = pacienteServicio.registrarPaciente(paciente);

    expect(p.getCuil().ValorFormateado).toBe("20-41383873-9");
    expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
    expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
  });

  it("Falla si viene obra social pero falta numeroAfiliado", () => {
  const cuil = new Cuil("20-41383873-9");
  const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", 450);
  const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");


  const afiliadoIncompleto = new Afiliado(1, "" as any, obra);
  const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliadoIncompleto, domicilio);

  expect(() => pacienteServicio.registrarPaciente(paciente))
    .toThrow(BadRequestException);
});

it("Falla si viene obra social pero falta el objeto ObraSocial", () => {
  const cuil = new Cuil("20-41383873-9");
  const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", 450);

  const afiliadoIncompleto = new Afiliado(1, 15820, undefined as any);
  const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliadoIncompleto, domicilio);

  expect(() => pacienteServicio.registrarPaciente(paciente))
    .toThrow(BadRequestException);
});

it("Falla al registrar paciente con CUIL inválido", () => {
  const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", 450);
  const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
  const afiliado = new Afiliado(1, 15820, obra);

  const cuilInvalido = "20-41383873-0"; 

  expect(() => new Cuil(cuilInvalido)).toThrow(Error);
  expect(() => new Cuil(cuilInvalido)).toThrow(/dígito verificador/i);
});

it("Falla si falta el nombre", () => {
    const cuil = new Cuil("20-41383873-9");
    const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("", "Ochoa", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("nombre");
    }
  });

  it("Falla si falta el apellido", () => {
    const cuil = new Cuil("20-41383873-9");
    const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("Ivan", "", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("apellido");
    }
  });

  it("Falla si falta el domicilio", () => {
    const cuil = new Cuil("20-41383873-9");
    const domicilio = undefined;
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio");
    }
  });

  it("Falla si falta el atributo calle de domicilio", () => {
  
    const cuil = new Cuil("20-41383873-9");
    const domicilio = new Domicilio("", "San Miguel de Tucuman", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.calle");
    }
  });

  it("Falla si falta el atributo localidad de domicilio", () => {
  
    const cuil = new Cuil("20-41383873-9");
    const domicilio = new Domicilio("Bolivia", "", 450);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.localidad");
    }
  });

  it("Falla si falta el atributo numero de domicilio", () => {
  
    const cuil = new Cuil("20-41383873-9");
    const domicilio = new Domicilio("Bolivia", "San Miguel de Tucuman", undefined as any);
    const obra = new ObraSocial("11111111-aaaa-bbbb-cccc-222222222222", "OSECAC");
    const afiliado = new Afiliado(1, 150, obra);
    const paciente = new Paciente("Ivan", "Ochoa", cuil, "ivan@mail.com", afiliado, domicilio);

    expect(() => pacienteServicio.registrarPaciente(paciente))
      .toThrow(BadRequestException);

    try {
      pacienteServicio.registrarPaciente(paciente);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.numero");
    }
  });

 

});


  


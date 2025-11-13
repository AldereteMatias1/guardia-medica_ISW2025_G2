import { Test, TestingModule } from "@nestjs/testing";
import { SERVICIO_PACIENTE } from "../../src/app/interfaces/paciente/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { REPOSITORIO_OBRA_SOCIAL } from "../../src/app/interfaces/obraSocial/obra.social.repository";
import { PACIENTE_REPOSITORIO } from "../../src/app/interfaces/paciente/patient.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreatePacienteDto, DomicilioDto, ObraSocialDto } from "../../src/models/paciente/dto/create.patient.dto";

function crearPacienteDtoBase(overrides?: {
  nombre?: string;
  apellido?: string;
  cuil?: string;
  domicilio?: Partial<DomicilioDto> | null;
  obraSocial?: Partial<ObraSocialDto> | null;
}): CreatePacienteDto {
  const dto = new CreatePacienteDto() as any; 

  dto.nombre = overrides?.nombre ?? "Ivan";
  dto.apellido = overrides?.apellido ?? "Ochoa";
  dto.cuil = overrides?.cuil ?? "20-41383873-9";

  if (overrides?.domicilio === null) {
    dto.domicilio = undefined;
  } else {
    const dom = new DomicilioDto() as any;
    dom.calle = overrides?.domicilio?.calle ?? "Bolivia";
    dom.localidad = overrides?.domicilio?.localidad ?? "San Miguel de Tucuman";
    dom.numero = overrides?.domicilio?.numero ?? 450;
    dto.domicilio = dom;
  }

  if (overrides?.obraSocial === null) {
    dto.obraSocial = undefined;
  } else if (overrides?.obraSocial) {
    const os = new ObraSocialDto() as any;
    os.nombre = overrides.obraSocial.nombre ?? "OSECAC";
    os.numeroAfiliado = overrides.obraSocial.numeroAfiliado ?? 15820;
    dto.obraSocial = os;
  } else {
    dto.obraSocial = undefined;
  }

  return dto as CreatePacienteDto;
}


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
  const dto = crearPacienteDtoBase({
    obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
  });

  obraSocialRepoMock.existePorNombre.mockReturnValue(true);
  obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

  const p = pacienteServicio.registrarPaciente(dto);

  expect(p.getCuil()).toBe("20-41383873-9");
  expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
  expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
    "20-41383873-9",
    15820
  );
  });

  it("No se registra el paciente si la obra social no existe", () => {
  const dto = crearPacienteDtoBase({
    obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
  });

  obraSocialRepoMock.existePorNombre.mockReturnValue(false);
  obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(new NotFoundException("Obra social inexistente"));

  expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
  });

  it("No se registra el paciente si la afiliacion a la obra social no existe", () => {
  const dto = crearPacienteDtoBase({
    obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
  });

  obraSocialRepoMock.existePorNombre.mockReturnValue(true);
  obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(false);

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(new NotFoundException("Afiliacion no existente"));

  expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
  expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
    "20-41383873-9",
    15820
  );
  });

  it("Se registra el paciente exitosamente si no tiene obra social", () => {
  const dto = crearPacienteDtoBase({ obraSocial: null });

  const p = pacienteServicio.registrarPaciente(dto);

  expect(p.getCuil()).toBe("20-41383873-9");
  expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
  expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
  });

  it("Falla si viene obra social pero falta numeroAfiliado", () => {
 
  const dto = crearPacienteDtoBase(); 


  const obraDto = new ObraSocialDto() as any;
  obraDto.nombre = "OSECAC";
  obraDto.numeroAfiliado = undefined; 
  (dto as any).obraSocial = obraDto;

 
  obraSocialRepoMock.existePorNombre.mockReturnValue(true);
  obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("obrasocial.numeroafiliado"); // tal como lo arma tu assertCamposMandatorios
  }

  expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
  expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
});

  it("Falla si viene obra social pero falta el objeto ObraSocial (nombre vacío)", () => {
  const dto = crearPacienteDtoBase({
    obraSocial: { nombre: "", numeroAfiliado: 15820 },
  });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("obrasocial.obrasocial"); 
  }
  });

  it("Falla si falta el nombre", () => {
  const dto = crearPacienteDtoBase({ nombre: "" });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("nombre");
  }
  });

  it("Falla si falta el apellido", () => {
  const dto = crearPacienteDtoBase({ apellido: "" });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("apellido");
  }
  });

  it("Falla si falta el domicilio", () => {
  const dto = crearPacienteDtoBase({ domicilio: null });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("domicilio");
  }
  });
  
  it("Falla si falta el atributo calle de domicilio", () => {
  const dto = crearPacienteDtoBase({
    domicilio: { calle: "" },
  });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("domicilio.calle");
  }
  });  

  it("Falla si falta el atributo localidad de domicilio", () => {
  const dto = crearPacienteDtoBase({
    domicilio: { localidad: "" },
  });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("domicilio.localidad");
  }
  });  

  it("Falla si falta el atributo numero de domicilio", () => {
  const dto = crearPacienteDtoBase();

  (dto.domicilio as any).numero = undefined;

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("faltan datos mandatorios");
    expect(msg).toContain("domicilio.numero");
  }
});

  it("Falla si el CUIL no cumple el formato NN-NNNNNNNN-N", () => {
  const dto = crearPacienteDtoBase({
    cuil: "20413838739",
  });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("formato inválido");
    expect(msg).toContain("nn-nnnnnnnn-n");
  }
  });

  it("Falla si el CUIL tiene dígito verificador incorrecto", () => {
  const dto = crearPacienteDtoBase({
    cuil: "20-41383873-0",
  });

  expect(() => pacienteServicio.registrarPaciente(dto))
    .toThrow(BadRequestException);

  try {
    pacienteServicio.registrarPaciente(dto);
  } catch (e) {
    const msg = (e as BadRequestException).message.toLowerCase();
    expect(msg).toContain("dígito verificador");
    expect(msg).toContain("no coincide");
  }
  });

  it("Pasa con CUIL válido (formato y checksum correctos)", () => {
  const dto = crearPacienteDtoBase({
    cuil: "20-41383873-9",
    obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
  });

  obraSocialRepoMock.existePorNombre.mockReturnValue(true);
  obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

  const p = pacienteServicio.registrarPaciente(dto);
  expect(p.getCuil()).toBe("20-41383873-9");
  });

  
});


  


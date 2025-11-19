import { Test, TestingModule } from "@nestjs/testing";
import { SERVICIO_PACIENTE } from "../../src/app/interfaces/paciente/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { REPOSITORIO_OBRA_SOCIAL } from "../../src/app/interfaces/obraSocial/obra.social.repository";
import { PACIENTE_REPOSITORIO } from "../../src/app/interfaces/paciente/patient.repository.interface";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreatePacienteDto, DomicilioDto, ObraSocialDto } from "../../src/models/paciente/dto/create.patient.dto";
import { Paciente } from "../../src/models/paciente/paciente";

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

describe("Registrar paciente (unit)", () => {
  let moduleRef: TestingModule;
  let pacienteServicio: PacienteServicio;

  const obraSocialRepoMock: {
  existePorNombre: jest.MockedFunction<(nombre: string) => Promise<boolean>>;
  afiliadoAlPaciente: jest.MockedFunction<
    (cuil: string, numeroAfiliado: number, nombreObra: string) => Promise<boolean>
  >;
} = {
  existePorNombre: jest.fn(),
  afiliadoAlPaciente: jest.fn(),
};

const pacienteRepoMock: {
  guardarPaciente: jest.MockedFunction<(p: Paciente) => Promise<void>>;
  buscarPacientePorCuil: jest.MockedFunction<(cuil: string) => Promise<Paciente | null>>;
  existePorCuil: jest.MockedFunction<(cuil: string) => Promise<boolean>>; // si lo usás
} = {
  guardarPaciente: jest.fn(),
  buscarPacientePorCuil: jest.fn(),
  existePorCuil: jest.fn(),
};

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        { provide: SERVICIO_PACIENTE, useClass: PacienteServicio },
        { provide: REPOSITORIO_OBRA_SOCIAL, useValue: obraSocialRepoMock },
        { provide: PACIENTE_REPOSITORIO, useValue: pacienteRepoMock },
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

  it("Se registra el paciente exitosamente con obra social", async () => {
    const dto = crearPacienteDtoBase({
      obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
    });

    obraSocialRepoMock.existePorNombre.mockResolvedValue(true);
    obraSocialRepoMock.afiliadoAlPaciente.mockResolvedValue(true);
    pacienteRepoMock.guardarPaciente.mockResolvedValue(undefined);

    const p = await pacienteServicio.registrarPaciente(dto);

    expect(p.getCuil()).toBe("20-41383873-9");
    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
    expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
      "20-41383873-9",
      15820,
      "OSECAC"
    );
    expect(pacienteRepoMock.guardarPaciente).toHaveBeenCalledTimes(1);
  });

  it("No se registra el paciente si la obra social no existe", async () => {
    const dto = crearPacienteDtoBase({
      obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
    });

    obraSocialRepoMock.existePorNombre.mockResolvedValue(false);
    obraSocialRepoMock.afiliadoAlPaciente.mockResolvedValue(true);

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(NotFoundException);

    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
    // No hace falta verificar afiliadoAlPaciente porque debería cortar antes
  });

  it("No se registra el paciente si la afiliacion a la obra social no existe", async () => {
    const dto = crearPacienteDtoBase({
      obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
    });

    obraSocialRepoMock.existePorNombre.mockResolvedValue(true);
    obraSocialRepoMock.afiliadoAlPaciente.mockResolvedValue(false);

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(NotFoundException);

    expect(obraSocialRepoMock.existePorNombre).toHaveBeenCalledWith("OSECAC");
    expect(obraSocialRepoMock.afiliadoAlPaciente).toHaveBeenCalledWith(
      "20-41383873-9",
      15820,
      "OSECAC"
    );
  });

  it("Se registra el paciente exitosamente si no tiene obra social", async () => {
    const dto = crearPacienteDtoBase({ obraSocial: null });

    pacienteRepoMock.guardarPaciente.mockResolvedValue(undefined);

    const p = await pacienteServicio.registrarPaciente(dto);

    expect(p.getCuil()).toBe("20-41383873-9");
    expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
    expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
    expect(pacienteRepoMock.guardarPaciente).toHaveBeenCalledTimes(1);
  });

  it("Falla si viene obra social pero falta numeroAfiliado", async () => {
    const dto = crearPacienteDtoBase();

    const obraDto = new ObraSocialDto() as any;
    obraDto.nombre = "OSECAC";
    obraDto.numeroAfiliado = undefined;
    (dto as any).obraSocial = obraDto;

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("obrasocial.numeroafiliado");
    }

    expect(obraSocialRepoMock.existePorNombre).not.toHaveBeenCalled();
    expect(obraSocialRepoMock.afiliadoAlPaciente).not.toHaveBeenCalled();
  });

  it("Falla si viene obra social pero falta el objeto ObraSocial (nombre vacío)", async () => {
    const dto = crearPacienteDtoBase({
      obraSocial: { nombre: "", numeroAfiliado: 15820 },
    });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("obrasocial.obrasocial");
    }
  });

  it("Falla si falta el nombre", async () => {
    const dto = crearPacienteDtoBase({ nombre: "" });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("nombre");
    }
  });

  it("Falla si falta el apellido", async () => {
    const dto = crearPacienteDtoBase({ apellido: "" });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("apellido");
    }
  });

  it("Falla si falta el domicilio", async () => {
    const dto = crearPacienteDtoBase({ domicilio: null });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio");
    }
  });

  it("Falla si falta el atributo calle de domicilio", async () => {
    const dto = crearPacienteDtoBase({
      domicilio: { calle: "" },
    });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.calle");
    }
  });

  it("Falla si falta el atributo localidad de domicilio", async () => {
    const dto = crearPacienteDtoBase({
      domicilio: { localidad: "" },
    });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.localidad");
    }
  });

  it("Falla si falta el atributo numero de domicilio", async () => {
    const dto = crearPacienteDtoBase();
    (dto.domicilio as any).numero = undefined;

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("faltan datos mandatorios");
      expect(msg).toContain("domicilio.numero");
    }
  });

  it("Falla si el CUIL no cumple el formato NN-NNNNNNNN-N", async () => {
    const dto = crearPacienteDtoBase({
      cuil: "20413838739",
    });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("formato inválido");
      expect(msg).toContain("nn-nnnnnnnn-n");
    }
  });

  it("Falla si el CUIL tiene dígito verificador incorrecto", async () => {
    const dto = crearPacienteDtoBase({
      cuil: "20-41383873-0",
    });

    await expect(pacienteServicio.registrarPaciente(dto)).rejects.toBeInstanceOf(BadRequestException);

    try {
      await pacienteServicio.registrarPaciente(dto);
    } catch (e) {
      const msg = (e as BadRequestException).message.toLowerCase();
      expect(msg).toContain("dígito verificador");
      expect(msg).toContain("no coincide");
    }
  });

  it("Pasa con CUIL válido (formato y checksum correctos)", async () => {
    const dto = crearPacienteDtoBase({
      cuil: "20-41383873-9",
      obraSocial: { nombre: "OSECAC", numeroAfiliado: 15820 },
    });

    obraSocialRepoMock.existePorNombre.mockResolvedValue(true);
    obraSocialRepoMock.afiliadoAlPaciente.mockResolvedValue(true);
    pacienteRepoMock.guardarPaciente.mockResolvedValue(undefined);

    const p = await pacienteServicio.registrarPaciente(dto);
    expect(p.getCuil()).toBe("20-41383873-9");
  });
});

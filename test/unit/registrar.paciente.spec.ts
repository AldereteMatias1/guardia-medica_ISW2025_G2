import { Test, TestingModule } from "@nestjs/testing";
import { SERVICIO_PACIENTE } from "../../src/app/interfaces/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { Paciente } from "../../src/models/paciente/paciente";
import { Domicilio } from "../../src/models/domicilio/domicililio.entities";
import { IObraSocial, REPOSITORIO_OBRA_SOCIAL } from "../../src/app/interfaces/obra.social.repository";


describe('Registrar paciente (unit)', () => {
    let moduleRef: TestingModule;
  let pacienteServicio: PacienteServicio;

  const obraSocialRepoMock: jest.Mocked<IObraSocial> = {
    existePorNombre: jest.fn(),
    afiliadoAlPaciente: jest.fn(),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        { provide: SERVICIO_PACIENTE, useClass: PacienteServicio },
        { provide: REPOSITORIO_OBRA_SOCIAL, useValue: obraSocialRepoMock },
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
        let paciente = new Paciente("Ivan", "Ochoa", "20-41383873-9", "Mora");
        let domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
        let numeroAfiliado = 15820;
        paciente.asignarDomicilio(domicilio);

        obraSocialRepoMock.existePorNombre.mockReturnValue(true);
        obraSocialRepoMock.afiliadoAlPaciente.mockReturnValue(true);

        const p = pacienteServicio.registrarPaciente(paciente, numeroAfiliado);

        expect(p.Cuil).toEqual("20-41383873-9");

  });

  it("Se registra el paciente exitosamente sin obra social", () => {
        let paciente = new Paciente("Ivan", "Ochoa", "20-41383873-9", "Mora");
        let domicilio = new Domicilio("bolivia", "San Miguel de Tucuman", 450);
    
        paciente.asignarDomicilio(domicilio);

        const p = pacienteServicio.registrarPaciente(paciente, 0);

        expect(p.Cuil).toEqual("20-41383873-9");

  });

});
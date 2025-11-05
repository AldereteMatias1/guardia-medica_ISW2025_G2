import { Before, Given, Then, When } from "@cucumber/cucumber";
import { DataBaseInMemory } from '../../test/mock/database.memory';
import { Domicilio } from "../../src/models/domicilio/domicililio.entities";
import { Paciente } from "../../src/models/paciente/paciente";
import { IPacienteServicio } from "../../src/app/interfaces/paciente.service";
import { PacienteServicio } from "../../src/app/services/paciente.service";
import { IObraSocial } from "../../src/app/interfaces/obra.social.repository";
import { DataBaseObraSocialInMemory } from "../../test/mock/database.memory.obra.social";
import { strict as assert } from 'assert';

let patientRepo: DataBaseInMemory;
let patientService: IPacienteServicio;
let obraSocial: IObraSocial;
let cuil: string;
let lastError: unknown;

Before((scenario) => {
  patientRepo = new DataBaseInMemory(); 
  obraSocial = new DataBaseObraSocialInMemory();
  patientService = new PacienteServicio(obraSocial, patientRepo);
  cuil = "";
  lastError = undefined;
});

 Given('no hay ningún paciente registrado con el cuil {string}', function (cuil: string) {
           patientService.buscarPacientePorCuil(cuil);
         });

 When('se ingresan:', function (dataTable) {
    const data = dataTable.hashes();
    const row = data[0];
    cuil = row['cuil'];
    const numeroAfiliado = Number(row["numero de afiliado"]);
    const domicilio = new Domicilio(row["calle"], row["localidad"], Number(row["numero"]));
    const p = new Paciente(row['nombre'], row['apellido'], cuil, row['obra social']);
    p.asignarDomicilio(domicilio);
    try {
    patientService.registrarPaciente(p, numeroAfiliado);
  } catch (e) {
    lastError = e; 
  }
    });

Then('se muestra un mensaje indicando que el paciente se creo exitosamente', function () {        
           const pacienteRegistrado = patientService.buscarPacientePorCuil(cuil);
           assert.ok(pacienteRegistrado);
           console.log('✓ Paciente registrado exitosamente');
         });

Then('se muestra un mensaje indicando que el paciente no se registro', function () {
            const pacienteRegistrado = patientService.buscarPacientePorCuil(cuil);
           assert.equal(pacienteRegistrado, null, "El paciente no debería haberse registrado");
         });

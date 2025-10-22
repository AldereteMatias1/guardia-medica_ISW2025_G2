import { Before, Given, Then, When } from "@cucumber/cucumber";
import { DataBaseInMemory } from '../../test/mock/database.memory';
import { Domicilio } from "src/models/domicilio/domicililio.entities";
import { Paciente } from "src/models/paciente/paciente";

let patientRepo: DataBaseInMemory;

Before((scenario) => {
  patientRepo = new DataBaseInMemory(); 
  
});

 Given('no hay ningún paciente registrado con el cuil {string}', function (cuil: string) {
           patientRepo.buscarPacientePorCuil(cuil);
         });

 When('se ingresan:', function (dataTable) {
    const data = dataTable.hashes();
    const numeroAfiliado = Number(data.row["numero de afiliado"]);
    const domicilio = new Domicilio(data.row["calle"], data.row["localidad"], Number(data.row["numero"]));
    const p = new Paciente( data.row['nombre'],  data.row['apellido'],  data.row['cuil'],  data.row['obra social']);
    p.asignarDomicilio(domicilio);
    
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('se muestra un mensaje indicando que el paciente se creo exitosamente', function () {        
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

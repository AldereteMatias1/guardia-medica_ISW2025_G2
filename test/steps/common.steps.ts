import { Given } from '@cucumber/cucumber';
import { Enfermera } from '../../src/models/enfermera/enfermera.entity';

let enfermera: Enfermera;


Given('que la siguiente enfermera está registrada:', (dataTable) => {
  const row = dataTable.hashes()[0];
  enfermera = new Enfermera(row['Nombre'], row['Apellido']);
});

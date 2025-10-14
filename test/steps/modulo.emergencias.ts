
import { Before, Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

import { IngresoService } from '../../src/models/ingreso/ingreso.service';
import { Ingreso } from '../../src/models/ingreso/ingreso';
import { Paciente } from '../../src/models/paciente/paciente';
import { InMemoryPatientRepository } from '../../src/models/paciente/repository/paciente.repository.inMem'
import { NivelEmergencia } from '../../src/models/nivel-emergencia/nivelEmergencia.enum';
import { EstadoIngreso } from '../../src/models/estado-ingreso/estadoIngreso.enum';
import { Enfermera } from '../../src/models/enfermera/enfermera.entity';

let enfermera: Enfermera;
let service: IngresoService;
let patientRepo: InMemoryPatientRepository;
let msgLastError: string;
let countAntesDeIntento = 0;

function nivelFromNombre(nombre: string): NivelEmergencia {
  if (!nombre) return NaN as any;
  const n = nombre.trim().toLowerCase();
  if (n === 'critica' || n === 'crítica') return NivelEmergencia.CRITICA;
  if (n === 'emergencia') return NivelEmergencia.EMERGENCIA;
  if (n === 'urgencia') return NivelEmergencia.URGENCIA;
  if (n === 'urgencia menor') return NivelEmergencia.URGENCIA_MENOR;
  if (n === 'sin urgencia') return NivelEmergencia.SIN_URGENCIA;
  return NaN as any;
}

function parseTA(taStr: string | undefined) {
  if (!taStr) return { s: NaN, d: NaN };
  const [sRaw, dRaw] = taStr.split('/');
  return { s: Number(sRaw), d: Number(dRaw) };
}

function registrarPacientes(dataTable) {
  const data = dataTable.hashes();
  data.forEach((row) => {
    const p = new Paciente(row['nombre'], row['apellido'], row['cuil'], row['obra social']);
    patientRepo.save(p);
  });
}

function listaOrdenadaActual(): Ingreso[] {
  return service.obtenerPendientes();
}

// Hooks
Before((scenario) => {
  patientRepo = new InMemoryPatientRepository(); //no entendi como implementar el mock
  service = new IngresoService(patientRepo as any);
  msgLastError = '';
  countAntesDeIntento = 0;
  console.log(`SCENARIO: ${scenario.pickle.name}`);
});

// Background
Given('que la siguiente enfermera está registrada:', (dataTable) => {
  const row = dataTable.hashes()[0];
  enfermera = new Enfermera(row['Nombre'], row['Apellido']);
});

// Pacientes 
Given('estan registrados los siguientes pacientes:', (dataTable) => {
  registrarPacientes(dataTable);
});
Given('esta registrado el siguiente paciente:', (dataTable) => {
  registrarPacientes(dataTable);
});

// When: ingresos
When('ingresa a urgencias el siguiente paciente:', (dataTable) => {
  const data = dataTable.hashes();
  countAntesDeIntento = listaOrdenadaActual().length;

  data.forEach((row) => {
    try {
      const cuil = row['cuil'];
      const informe = (row['informe'] ?? '').trim();

      const nivelNombre = row['nivel de emergencia'] ?? row['nivelEmergencia'] ?? '';
      const nivel = nivelFromNombre(nivelNombre);

      const temperatura = Number(row['temperatura']);
      const fc = Number(row['frecuencia cardiaca'] ?? row['frecuencia cardíaca'] ?? row['fc']);
      const fr = Number(row['frecuencia respiratoria'] ?? row['fr']);
      const taStr = row['tension arterial'] ?? row['tensión arterial'] ?? row['ta'];
      const { s: presionSistolica, d: presionDiastolica } = parseTA(taStr);

      service.registrarIngreso(
        cuil,
        enfermera,
        informe,
        nivel,
        temperatura,
        fc,
        fr,
        presionSistolica,
        presionDiastolica
      );
    } catch (err: any) {
      msgLastError = err.message;
    }
  });
});

// Then: orden por CUIL
Then('La lista de espera esta ordenada por cuil de la siguiente manera:', (dataTable) => {
  const esperados = dataTable.rows().map((r) => r[0]);
  const actuales = listaOrdenadaActual().map((i: any) => i.CuilPaciente ?? i['CuilPaciente']);
  assert.deepStrictEqual(
    actuales,
    esperados,
    `El orden real (${actuales.join(', ')}) no coincide con el esperado (${esperados.join(', ')})`
  );
});

// Then: errores de campos mandatorios
Then('el sistema muestra un error indicando que falta el campo {string}', (campo: string) => {
  assert.ok(msgLastError, 'No se capturó ningún error');
  const msg = String(msgLastError).toLowerCase();
  const datoNecesario= campo.toLowerCase();
  assert.ok(
    msg.includes(datoNecesario) || (datoNecesario.includes('nivel') && msg.includes('nivel')),
    `Se esperaba que el mensaje contenga "${campo}", pero fue: "${msgLastError}"`
  );
});

// Then: no se registra - comparamos long - se puede refactorizar capaz
Then('el ingreso no se registra', () => {
  const countDespues = listaOrdenadaActual().length;
  assert.strictEqual(countDespues, countAntesDeIntento);
});

// Then: TA inválida
Then('el sistema muestra un error indicando que la tension arterial debe ser positiva', () => {
  assert.ok(msgLastError, 'No se capturó ningún error');
  const msg = String(msgLastError).toLowerCase();
  assert.ok(
    msg.includes('positiv') || msg.includes('mayor') || msg.includes('válid') || msg.includes('valida'),
    `Se esperaba mensaje de TA positiva/valores > 0, pero fue: "${msgLastError}"`
  );
});

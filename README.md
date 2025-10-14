🏥 Módulo de Urgencias — Guardia Médica ISW2025 G2 4K1
<p align="center"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo"/> </p> <p align="center"> <b>Proyecto académico desarrollado con <a href="https://nestjs.com" target="_blank">NestJS</a> + TypeScript.</b><br/> Sistema de registro de admisiones a urgencias hospitalarias con validaciones, orden de prioridad y pruebas BDD automatizadas. </p>
📘 Descripción del Proyecto

Este módulo forma parte de un sistema de Gestión de Guardia Médica, desarrollado en NestJS.
Permite registrar las admisiones de pacientes a urgencias, asignar niveles de emergencia y mantener una lista de espera ordenada según prioridad clínica y fecha de ingreso.

🎯 Objetivo

Facilitar a la enfermería la carga de datos del paciente en el momento del ingreso a urgencias, asegurando:

Validación de campos obligatorios.

Orden correcto de atención según nivel de emergencia.

Registro en memoria de la cola de espera
# Instalar dependencias
```
$ npm install
```

# Modo desarollo
```
$ npm run start:dev
```
# Ejecucion de pruebas BDD (Todas)
```
npm run test:bdd
```
# Ejecucion de pruebas BDD (por tags)
```
npm run test:bdd --tags "@tensionArterialInvalida"
```
# Escenarios implementados
| Escenario (Tag)                         | Descripción                                                                 |
| -------------------------------------- |:---------------------------------------------------------------------------:|
| @ingresoPrimerPaciente                 | Registrar ingreso exitoso del primer paciente. Verifica registro inicial y cola con un solo paciente. |
| @ingresoBajoNivelAltoNivel             | Ingreso de pacientes con distintos niveles de emergencia. Valida el orden según prioridad (Crítica > Emergencia > Sin urgencia). |
| @datoMandatorioOmitido                 | Ingreso de un paciente con dato obligatorio faltante. Muestra error si falta “informe”. |
| @tensionArterialInvalida               | Ingreso de un paciente con tensión arterial inválida. Valida error cuando los valores son negativos. |




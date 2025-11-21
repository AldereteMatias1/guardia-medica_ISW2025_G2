Feature: Modulo de emergencias
  Como enfermera
  Quiero poder registrar las adminisiones de los pacientes a urgencias
  Para determinar que pacientes tienen mayor prioridad de atencion

Background:
  Given que la siguiente enfermera está registrada:
    | Nombre | Apellido | id |
    | susana | gimenez  |  1 |
@ingresoPrimerPaciente
Scenario: Registrar ingreso exitoso del primer paciente
  Given estan registrados los siguientes pacientes:
    | cuil          | nombre | apellido | obra social |
    | 20-41383873-9 | ivan   | ochoa    | mora        |
    | 20-42188853-9 | juan   | perez    | osde        |
  When ingresa a urgencias el siguiente paciente:
    | cuil          | informe               | nivel de emergencia | temperatura | frecuencia cardiaca | frecuencia respiratoria | tension arterial |
    | 20-41383873-9 | tiene dolor de cabeza | Sin urgencia        | 39          | 120                 | 100                     | 120/80           |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
    | cuil          |
    | 20-41383873-9 |
@ingresoBajoNivelAltoNivel
Scenario: Ingreso de pacientes con distinto nivel de emergencia se deben ordenar segun prioridad e ingreso
  Given estan registrados los siguientes pacientes:
    | cuil          | nombre | apellido | obra social       |
    | 20-41383873-9 | ivan   | ochoa    | mora              |
    | 20-42188853-9 | juan   | perez    | osde              |
    | 20-42100053-9 | angel  | borja    | subsidio de salud |
    | 20-32100053-9 | esteban  | quito    | swiss medical |
  When ingresa a urgencias el siguiente paciente:
    | cuil          | informe               | nivel de emergencia | temperatura | frecuencia cardiaca | frecuencia respiratoria | tension arterial |
    | 20-42100053-9 | dolor de ojo          | Sin urgencia        | 39          | 120                 | 100                     | 120/80           |
    | 20-42188853-9 | dolor de espalda      | Critica             | 39          | 120                 | 100                     | 120/80           |
    | 20-41383873-9 | tiene dolor de cabeza | Emergencia          | 39          | 120                 | 100                     | 120/80           |
    | 20-32100053-9 | dolor de pie          | Sin urgencia        | 39          | 120                 | 100                     | 120/80           |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
    | cuil          |
    | 20-42188853-9 |
    | 20-41383873-9 |
    | 20-42100053-9 |
    | 20-32100053-9 |
@datoMandatorioOmitido
Scenario: Ingreso de un paciente con dato mandatorio omitido
  Given esta registrado el siguiente paciente:
    | cuil          | nombre | apellido | obra social |
    | 20-41383873-9 | abel   | lopez    | mora        |
  When ingresa a urgencias el siguiente paciente:
    | cuil          | informe | nivel de emergencia | temperatura | frecuencia cardiaca | frecuencia respiratoria | tension arterial |
    | 20-41383873-9 | | Emergencia          | 38          | 100                 | 25                      | 120/80           |
  Then el sistema muestra un error indicando que falta el campo "informe"
  And el ingreso no se registra

@tensionArterialInvalida
Scenario: Ingreso de un paciente con tension arterial invalida
  Given esta registrado el siguiente paciente:
    | cuil          | nombre | apellido | obra social |
    | 20-41383873-9 | abel   | lopez    | mora        |
  When ingresa a urgencias el siguiente paciente:
    | cuil          | informe | nivel de emergencia | temperatura | frecuencia cardiaca | frecuencia respiratoria | tension arterial |
    | 20-41383873-9 | muerto  | Emergencia          | 38          | 100                 | 25                      | 120/-80          |
  Then el sistema muestra un error indicando que la tension arterial debe ser positiva


Scenario Outline: Ingreso de un paciente con dato mandatorio omitido
  Given esta registrado el siguiente paciente:
    | cuil          | nombre | apellido | obra social |
    | 20-41383873-9 | abel   | lopez    | mora        |
  When ingresa a urgencias el siguiente paciente:
    | cuil          | informe       | nivel de emergencia | temperatura | frecuencia cardiaca | frecuencia respiratoria | tension arterial |
    | 20-41383873-9 | <informe>     | <nivelEmergencia>   | 38          | <fc>                | <fr>                    | <ta>             |
  Then el sistema muestra un error indicando que falta el campo "<campoFaltante>"
  And el ingreso no se registra

  Examples:
    | informe | nivelEmergencia | fc  | fr  | ta      | campoFaltante         |
    |         | Emergencia      | 100 | 25  | 120/80  | informe               |
    | informe |                 | 100 | 25  | 120/80  | nivel de emergencia   |
    | informe | Emergencia      |     | 25  | 120/80  | frecuencia cardiaca   |
    | informe | Emergencia      | 100 |     | 120/80  | frecuencia respiratoria |
    | informe | Emergencia      | 100 | 25  |  120/   | tension arterial      |
    | informe | Emergencia      | 100 | 25  |    /80  | tension arterial      |
    | informe | Emergencia      | 100 | 25  |         | tension arterial      |

Feature: Registrar Paciente
    Como enfermera
    Quiero registrar pacientes 
    Para poder realizar el ingreso a urgencias o buscarlos durante un ingreso en caso de que el paciente aparezca en urgencia más de una vez.

Background:
  Given que la siguiente enfermera está registrada:
    | Nombre | Apellido |
    | mariana | perez  |

Scenario: Registrar paciente de manera exitosa
    Given no hay ningún paciente registrado con el cuil "20-21383873-9"
    When se ingresan:
    | nombre | apellido | cuil | obra social | numero de afiliado | calle | numero | localidad |
    | juan | perez | 20-21383873-9 | mora | 540 | san martin | 123 | San Miguel de Tucuman | 
    Then se muestra un mensaje indicando que el paciente se creo exitosamente

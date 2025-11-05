Feature: Registrar Paciente
    Como enfermera
    Quiero registrar pacientes 
    Para poder realizar el ingreso a urgencias o buscarlos durante un ingreso en caso de que el paciente aparezca en urgencia más de una vez.

Background:
  Given que la siguiente enfermera está registrada:
    | Nombre | Apellido |
    | mariana | perez  |

Scenario: Registrar paciente de manera exitosa con obra social existente
    Given no hay ningún paciente registrado con el cuil "20-21383873-9"
    When se ingresan:
    | nombre | apellido | cuil | obra social | numero de afiliado | calle | numero | localidad |
    | Juan | Perez | 20-12345678-9 | OSDE | 540 | san martin | 123 | San Miguel de Tucuman | 
    Then se muestra un mensaje indicando que el paciente se creo exitosamente

Scenario: Registrar paciente de manera exitosa sin obra social
    Given no hay ningún paciente registrado con el cuil "20-32145678-9"
    When se ingresan:
    | nombre | apellido | cuil | obra social | numero de afiliado | calle | numero | localidad |
    | Miguel | Perez | 20-32145678-9 |  |  | san martin | 123 | San Miguel de Tucuman | 
    Then se muestra un mensaje indicando que el paciente se creo exitosamente

Scenario: Registrar paciente de manera fallida con obra social inexistente
    Given no hay ningún paciente registrado con el cuil "20-32145111-9"
    When se ingresan:
    | nombre | apellido | cuil | obra social | numero de afiliado | calle | numero | localidad |
    | Marcelo | Vargas | 20-32145111-9 | fictica | 123 | san martin | 123 | San Miguel de Tucuman | 
    Then se muestra un mensaje indicando que el paciente no se registro

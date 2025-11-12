export enum RolUsuario {
  MEDICO = 'medico',
  ENFERMERO = 'enfermero',
}

export class Usuario {
  email: string;
  password: string;
  rol: RolUsuario;
}

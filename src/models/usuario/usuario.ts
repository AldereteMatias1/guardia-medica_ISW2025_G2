import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';


export enum RolUsuario {
  MEDICO = 'medico',
  ENFERMERO = 'enfermero',
}

export class Usuario {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @IsEnum(RolUsuario, { message: 'Role must be either medico or enfermero' })
  rol: RolUsuario;
}


import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { RolUsuario } from '../usuario';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @IsEnum(RolUsuario, { message: 'Role must be either medico or enfermero' })
  rol: RolUsuario;
}

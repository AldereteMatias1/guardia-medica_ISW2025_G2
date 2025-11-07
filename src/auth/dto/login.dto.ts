import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';



export class LoginAuthDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({},  { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

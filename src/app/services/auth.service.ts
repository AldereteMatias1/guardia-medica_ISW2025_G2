import { Inject, Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { LoginAuthDto } from '../../auth/dto/login.dto';
import * as usuariosRepository from '../interfaces/usuario/usuarios.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/auth/jwt-payload';
import * as argon2 from 'argon2';
import { comparePassword } from '../../auth/utils/hashing';
import { CreateUserDto } from 'src/models/usuario/dto/create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(usuariosRepository.USUARIO_REPOSITORIO)
    private readonly userRepo: usuariosRepository.IUsuarioRepositorio,

    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    try {
      const hashedPassword = await argon2.hash(user.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
      if(user.password.length < 8) throw new BadRequestException("La contraseña no puede tener menos de 8 digitos")
      const newUser = { ...user, password: hashedPassword };
      this.userRepo.registrarUsuario(newUser);
      return { message: 'Usuario registrado exitosamente', newUser };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async login(credentials: LoginAuthDto) {
    const { email, password} = credentials;

    try {
      const user = this.userRepo.obtenerPorEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario o contraseña inválidos');
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Usuario o contraseña inválidos');
      }

      const payload: JwtPayload = { email: user.email, rol: user.rol };
      const token = await this.createTokens(payload);

      return {
        message: 'Inicio de sesión exitoso',
        token
      };

    } catch (error) {

      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error en login:', error);
      throw new InternalServerErrorException('Ocurrió un error en el servidor');
    }
  }

  private async createTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

}

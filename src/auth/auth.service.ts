import { Inject, Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Usuario } from 'src/models/usuario/usuario';
import { LoginAuthDto } from './dto/login.dto';
import type { UsuarioRepositorio } from '../../src/app/interfaces/usuarios.repository';
import { USUARIO_REPOSITORIO } from '../../src/app/interfaces/usuarios.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../app/interfaces/jwt-payload';
import * as argon2 from 'argon2';
import { comparePassword } from '../../src/auth/utils/hashing';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORIO)
    private readonly userRepo: UsuarioRepositorio,

    private readonly jwtService: JwtService,
  ) {}

  async register(user: Usuario) {
    try {
      const hashedPassword = await argon2.hash(user.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
      const newUser = { ...user, password: hashedPassword };
      this.userRepo.registrarUsuario(newUser);
      return { message: 'Usuario registrado exitosamente', newUser };
    } catch (err) {
      throw new Error(err.message);
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
        user,
        token,
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

  async getAllUsers() {
    return this.userRepo.obtenerTodos();
  }
}

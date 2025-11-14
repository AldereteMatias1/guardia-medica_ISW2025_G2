import { Inject, Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { LoginAuthDto } from '../../auth/dto/login.dto';
import * as usuariosRepository from '../interfaces/usuario/usuarios.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/auth/jwt-payload';
import * as argon2 from 'argon2';
import { comparePassword } from '../../auth/utils/hashing';
import { CreateUserDto } from '../../../src/models/usuario/dto/create.user.dto';
import { RolUsuario, Usuario } from '../../models/usuario/usuario';
import * as enfermeraRepository from '../interfaces/enfemera/enfermera.repository';
import * as medicoRepository from '../interfaces/medico/medico.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(usuariosRepository.USUARIO_REPOSITORIO)
    private readonly userRepo: usuariosRepository.IUsuarioRepositorio,

    @Inject(enfermeraRepository.ENFERMERO_REPOSITORIO)
    private readonly enfermeroRepo: enfermeraRepository.IEnfermeroRepositorio,

    @Inject(medicoRepository.MEDICO_REPOSITORIO)
    private readonly medicoRepo: medicoRepository.IMedicoRepositorio,

    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
  const { email, password, rol, medicoId, enfermeraId } = user;

  if (!password || password.length < 8) {
    throw new BadRequestException('La contraseña no puede tener menos de 8 digitos');
  }

  const usuarioExistente = await this.userRepo.obtenerPorEmail(email);
  if (usuarioExistente) {
    throw new BadRequestException('El email ya está registrado');
  }

  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const usuarioParaGuardar: Usuario = {
        email,
        password: hashedPassword,
        rol,
      };

    await this.userRepo.registrarUsuario(usuarioParaGuardar);

    if (rol === RolUsuario.ENFERMERO) {
      if (enfermeraId == null) {
        throw new BadRequestException('Debe indicar el id de la enfermera a asociar');
      }

      const enfermera = await this.enfermeroRepo.obtenerPorId(enfermeraId);
      if (!enfermera) {
        throw new BadRequestException('No existe una enfermera con ese id');
      }

      enfermera.asociarUsuario(usuarioParaGuardar);          
      await this.enfermeroRepo.actualizarEnfermera(enfermera);
    }

    if (rol === RolUsuario.MEDICO) {
      if (medicoId == null) {
        throw new BadRequestException('Debe indicar el id del médico a asociar');
      }

      const medico = await this.medicoRepo.obtenerPorId(medicoId);
      if (!medico) {
        throw new BadRequestException('No existe un médico con ese id');
      }

      medico.asociarUsuario(usuarioParaGuardar);             
      await this.medicoRepo.actualizarMedico(medico);
    }

    return {
      message: 'Usuario registrado exitosamente',
      newUser: usuarioParaGuardar,
    };

  } catch (err) {
    if (err instanceof BadRequestException) throw err;
    throw new BadRequestException('Ocurrió un error al registrar el usuario');
  }
}

  async login(credentials: LoginAuthDto) {
    const { email, password} = credentials;

    try {
      const user = await this.userRepo.obtenerPorEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario o contraseña inválidos');
      }
      const isValid = await comparePassword(password, user.password !== undefined ? user.password: "");
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

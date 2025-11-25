import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginAuthDto } from '../../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { comparePassword } from '../../auth/utils/hashing';
import * as enfermeraRepository from '../../persistence/enfermero/enfermera.repository.interface';
import * as medicoRepository from '../../persistence/medico/medico.repository.interface';
import * as usuariosRepositoryInterface from '../../../src/persistence/usuario/usuarios.repository.interface';
import { CreateUserDto } from '../../../src/business/usuario/dto/create.user.dto';
import { RolUsuario, Usuario } from '../../../src/business/usuario/usuario';
import { JwtPayload } from '../utils/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(usuariosRepositoryInterface.USUARIO_REPOSITORIO)
    private readonly userRepo: usuariosRepositoryInterface.IUsuarioRepositorio,

    @Inject(enfermeraRepository.ENFERMERO_REPOSITORIO)
    private readonly enfermeroRepo: enfermeraRepository.IEnfermeroRepositorio,

    @Inject(medicoRepository.MEDICO_REPOSITORIO)
    private readonly medicoRepo: medicoRepository.IMedicoRepositorio,

    private readonly jwtService: JwtService,
  ) {}

  async register(user: CreateUserDto) {
    const { email, password, rol, medicoId, enfermeraId } = user;

    if (!password || password.length < 8) {
      throw new BadRequestException(
        'La contraseña no puede tener menos de 8 digitos',
      );
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
      const user = await this.userRepo.obtenerPorEmail(email);

      if (!user) {
        throw new InternalServerErrorException(
          'Error al obtener el usuario recién registrado',
        );
      }
      const usuarioRegistrado = user as Usuario;

      if (rol === RolUsuario.ENFERMERO) {
        if (enfermeraId == null) {
          throw new BadRequestException(
            'Debe indicar el id de la enfermera a asociar',
          );
        }

        const enfermera = await this.enfermeroRepo.obtenerPorId(enfermeraId);
        if (!enfermera) {
          throw new BadRequestException('No existe una enfermera con ese id');
        }

        enfermera.asociarUsuario(user);
        await this.enfermeroRepo.asociarUsuarioEnfermera(enfermeraId, user.id!);
      }

      if (rol === RolUsuario.MEDICO) {
        if (medicoId == null) {
          throw new BadRequestException(
            'Debe indicar el id del médico a asociar',
          );
        }

        const medico = await this.medicoRepo.obtenerPorId(medicoId);
        if (!medico) {
          throw new BadRequestException('No existe un médico con ese id');
        }

        medico.asociarUsuario(usuarioRegistrado);
        await this.medicoRepo.asociarUsuarioMedico(
          medicoId,
          usuarioRegistrado.id!,
        );
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
    const { email, password } = credentials;

    try {
      const user = await this.userRepo.obtenerPorEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario o contraseña inválidos');
      }
      const isValid = await comparePassword(
        password,
        user.password !== undefined ? user.password : '',
      );
      if (!isValid) {
        throw new UnauthorizedException('Usuario o contraseña inválidos');
      }

      let idProfesional = 0;
      const rolNormalizado = user.rol?.toString().toLowerCase();

      
      if (rolNormalizado === RolUsuario.MEDICO.toLowerCase()) {
        const medico = await this.medicoRepo.obtenerPorEmail(user.email);

        if (!medico) {
          throw new UnauthorizedException(
            'No existe un médico asociado a este usuario',
          );
        }

        idProfesional = medico.getId();

      } else if (rolNormalizado === RolUsuario.ENFERMERO.toLowerCase()) {
        const enfermero = await this.enfermeroRepo.obtenerPorEmail(user.email);

        if (!enfermero) {
          throw new UnauthorizedException(
            'No existe un enfermero asociado a este usuario',
          );
        }
        console.log('Enfermero encontrado:', enfermero.getId());

        idProfesional = enfermero.getId();
      }

      const payload: JwtPayload = {
        email: user.email,
        rol: user.rol,
        idProfesional,
      };
      const token = await this.createTokens(payload);

      return {
        message: 'Inicio de sesión exitoso',
        token,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
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

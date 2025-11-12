import { JwtService } from '@nestjs/jwt';

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));
jest.mock('../../src/auth/utils/hashing', () => ({
  comparePassword: jest.fn(),
}));

import * as argon2 from 'argon2';
import { IUsuarioRepositorio } from '../../src/app/interfaces/usuario/usuarios.repository';
import { AuthService } from '../../src/app/services/auth.service';
import { RolUsuario } from '../../src/models/usuario/usuario';
import { BadRequestException } from '@nestjs/common';

let service: AuthService;

const userRepoMock: jest.Mocked<IUsuarioRepositorio> = {
  registrarUsuario: jest.fn(),
  obtenerPorEmail: jest.fn(),
} as any;

const jwtServiceMock: jest.Mocked<JwtService> = {
  signAsync: jest.fn(),
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  service = new AuthService(userRepoMock, jwtServiceMock);
});

describe('register', () => {
  it('Registrar usuario exitosamente', async () => {
    // arrange
    const dto = {
      email: 'nuevo@correo.com',
      password: 'Secreta123',
      rol: RolUsuario.ENFERMERO,
    };
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');
    userRepoMock.registrarUsuario.mockImplementation((u) => u);

    // act
    const res = await service.register(dto as any);

    // assert
    expect(argon2.hash).toHaveBeenCalledWith(dto.password, expect.any(Object));
    expect(userRepoMock.registrarUsuario).toHaveBeenCalledWith({
      ...dto,
      password: 'HASHED_ARGON2',
    });
    expect(res).toEqual({
      message: 'Usuario registrado exitosamente',
      newUser: { ...dto, password: 'HASHED_ARGON2' },
    });
  });

  it('debe lanzar error si el email ya está registrado', async () => {
    // arrange
    const dto = {
      email: 'duplicado@correo.com',
      password: 'Secreta123',
      rol: RolUsuario.MEDICO,
    };
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');

    userRepoMock.registrarUsuario.mockImplementation(() => {
      throw new BadRequestException('El email ya está registrado');
    });

    // act + assert
    await expect(service.register(dto as any)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.register(dto as any)).rejects.toThrow(
      'El email ya está registrado',
    );
  });

  it('debe lanzar error si la contraseña tiene menos de 8 caracteres', async () => {
    // arrange
    const dto = {
      email: 'shortpass@correo.com',
      password: '12345',
      rol: RolUsuario.MEDICO,
    };
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');

    // act + assert
    await expect(service.register(dto as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.register(dto as any)).rejects.toThrow(
      'La contraseña no puede tener menos de 8 digitos',
    );
  });
});

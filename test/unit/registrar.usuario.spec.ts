import { JwtService } from '@nestjs/jwt';

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));
jest.mock('../../src/auth/utils/hashing', () => ({
  comparePassword: jest.fn(),
}));

import * as argon2 from 'argon2';
import { IUsuarioRepositorio } from '../../src/app/interfaces/usuario/usuarios.repository.interface';
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

const enfermeroRepoMock = {
  obtenerPorEmail: jest.fn(),
  obtenerPorId: jest.fn(),
  actualizarEnfermera: jest.fn(),
  asociarUsuarioEnfermera: jest.fn(),
};

const medicoRepoMock = {
  obtenerPorEmail: jest.fn(),
  obtenerPorId: jest.fn(),
  actualizarMedico: jest.fn(),
  asociarUsuarioMedico: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  service = new AuthService(
    userRepoMock,
    enfermeroRepoMock,
    medicoRepoMock,
    jwtServiceMock,
  );
});

describe('AuthService - register', () => {
  it('Registrar usuario ENFERMERO y asociarlo a la enfermera por id', async () => {
    // arrange
    const dto = {
      email: 'nuevo@correo.com',
      password: 'Secreta123',
      rol: RolUsuario.ENFERMERO,
      enfermeraId: 10,
    };

    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');

    userRepoMock.obtenerPorEmail
      .mockResolvedValueOnce(null) // primera vez: verificar si existe
      .mockResolvedValueOnce({
        // segunda vez: usuario recién creado
        id: 999,
        email: dto.email,
        password: 'HASHED_ARGON2',
        rol: dto.rol,
      });
    userRepoMock.registrarUsuario.mockResolvedValue({
      id: 999,
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    });

    const enfermeraFake = {
      asociarUsuario: jest.fn(),
    };

    enfermeroRepoMock.obtenerPorId.mockResolvedValue(enfermeraFake as any);
    enfermeroRepoMock.asociarUsuarioEnfermera.mockResolvedValue(undefined);

    userRepoMock.registrarUsuario.mockResolvedValue(undefined as any);

    const expectedSavedUser = {
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    };

    // act
    const res = await service.register(dto as any);

    // assert
    expect(userRepoMock.obtenerPorEmail).toHaveBeenNthCalledWith(1, dto.email);
    expect(argon2.hash).toHaveBeenCalledWith(dto.password, expect.any(Object));
    expect(userRepoMock.registrarUsuario).toHaveBeenCalledWith(
      expectedSavedUser,
    );

    expect(userRepoMock.obtenerPorEmail).toHaveBeenNthCalledWith(2, dto.email);
    expect(enfermeroRepoMock.obtenerPorId).toHaveBeenCalledWith(
      dto.enfermeraId,
    );
    expect(enfermeraFake.asociarUsuario).toHaveBeenCalledWith({
      id: 999,
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    });

    expect(enfermeroRepoMock.asociarUsuarioEnfermera).toHaveBeenCalledWith(
      dto.enfermeraId,
      999,
    );

    expect(res).toEqual({
      message: 'Usuario registrado exitosamente',
      newUser: expectedSavedUser,
    });
  });

  it('Registrar usuario MEDICO y asociarlo al médico por id', async () => {
    // arrange
    const dto = {
      email: 'nuevo@correo.com',
      password: 'Secreta123',
      rol: RolUsuario.MEDICO,
      medicoId: 55,
    };

    // mock hash
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');

    // mock usuario NO existe al inicio
    userRepoMock.obtenerPorEmail
      .mockResolvedValueOnce(null) // primera vez: verificar si existe
      .mockResolvedValueOnce({
        // segunda vez: usuario recién creado
        id: 999,
        email: dto.email,
        password: 'HASHED_ARGON2',
        rol: dto.rol,
      });

    // mock registro OK
    // return the created Usuario instead of undefined
    userRepoMock.registrarUsuario.mockResolvedValue({
      id: 999,
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    });
    // ...existing code...
    const medicoFake = {
      asociarUsuario: jest.fn(),
    };

    // mock médico OK
    medicoRepoMock.obtenerPorId.mockResolvedValue(medicoFake as any);

    // mock asociación en tabla pivote
    medicoRepoMock.asociarUsuarioMedico.mockResolvedValue(undefined);

    const expectedSavedUser = {
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    };

    // act
    const res = await service.register(dto as any);

    // assert
    expect(userRepoMock.obtenerPorEmail).toHaveBeenNthCalledWith(1, dto.email);
    expect(argon2.hash).toHaveBeenCalledWith(dto.password, expect.any(Object));
    expect(userRepoMock.registrarUsuario).toHaveBeenCalledWith(
      expectedSavedUser,
    );

    // obtiene el usuario recién registrado
    expect(userRepoMock.obtenerPorEmail).toHaveBeenNthCalledWith(2, dto.email);

    // médico
    expect(medicoRepoMock.obtenerPorId).toHaveBeenCalledWith(dto.medicoId);

    // asociación a la entidad de dominio
    expect(medicoFake.asociarUsuario).toHaveBeenCalledWith({
      id: 999,
      email: dto.email,
      password: 'HASHED_ARGON2',
      rol: dto.rol,
    });

    // asociación en la base de datos
    expect(medicoRepoMock.asociarUsuarioMedico).toHaveBeenCalledWith(
      dto.medicoId,
      999,
    );

    expect(res).toEqual({
      message: 'Usuario registrado exitosamente',
      newUser: expectedSavedUser,
    });
  });

  it('debe lanzar error si el email ya está registrado', async () => {
    // arrange
    const dto = {
      email: 'duplicado@correo.com',
      password: 'Secreta123',
      rol: RolUsuario.MEDICO,
      medicoId: 10,
    };

    userRepoMock.obtenerPorEmail.mockResolvedValue({
      email: dto.email,
      password: 'HASH',
      rol: dto.rol,
    });

    // act
    const promise = service.register(dto as any);

    // assert
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    await expect(promise).rejects.toThrow('El email ya está registrado');

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(dto.email);

    expect(argon2.hash).not.toHaveBeenCalled();
    expect(medicoRepoMock.obtenerPorId).not.toHaveBeenCalled();
    expect(medicoRepoMock.actualizarMedico).not.toHaveBeenCalled();
    expect(userRepoMock.registrarUsuario).not.toHaveBeenCalled();
  });

  it('debe lanzar error si la contraseña tiene menos de 8 caracteres', async () => {
    // arrange
    const dto = {
      email: 'short@correo.com',
      password: '12345',
      rol: RolUsuario.MEDICO,
      medicoId: 20,
    };

    // act
    const promise = service.register(dto as any);

    // assert
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    await expect(promise).rejects.toThrow(
      'La contraseña no puede tener menos de 8 digitos',
    );

    expect(userRepoMock.obtenerPorEmail).not.toHaveBeenCalled();
    expect(argon2.hash).not.toHaveBeenCalled();

    expect(medicoRepoMock.obtenerPorId).not.toHaveBeenCalled();
    expect(medicoRepoMock.actualizarMedico).not.toHaveBeenCalled();

    expect(userRepoMock.registrarUsuario).not.toHaveBeenCalled();
  });
});

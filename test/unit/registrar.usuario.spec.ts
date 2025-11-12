
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

  const enfermeroRepoMock = {
  obtenerPorEmail: jest.fn(),
  actualizarEnfermera: jest.fn(),
};

const medicoRepoMock = {
  obtenerPorEmail: jest.fn(),
  actualizarMedico: jest.fn(),
};

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(userRepoMock, enfermeroRepoMock, medicoRepoMock, jwtServiceMock);
  });


  describe('AuthService - register', () => {

  it('Registrar usuario ENFERMERO exitosamente y asociarlo a la enfermera', async () => {
    const dto = { email: 'nuevo@correo.com', password: 'Secreta123', rol: RolUsuario.ENFERMERO };

    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_ARGON2');
    userRepoMock.obtenerPorEmail.mockReturnValue(undefined);

    const enfermeraFake = {
      asociarUsuario: jest.fn(),
    };
    enfermeroRepoMock.obtenerPorEmail.mockReturnValue(enfermeraFake);

    userRepoMock.registrarUsuario.mockImplementation((u) => u);

    const res = await service.register(dto as any);

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(dto.email);
    expect(argon2.hash).toHaveBeenCalledWith(dto.password, expect.any(Object));
    expect(userRepoMock.registrarUsuario).toHaveBeenCalledWith({
      ...dto,
      password: 'HASHED_ARGON2',
    });

    expect(enfermeroRepoMock.obtenerPorEmail).toHaveBeenCalledWith(dto.email);
    expect(enfermeraFake.asociarUsuario).toHaveBeenCalledWith({
      ...dto,
      password: 'HASHED_ARGON2',
    });
    expect(enfermeroRepoMock.actualizarEnfermera).toHaveBeenCalledWith(enfermeraFake);

    expect(res).toEqual({
      message: 'Usuario registrado exitosamente',
      newUser: { ...dto, password: 'HASHED_ARGON2' },
    });
  });

  it('debe lanzar error si la contraseña tiene menos de 8 caracteres', async () => {
    // arrange
    const dto = { email: 'shortpass@correo.com', password: '12345', rol: RolUsuario.MEDICO };

    // act
    const promise = service.register(dto as any);

    // assert
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
    await expect(promise).rejects.toThrow('La contraseña no puede tener menos de 8 digitos');

    expect(argon2.hash).not.toHaveBeenCalled();
    expect(userRepoMock.obtenerPorEmail).not.toHaveBeenCalled();
    expect(userRepoMock.registrarUsuario).not.toHaveBeenCalled();
  });

});


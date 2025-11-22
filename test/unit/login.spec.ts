import { JwtService } from '@nestjs/jwt';
import { IUsuarioRepositorio } from '../../src/app/interfaces/usuario/usuarios.repository.interface';
import { AuthService } from '../../src/app/services/auth.service';
import { comparePassword } from '../../src/auth/utils/hashing';
import { RolUsuario } from '../../src/models/usuario/usuario';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  errorSpy.mockRestore();
});

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));
jest.mock('../../src/auth/utils/hashing', () => ({
  comparePassword: jest.fn(),
}));

const makeUser = (
  overrides: Partial<{ email: string; password: string; rol: RolUsuario }> = {},
) => ({
  email: overrides.email ?? 'test@correo.com',
  password: overrides.password ?? 'Hashed_Pass_123',
  rol: overrides.rol ?? RolUsuario.MEDICO,
});

let service: AuthService;

const userRepoMock: jest.Mocked<IUsuarioRepositorio> = {
  registrarUsuario: jest.fn(),
  obtenerPorEmail: jest.fn(),
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

const jwtServiceMock: jest.Mocked<JwtService> = {
  signAsync: jest.fn(),
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  service = new AuthService(
    userRepoMock,
    enfermeroRepoMock,
    medicoRepoMock,
    jwtServiceMock,
  );
});

describe('login', () => {
  it('Loguearse exitosamente en el sistema', async () => {
    const stored = makeUser({
      email: 'test@correo.com',
      password: 'HASHED',
      rol: RolUsuario.MEDICO,
    });

    // Usuario encontrado en la DB
    userRepoMock.obtenerPorEmail.mockResolvedValue(stored as any);

    // Contraseña válida
    (comparePassword as jest.Mock).mockResolvedValue(true);

    // Mock del médico devuelto por repo
    const medicoFake = {
      getId: jest.fn().mockReturnValue(55),
    };
    medicoRepoMock.obtenerPorEmail.mockResolvedValue(medicoFake as any);

    // JWT generado
    jwtServiceMock.signAsync.mockResolvedValue('ACCESS_TOKEN_123');

    const res = await service.login({
      email: stored.email,
      password: 'Plano123',
    } as any);

    // --- ASSERTS ---

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(stored.email);
    expect(comparePassword).toHaveBeenCalledWith('Plano123', 'HASHED');

    expect(medicoRepoMock.obtenerPorEmail).toHaveBeenCalledWith(stored.email);
    expect(medicoFake.getId).toHaveBeenCalled();

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      email: stored.email,
      rol: stored.rol,
      idProfesional: 55,
    });

    expect(res).toEqual({
      message: 'Inicio de sesión exitoso',
      token: { accessToken: 'ACCESS_TOKEN_123' },
    });
  });

  it('debe lanzar Unauthorized si el usuario no existe', async () => {
    userRepoMock.obtenerPorEmail.mockResolvedValue(null); // 👈 ahora null en Promise

    await expect(
      service.login({ email: 'noexiste@correo.com', password: 'x' } as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(
      'noexiste@correo.com',
    );
  });

  it('debe lanzar Unauthorized si la contraseña no coincide', async () => {
    const stored = makeUser({ email: 'test@correo.com', password: 'HASHED' });
    userRepoMock.obtenerPorEmail.mockResolvedValue(stored as any);
    (comparePassword as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: stored.email, password: 'malapass' } as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(stored.email);
    expect(comparePassword).toHaveBeenCalledWith('malapass', 'HASHED');
  });

  it('debe lanzar InternalServerError si ocurre un error inesperado', async () => {
    userRepoMock.obtenerPorEmail.mockRejectedValue(
      new Error('Fallo inesperado'),
    );
    medicoRepoMock.obtenerPorEmail.mockResolvedValue(null);


    await expect(
      service.login({ email: 'test@correo.com', password: 'x' } as any),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(
      'test@correo.com',
    );
    expect(errorSpy).toHaveBeenCalled(); // opcional si querés validar el console.error
  });
});

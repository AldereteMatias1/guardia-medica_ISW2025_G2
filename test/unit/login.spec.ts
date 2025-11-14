import { JwtService } from "@nestjs/jwt";
import { IUsuarioRepositorio } from "../../src/app/interfaces/usuario/usuarios.repository.interface";
import { AuthService } from "../../src/app/services/auth.service";
import { comparePassword } from "../../src/auth/utils/hashing";
import { RolUsuario } from "../../src/models/usuario/usuario";
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';


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

const makeUser = (overrides: Partial<{ email: string; password: string; rol: RolUsuario }> = {}) => ({
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
};

  const medicoRepoMock = {
    obtenerPorEmail: jest.fn(),
    obtenerPorId: jest.fn(),
    actualizarMedico: jest.fn(),
  };

  const jwtServiceMock: jest.Mocked<JwtService> = {
    signAsync: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(userRepoMock, enfermeroRepoMock , medicoRepoMock, jwtServiceMock);
  });



describe('login', () => {
    it('Loguearse exitosamente en el sistema', async () => {
      const stored = makeUser({ email: 'test@correo.com', password: 'HASHED' });
      userRepoMock.obtenerPorEmail.mockReturnValue(stored); // síncrono, como en tu servicio
      (comparePassword as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.signAsync.mockResolvedValue('ACCESS_TOKEN_123');

      const res = await service.login({ email: stored.email, password: 'Plano123' } as any);

      expect(userRepoMock.obtenerPorEmail).toHaveBeenCalledWith(stored.email);
      expect(comparePassword).toHaveBeenCalledWith('Plano123', 'HASHED');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ email: stored.email, rol: stored.rol });

      expect(res).toEqual({
        message: 'Inicio de sesión exitoso',
        token: { accessToken: 'ACCESS_TOKEN_123' },
      });
    });

    it('debe lanzar Unauthorized si el usuario no existe', async () => {
      userRepoMock.obtenerPorEmail.mockReturnValue(undefined);

      await expect(
        service.login({ email: 'noexiste@correo.com', password: 'x' } as any),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('debe lanzar Unauthorized si la contraseña no coincide', async () => {
      const stored = makeUser({ email: 'test@correo.com', password: 'HASHED' });
      userRepoMock.obtenerPorEmail.mockReturnValue(stored);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: stored.email, password: 'malapass' } as any),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('debe lanzar InternalServerError si ocurre un error inesperado', async () => {
      
      userRepoMock.obtenerPorEmail.mockImplementation(() => {
        throw new Error('Fallo inesperado');
      });

      await expect(
        service.login({ email: 'test@correo.com', password: 'x' } as any),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
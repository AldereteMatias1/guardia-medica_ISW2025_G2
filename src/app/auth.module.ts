import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/auth.controller';
import JwtModuleConfig from '../../src/config/jwt-config';
import { ENFERMERO_REPOSITORIO } from '../../src/persistence/enfermero/enfermera.repository.interface';
import { MEDICO_REPOSITORIO } from '../../src/persistence/medico/medico.repository.interface';
import { AuthService } from '../../src/auth/service/auth.service';
import { USUARIO_REPOSITORIO } from '../../src/persistence/usuario/usuarios.repository.interface';
import { UsuarioRepositorio } from '../../src/persistence/usuario/usuario.repository';
import { EnfermeroRepositorio } from '../../src/persistence/enfermero/enfermero.repository';
import { MedicoRepositorio } from '../../src/persistence/medico/medico.repository';

@Module({
  imports: [JwtModuleConfig()],
  providers: [
    AuthService,
    {
      provide: USUARIO_REPOSITORIO,
      useClass: UsuarioRepositorio,
    },
    {
      provide: ENFERMERO_REPOSITORIO,
      useClass: EnfermeroRepositorio
    },
    {
      provide: MEDICO_REPOSITORIO,
      useClass: MedicoRepositorio
    }
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

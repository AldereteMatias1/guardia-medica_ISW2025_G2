import { Module } from '@nestjs/common';
import { AuthService } from '../app/services/auth.service';
import { USUARIO_REPOSITORIO } from 'src/app/interfaces/usuario/usuarios.repository.interface';
import { AuthController } from '../presentation/auth.controller';
import JwtModuleConfig from 'src/config/jwt-config';
import { UsuarioRepositorio } from 'src/persistence/usuario.repository';
import { ENFERMERO_REPOSITORIO } from 'src/app/interfaces/enfemera/enfermera.repository';
import { EnfermeroRepositorio } from 'src/persistence/enfermero.repository';
import { MEDICO_REPOSITORIO } from 'src/app/interfaces/medico/medico.repository';
import { MedicoRepositorio } from 'src/persistence/medico.repository';

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

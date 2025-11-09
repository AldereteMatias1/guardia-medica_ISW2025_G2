import { Module } from '@nestjs/common';
import { AuthService } from '../app/services/auth.service';
import { USUARIO_REPOSITORIO } from 'src/app/interfaces/usuario/usuarios.repository';
import { AuthController } from '../presentation/auth.controller';
import JwtModuleConfig from 'src/config/jwt-config';
import { UsuarioRepositorio } from 'src/persistence/usuario.repository';

@Module({
  imports: [JwtModuleConfig()],
  providers: [
    AuthService,
    {
      provide: USUARIO_REPOSITORIO,
      useClass: UsuarioRepositorio,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

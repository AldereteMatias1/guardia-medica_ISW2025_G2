import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USUARIO_REPOSITORIO } from 'src/app/interfaces/usuarios.repository';
import { DatabaseUsersInMemory } from 'test/mock/database.memory.users';
import { AuthController } from './auth.controller';
import JwtModuleConfig from 'src/config/jwt-config';

@Module({
  imports: [JwtModuleConfig()],
  providers: [
    AuthService,
    {
      provide: USUARIO_REPOSITORIO,
      useClass: DatabaseUsersInMemory,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

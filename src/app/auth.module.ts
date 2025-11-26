import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/auth.controller';
import JwtModuleConfig from '../auth/utils/jwt-config';
import { ENFERMERO_REPOSITORIO } from '../../src/persistence/enfermero/enfermera.repository.interface';
import { MEDICO_REPOSITORIO } from '../../src/persistence/medico/medico.repository.interface';
import { AuthService } from '../../src/auth/service/auth.service';
import { USUARIO_REPOSITORIO } from '../../src/persistence/usuario/usuarios.repository.interface';
import { UsuarioRepositorio } from '../../src/persistence/usuario/usuario.repository';
import { EnfermeroRepositorio } from '../../src/persistence/enfermero/enfermero.repository';
import { MedicoRepositorio } from '../../src/persistence/medico/medico.repository';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import { JwtStrategy } from '../../src/auth/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModuleConfig()],
  providers: [
    AuthService,
    JwtStrategy,  
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
    },
    {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { REPOSITORIO_OBRA_SOCIAL } from '../persistence/obra-social/obra.social.repository.interface';
import { OBRA_SOCIAL_SERVICIO } from '../business/obra-social/service/obra.socia.service.interface';
import { ObraSocialController } from '../presentation/obra.social.controller';
import { DatabaseModule } from './database.module';
import { ObraSocialRepositorio } from '../../src/persistence/obra-social/obra.social.repository';
import { ObraSocialServicio } from '../../src/business/obra-social/service/obra.social.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ObraSocialController],
    providers: [
        {
          provide: REPOSITORIO_OBRA_SOCIAL, 
          useClass: ObraSocialRepositorio,
        },
        {
          provide: OBRA_SOCIAL_SERVICIO, 
          useClass: ObraSocialServicio,
        }
      ],
      exports: [REPOSITORIO_OBRA_SOCIAL, OBRA_SOCIAL_SERVICIO],
})
export class ObraSocialModule {}

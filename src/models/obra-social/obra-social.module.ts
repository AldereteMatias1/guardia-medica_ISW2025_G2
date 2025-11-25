import { Module } from '@nestjs/common';
import { REPOSITORIO_OBRA_SOCIAL } from '../../persistence/obra-social/obra.social.repository.interface';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { ObraSocialRepositorio } from '../../../src/persistence/obra.social.repository';
import { OBRA_SOCIAL_SERVICIO } from '../../../src/app/interfaces/obraSocial/obra.socia.service.interface';
import { ObraSocialServicio } from '../../../src/app/services/obra.social.service';
import { ObraSocialController } from '../../../src/presentation/obra.social.controller';

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

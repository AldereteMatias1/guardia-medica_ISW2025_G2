import { Module } from '@nestjs/common';
import { REPOSITORIO_OBRA_SOCIAL } from '../../../src/app/interfaces/obraSocial/obra.social.repository';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { ObraSocialRepositorio } from '../../../src/persistence/obra.social.repository';

@Module({
    imports: [DatabaseModule],
    providers: [
        {
          provide: REPOSITORIO_OBRA_SOCIAL, 
          useClass: ObraSocialRepositorio,
        }
      ],
      exports: [REPOSITORIO_OBRA_SOCIAL],
})
export class ObraSocialModule {}

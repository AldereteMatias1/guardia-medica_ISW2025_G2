import { Module } from '@nestjs/common';
import { REPOSITORIO_OBRA_SOCIAL } from 'src/app/interfaces/obra.social.repository';
import { ObraSocialRepositorio } from 'src/persistence/obra.social.repository';

@Module({
    providers: [
        {
          provide: REPOSITORIO_OBRA_SOCIAL, 
          useClass: ObraSocialRepositorio,
        }
      ],
      exports: [REPOSITORIO_OBRA_SOCIAL],
})
export class ObraSocialModule {}

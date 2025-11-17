import { Module } from '@nestjs/common';
import { ENFERMERO_REPOSITORIO } from '../../../src/app/interfaces/enfemera/enfermera.repository';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { EnfermeroRepositorio } from '../../../src/persistence/enfermero.repository';

@Module({
    imports: [DatabaseModule],
        providers: [
            {
              provide: ENFERMERO_REPOSITORIO, 
              useClass: EnfermeroRepositorio,
            }
          ],
          exports: [ENFERMERO_REPOSITORIO],
})
export class EnfermeraModule {}

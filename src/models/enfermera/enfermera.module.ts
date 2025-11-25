import { Module } from '@nestjs/common';
import { ENFERMERO_REPOSITORIO } from '../../persistence/enfermero/enfermera.repository.interface';
import { DatabaseModule } from '../../../src/config/database/database.module';
import { EnfermeroRepositorio } from '../../../src/persistence/enfermero.repository';
import { SERVICIO_ENFERMERO } from '../../../src/app/interfaces/enfemera/enfermera.service.interface';
import { ServicioEnfermero } from '../../../src/app/services/enfermero.service';

@Module({
    imports: [DatabaseModule],
        providers: [
            {
              provide: ENFERMERO_REPOSITORIO, 
              useClass: EnfermeroRepositorio,
            },
             {
              provide: SERVICIO_ENFERMERO, 
              useClass: ServicioEnfermero,
            }
          ],
          exports: [ENFERMERO_REPOSITORIO, SERVICIO_ENFERMERO],
})
export class EnfermeraModule {}

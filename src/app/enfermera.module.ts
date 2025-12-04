import { Module } from '@nestjs/common';
import { ENFERMERO_REPOSITORIO } from '../persistence/enfermero/enfermera.repository.interface';
import { SERVICIO_ENFERMERO } from '../business/enfermera/service/enfermera.service.interface';
import { DatabaseModule } from './database.module';
import { EnfermeroRepositorio } from '../../src/persistence/enfermero/enfermero.repository';
import { ServicioEnfermero } from '../../src/business/enfermera/service/enfermero.service';
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

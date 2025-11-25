import { Module } from "@nestjs/common";
import { MEDICO_REPOSITORIO } from "../../persistence/medico/medico.repository.interface";
import { DatabaseModule } from "../../../src/config/database/database.module";
import { MedicoRepositorio } from "../../../src/persistence/medico.repository";

@Module({
    imports: [DatabaseModule],
    providers: [
        {
          provide: MEDICO_REPOSITORIO, 
          useClass: MedicoRepositorio,
        }
      ],
      exports: [MEDICO_REPOSITORIO],
})
export class MedicoModule {}
import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { MEDICO_REPOSITORIO } from "../../src/persistence/medico/medico.repository.interface";
import { MedicoRepositorio } from "../../src/persistence/medico/medico.repository";

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
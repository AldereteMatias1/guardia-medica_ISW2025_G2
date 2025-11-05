import { IObraSocial } from "../../src/app/interfaces/obra.social.repository";
import { Afiliado } from "../../src/models/afiliado/afiliado.entities";
import { ObraSocial } from "../../src/models/obra-social/obra-social.entity";
import { Paciente } from "../../src/models/paciente/paciente";

export class DataBaseObraSocialInMemory implements  IObraSocial {

     public obrasSociales: ObraSocial[] = [
        { id: "4b9b7aff-934d-43a4-8ca2-db599599330e", nombre: "OSDE", afiliados: [] },
        { id: "7803d1b6-e0aa-44fe-b90e-8d7d713e673e", nombre: "SWISS MEDICAL", afiliados: [] },
        { id: "d72ed5ce-6187-443e-a105-4fee3ead3d53", nombre: "GALENO", afiliados: [] }
    ];

    public pacientes: Paciente[] = [
        new Paciente("Juan", "Perez", "20-12345678-9", "OSDE"),
        new Paciente("Maria", "Gomez", "27-87654321-0", "SWISS MEDICAL"),
        new Paciente("Carlos", "Lopez", "23-11223344-5", "GALENO")
    ];

    public afiliados: Afiliado[] = [
        {
            numeroAfiliado: 540,
            obraSocial: this.obrasSociales[0], 
            paciente: this.pacientes[0] 
        },
        {
            numeroAfiliado: 67890,
            obraSocial: this.obrasSociales[1], 
            paciente: this.pacientes[1] 
        },
        {
            numeroAfiliado: 54321,
            obraSocial: this.obrasSociales[2],
            paciente: this.pacientes[2] 
        }
    ];

    constructor() {
        this.obrasSociales[0].afiliados = [this.afiliados[0]];
        this.obrasSociales[1].afiliados = [this.afiliados[1]];
        this.obrasSociales[2].afiliados = [this.afiliados[2]];
    }

    existePorNombre(nombre: string): Boolean {
        return this.obrasSociales.some(p => p.nombre === nombre);
    }

    afiliadoAlPaciente(cuil: string, numeroAfiliado: number): Boolean {
        return this.afiliados.some(afiliado => 
            afiliado.paciente.Cuil === cuil && 
            afiliado.numeroAfiliado === numeroAfiliado
        );
    }

}
import { Ingreso } from "../ingreso/ingreso";
import { Medico } from "../medico/medico.entity";

export class Atencion {
    id: number;
    informe: string;
    medico: Medico;
    ingreso: Ingreso;

    public constructor(id: number, informe: string, ingreso: Ingreso, medico: Medico){
        this.id  = id;
        this.informe = informe;
        this.ingreso = ingreso;
        this.medico = medico;
    }


    public getId(): number{
        return this.id;
    }

    public getInforme(): string{
        return this.informe;
    }

    public getMedico(): Medico{
        return this.medico;
    }

    public getIngreso(): Ingreso{
        return this.ingreso;
    }

}
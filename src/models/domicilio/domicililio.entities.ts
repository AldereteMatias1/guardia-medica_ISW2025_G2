export class Domicilio {
    calle: string;
    numero: number;
    localidad: string;

    public constructor(
        calle: string,
        localidad: string,
        numero: number
    ){
        this.calle = calle;
        this.localidad = localidad;
        this.numero = numero;
    }
}

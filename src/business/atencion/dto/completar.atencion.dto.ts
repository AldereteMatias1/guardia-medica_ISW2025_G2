import { IsNumber, IsString } from "class-validator";

export class CompletarAtencionDto {
    @IsNumber()
    idMedico: number;

    @IsString()
    informe: string;
}
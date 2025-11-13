import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { NivelEmergencia } from 'src/models/nivel-emergencia/nivelEmergencia.enum';


export class CreateIngresoDto {
  @ApiProperty({ example: '20-12345678-6' , description:'CUIL del paciente'})
  @IsString()
  cuilPaciente!: string;

  @ApiProperty({ example:1,description:'ID enfermerx'})
  @IsNumber()
  idEnfermera!:number;

  @ApiProperty({ example: 'Dolor abdominal intenso con vómitos' })
  @IsString()
  informe!: string;

  @ApiProperty({
    example: 2,
    enum: NivelEmergencia,
    description: 'Nivel de emergencia 1 (mayor) a 5 (menor)',
  })
  @IsEnum(NivelEmergencia)
  @Type(()=>Number)
  nivelEmergencia!: NivelEmergencia;

  @ApiProperty({ example: 37.5 })
  @IsNumber()
  @Min(30)
  @Max(45)
  temperatura!: number;

  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(30)
  @Max(200)
  frecuenciaCardiaca!: number;

  @ApiProperty({ example: 18 })
  @IsNumber()
  @Min(5)
  @Max(60)
  frecuenciaRespiratoria!: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(50)
  @Max(250)
  presionSistolica!: number;

  @ApiProperty({ example: 80 })
  @IsNumber()
  @Min(30)
  @Max(150)
  presionDiastolica!: number;
}

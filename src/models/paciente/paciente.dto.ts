import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, ValidateNested, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DomicilioDto {
  @ApiProperty({ example: 'Av. Siempre Viva' })
  @IsString()
  calle!: string;

  @ApiProperty({ example: 'San Miguel de Tucumán' })
  @IsString()
  localidad!: string;

  @ApiProperty({ example: 742 })
  @IsInt()
  @Min(0)
  numero!: number;
}

export class ObraSocialDto {
  @ApiProperty({ example: 'PAMI' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 123456789 })
  @IsString()
  numeroAfiliado!: string;
}

export class CreatePacienteDto {
  @ApiProperty({ example: 'Susana' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'Gimenez' })
  @IsString()
  apellido!: string;

  @ApiProperty({ example: '20-12345678-3', description: 'Formato NN-NNNNNNNN-N' })
  @Matches(/^\d{2}-\d{8}-\d$/, { message: 'CUIL con formato inválido (NN-NNNNNNNN-N)' })
  cuil!: string;

  @ApiProperty({ type: DomicilioDto })
  @ValidateNested()
  @Type(() => DomicilioDto)
  domicilio!: DomicilioDto;

  @ApiProperty({ type: ObraSocialDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ObraSocialDto)
  obraSocial?: ObraSocialDto;
}

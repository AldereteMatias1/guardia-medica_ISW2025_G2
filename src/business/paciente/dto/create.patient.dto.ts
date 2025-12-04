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
  @IsInt()
  numeroAfiliado!: number;

  public getObraSocial(){
    return this.nombre;

  }
  public getNumeroAfiliado(){
    return this.numeroAfiliado;
  }

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

  public getNombre() {
    return this.nombre;
  }

  public getApellido() {
    return this.apellido;
  }

  public getCuil() {
    return this.cuil;
  }

  public getDomicilio() {
    return this.domicilio;
  }

  public getDomicilioCalle() {
    return this.domicilio.calle;
  }

  public getDomicilioLocalidad() {
    return this.domicilio.localidad;
  }

  public getDomicilioNumero() {
    return this.domicilio.numero;
  }

  public getObraSocial() {
    return this.obraSocial;
  }

  public getObraSocialNombre() {
    return this.obraSocial?.nombre ?? null;
  }

  public getObraSocialNumeroAfiliado() {
    return this.obraSocial?.numeroAfiliado ?? null;
  }
}
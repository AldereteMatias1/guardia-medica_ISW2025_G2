import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEnfermeraDto {
  @ApiProperty({ example: 'Abel' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'Lopez' })
  @IsString()
  apellido!: string;
}
//posiblemente no lo usemos- no es parte del dominio del problema

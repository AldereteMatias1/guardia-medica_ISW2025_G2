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

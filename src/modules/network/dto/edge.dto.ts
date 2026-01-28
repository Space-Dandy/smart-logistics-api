import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class EdgeDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  from: string;

  @ApiProperty({ example: 'B' })
  @IsString()
  to: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  cost: number;
}

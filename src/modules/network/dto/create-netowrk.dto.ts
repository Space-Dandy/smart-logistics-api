import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { EdgeDto } from './edge.dto';

export class CreateNetworkDto {
  @ApiProperty({
    description: 'Array of edges in the network',
    type: [EdgeDto],
    example: [
      { from: 'A', to: 'B', cost: 10 },
      { from: 'B', to: 'C', cost: 15 },
      { from: 'A', to: 'C', cost: 30 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[];
}

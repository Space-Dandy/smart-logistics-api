import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OptimizeRouteDto {
  @ApiProperty({ example: 'A', description: 'Starting node ID' })
  @IsString()
  originNodeId: string;

  @ApiProperty({ example: 'B', description: 'Destination node ID' })
  @IsString()
  destinationNodeId: string;
}

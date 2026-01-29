import { ApiProperty } from '@nestjs/swagger';

export class OptimizeResponseDto {
  @ApiProperty({ example: 'uuid-123-456' })
  graphId: string;

  @ApiProperty({ example: 25.5 })
  totalCost: number;

  @ApiProperty({ example: ['A', 'B', 'C', 'D'] })
  path: string[];

  @ApiProperty({ example: 4 })
  durationMs: number;
}

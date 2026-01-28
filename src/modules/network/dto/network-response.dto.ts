import { ApiProperty } from '@nestjs/swagger';

export class NetworkResponseDto {
  @ApiProperty({ example: 'uuid-123-456' })
  id: string;

  @ApiProperty({ example: ['A', 'B', 'C'] })
  nodes: string[];

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}

import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptimizeRouteDto } from './dto/optimize-request.dto';
import { OptimizeResponseDto } from './dto/optimize-response.dto';
import { RouteService } from './route.service';

@ApiTags('route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('optimize/:id')
  @ApiOperation({
    summary: 'Find optimal route between two nodes in a network',
  })
  @ApiParam({
    name: 'id',
    description: 'Network ID (UUID)',
    example: '551e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'The optimal route has been successfully calculated.',
    type: OptimizeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description:
      'Network or Nodes not found, or origin/destination node does not exist in the graph',
    schema: {
      example: {
        statusCode: 404,
        message: "Origin node 'X' does not exist in the graph",
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No path exists between the specified origin and destination',
    schema: {
      example: {
        statusCode: 400,
        message: "No path exists between 'A' and 'D'",
        error: 'Bad Request',
      },
    },
  })
  async optimizeRoute(
    @Param('id') id: string,
    @Body() optimizeDto: OptimizeRouteDto,
  ): Promise<OptimizeResponseDto> {
    return this.routeService.optimizeRoute(id, optimizeDto);
  }
}

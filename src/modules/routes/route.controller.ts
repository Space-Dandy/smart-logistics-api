import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'The optimal route has been successfully calculated.',
    type: OptimizeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Network or Nodes not found' })
  async optimizeRoute(
    @Param('id') id: string,
    @Body() optimizeDto: OptimizeRouteDto,
  ): Promise<OptimizeResponseDto> {
    return this.routeService.optimizeRoute(id, optimizeDto);
  }
}

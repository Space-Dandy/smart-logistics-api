import { Injectable } from '@nestjs/common';
import { DijkstraService } from '../../core/algorithms/dijkstra.service';
import { NetworkService } from '../network/network.service';
import { OptimizeRouteDto } from './dto/optimize-request.dto';
import { OptimizeResponseDto } from './dto/optimize-response.dto';

@Injectable()
export class RouteService {
  constructor(
    private readonly dijkstraService: DijkstraService,
    private readonly networkService: NetworkService,
  ) {}

  async optimizeRoute(
    networkId: string,
    optimizeDto: OptimizeRouteDto,
  ): Promise<OptimizeResponseDto> {
    const startTime = Date.now();

    const network = await this.networkService.getNetworkWithEdges(networkId);

    const edges = network.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      cost: Number(edge.cost),
    }));

    const result = this.dijkstraService.findShortestPath(
      edges,
      optimizeDto.originNodeId,
      optimizeDto.destinationNodeId,
    );

    const durationMs = Date.now() - startTime;

    return {
      graphId: networkId,
      totalCost: result.totalCost,
      path: result.path,
      durationMs,
    };
  }
}

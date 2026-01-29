import { Module } from '@nestjs/common';
import { DijkstraService } from '../../core/algorithms/dijkstra.service';
import { NetworkModule } from '../network/network.module';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [NetworkModule],
  controllers: [RouteController],
  providers: [RouteService, DijkstraService],
})
export class RouteModule {}

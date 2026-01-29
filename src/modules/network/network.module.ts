import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './entities/edge.entitity';
import { Network } from './entities/network.entity';
import { Node } from './entities/node.entity';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
  imports: [TypeOrmModule.forFeature([Network, Node, Edge])],
  controllers: [NetworkController],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}

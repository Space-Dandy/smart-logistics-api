import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNetworkDto } from './dto/create-netowrk.dto';
import { NetworkResponseDto } from './dto/network-response.dto';
import { Edge } from './entities/edge.entitity';
import { Network } from './entities/network.entity';
import { Node } from './entities/node.entity';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
  ) {}

  async uploadNetwork(
    createNetworkDto: CreateNetworkDto,
  ): Promise<NetworkResponseDto> {
    // Create network
    const network = this.networkRepository.create();
    await this.networkRepository.save(network);

    // Extract unique nodes
    const nodeSet = new Set<string>();
    createNetworkDto.edges.forEach((edge) => {
      nodeSet.add(edge.from);
      nodeSet.add(edge.to);
    });

    // Save nodes
    const nodeEntities = Array.from(nodeSet).map((nodeId) => {
      return this.nodeRepository.create({
        nodeId,
        network,
      });
    });
    await this.nodeRepository.save(nodeEntities);

    // Save edges
    const edgeEntities = createNetworkDto.edges.map((edge) => {
      return this.edgeRepository.create({
        from: edge.from,
        to: edge.to,
        cost: edge.cost,
        network,
      });
    });
    await this.edgeRepository.save(edgeEntities);

    return {
      id: network.id,
      nodes: Array.from(nodeSet),
      createdAt: network.createdAt,
    };
  }

  async getNodes(networkId: string): Promise<string[]> {
    const network = await this.networkRepository.findOne({
      where: { id: networkId },
      relations: ['nodes'],
    });

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return network.nodes.map((node) => node.nodeId);
  }

  async getNetworkWithEdges(networkId: string): Promise<Network> {
    const network = await this.networkRepository.findOne({
      where: { id: networkId },
      relations: ['nodes', 'edges'],
    });

    if (!network) {
      throw new NotFoundException(`Network with ID ${networkId} not found`);
    }

    return network;
  }
}

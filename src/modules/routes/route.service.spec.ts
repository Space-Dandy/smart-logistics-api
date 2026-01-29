import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DijkstraService } from '../../core/algorithms/dijkstra.service';
import { Network } from '../network/entities/network.entity';
import { NetworkService } from '../network/network.service';
import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;
  let dijkstraService: DijkstraService;
  let networkService: NetworkService;

  const mockNetwork: Network = {
    id: 'test-network-id',
    name: 'Test Network',
    nodes: [],
    edges: [
      { id: '1', from: 'A', to: 'B', cost: 10, network: null } as any,
      { id: '2', from: 'B', to: 'C', cost: 5, network: null } as any,
    ],
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteService,
        DijkstraService,
        {
          provide: NetworkService,
          useValue: {
            getNetworkWithEdges: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RouteService>(RouteService);
    dijkstraService = module.get<DijkstraService>(DijkstraService);
    networkService = module.get<NetworkService>(NetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('optimizeRoute', () => {
    it('should throw NotFoundException when origin node does not exist', async () => {
      jest
        .spyOn(networkService, 'getNetworkWithEdges')
        .mockResolvedValue(mockNetwork);

      await expect(
        service.optimizeRoute('test-network-id', {
          originNodeId: 'Z',
          destinationNodeId: 'B',
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.optimizeRoute('test-network-id', {
          originNodeId: 'Z',
          destinationNodeId: 'B',
        }),
      ).rejects.toThrow("Origin node 'Z' does not exist in the graph");
    });

    it('should throw NotFoundException when destination node does not exist', async () => {
      jest
        .spyOn(networkService, 'getNetworkWithEdges')
        .mockResolvedValue(mockNetwork);

      await expect(
        service.optimizeRoute('test-network-id', {
          originNodeId: 'A',
          destinationNodeId: 'Z',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no path exists between nodes', async () => {
      const disconnectedNetwork: Network = {
        ...mockNetwork,
        edges: [
          { id: '1', from: 'A', to: 'B', cost: 10, network: null } as any,
          { id: '2', from: 'C', to: 'D', cost: 5, network: null } as any,
        ],
      };

      jest
        .spyOn(networkService, 'getNetworkWithEdges')
        .mockResolvedValue(disconnectedNetwork);

      await expect(
        service.optimizeRoute('test-network-id', {
          originNodeId: 'A',
          destinationNodeId: 'D',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return optimal route for valid request', async () => {
      jest
        .spyOn(networkService, 'getNetworkWithEdges')
        .mockResolvedValue(mockNetwork);

      const result = await service.optimizeRoute('test-network-id', {
        originNodeId: 'A',
        destinationNodeId: 'C',
      });

      expect(result).toBeDefined();
      expect(result.graphId).toBe('test-network-id');
      expect(result.totalCost).toBe(15);
      expect(result.path).toEqual(['A', 'B', 'C']);
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });
});

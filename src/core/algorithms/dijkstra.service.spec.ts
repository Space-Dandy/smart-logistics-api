import { DijkstraService, GraphEdge } from './dijkstra.service';

describe('DijkstraService', () => {
  let service: DijkstraService;

  beforeEach(() => {
    service = new DijkstraService();
  });

  describe('findShortestPath', () => {
    it('should find the shortest path in a simple graph', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'A', to: 'C', cost: 5 },
        { from: 'B', to: 'D', cost: 8 },
        { from: 'C', to: 'D', cost: 12 },
      ];

      const result = service.findShortestPath(edges, 'A', 'D');

      expect(result.totalCost).toBe(17);
      expect(result.path).toEqual(['A', 'C', 'D']);
    });

    it('should find the shortest path in a complex graph', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'A', to: 'C', cost: 5 },
        { from: 'B', to: 'D', cost: 8 },
        { from: 'C', to: 'D', cost: 12 },
        { from: 'D', to: 'E', cost: 12 },
        { from: 'D', to: 'F', cost: 4 },
        { from: 'F', to: 'G', cost: 4 },
        { from: 'E', to: 'G', cost: 9 },
        { from: 'C', to: 'H', cost: 8 },
        { from: 'D', to: 'H', cost: 4 },
        { from: 'F', to: 'H', cost: 1 },
      ];

      const result = service.findShortestPath(edges, 'A', 'G');

      expect(result.totalCost).toBe(18);
      expect(result.path).toEqual(['A', 'C', 'H', 'F', 'G']);
    });

    it('should handle direct path between two nodes', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 5 },
        { from: 'B', to: 'C', cost: 10 },
      ];

      const result = service.findShortestPath(edges, 'A', 'B');

      expect(result.totalCost).toBe(5);
      expect(result.path).toEqual(['A', 'B']);
    });

    it('should return zero cost for same origin and destination', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'B', to: 'C', cost: 5 },
      ];

      const result = service.findShortestPath(edges, 'A', 'A');

      expect(result.totalCost).toBe(0);
      expect(result.path).toEqual(['A']);
    });

    it('should work with bidirectional edges', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'B', to: 'C', cost: 5 },
      ];

      // Should work in reverse direction (undirected graph)
      const result = service.findShortestPath(edges, 'C', 'A');

      expect(result.totalCost).toBe(15);
      expect(result.path).toEqual(['C', 'B', 'A']);
    });

    it('should choose the cheaper path when multiple paths exist', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'A', to: 'C', cost: 5 },
        { from: 'B', to: 'D', cost: 1 },
        { from: 'C', to: 'D', cost: 3 },
      ];

      const result = service.findShortestPath(edges, 'A', 'D');

      // A -> C -> D = 5 + 3 = 8 (cheaper than A -> B -> D = 10 + 1 = 11)
      expect(result.totalCost).toBe(8);
      expect(result.path).toEqual(['A', 'C', 'D']);
    });

    it('should throw error when origin node does not exist', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'B', to: 'C', cost: 5 },
      ];

      expect(() => {
        service.findShortestPath(edges, 'Z', 'B');
      }).toThrow("Origin node 'Z' does not exist in the graph");
    });

    it('should throw error when destination node does not exist', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'B', to: 'C', cost: 5 },
      ];

      expect(() => {
        service.findShortestPath(edges, 'A', 'Z');
      }).toThrow("Destination node 'Z' does not exist in the graph");
    });

    it('should throw error when no path exists between nodes', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10 },
        { from: 'C', to: 'D', cost: 5 }, // Disconnected component
      ];

      expect(() => {
        service.findShortestPath(edges, 'A', 'D');
      }).toThrow("No path exists between 'A' and 'D'");
    });

    it('should handle single node graph', () => {
      const edges: GraphEdge[] = [{ from: 'A', to: 'B', cost: 5 }];

      const result = service.findShortestPath(edges, 'A', 'A');

      expect(result.totalCost).toBe(0);
      expect(result.path).toEqual(['A']);
    });

    it('should handle graph with decimal costs', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 10.5 },
        { from: 'B', to: 'C', cost: 3.2 },
      ];

      const result = service.findShortestPath(edges, 'A', 'C');

      expect(result.totalCost).toBeCloseTo(13.7, 1);
      expect(result.path).toEqual(['A', 'B', 'C']);
    });

    it('should handle large graphs efficiently', () => {
      // Create a larger graph
      const edges: GraphEdge[] = [];
      for (let i = 0; i < 50; i++) {
        edges.push({ from: `Node${i}`, to: `Node${i + 1}`, cost: 1 });
      }

      const startTime = Date.now();
      const result = service.findShortestPath(edges, 'Node0', 'Node50');
      const duration = Date.now() - startTime;

      expect(result.totalCost).toBe(50);
      expect(result.path.length).toBe(51);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should prefer shorter path with lower total cost', () => {
      const edges: GraphEdge[] = [
        { from: 'A', to: 'B', cost: 1 },
        { from: 'B', to: 'C', cost: 1 },
        { from: 'C', to: 'D', cost: 1 },
        { from: 'A', to: 'D', cost: 10 }, // Direct but expensive
      ];

      const result = service.findShortestPath(edges, 'A', 'D');

      expect(result.totalCost).toBe(3);
      expect(result.path).toEqual(['A', 'B', 'C', 'D']);
    });
  });
});

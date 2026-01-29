import { Injectable } from '@nestjs/common';

export interface GraphEdge {
  from: string;
  to: string;
  cost: number;
}

export interface DijkstraResult {
  path: string[];
  totalCost: number;
}

@Injectable()
export class DijkstraService {
  /**
   * Finds the shortest path between origin and destination using Dijkstra's algorithm
   */
  findShortestPath(
    edges: GraphEdge[],
    origin: string,
    destination: string,
  ): DijkstraResult {
    // Build adjacency list
    const graph = this.buildGraph(edges);

    // Check if origin and destination exist
    if (!graph.has(origin)) {
      throw new Error(`Origin node '${origin}' does not exist in the graph`);
    }
    if (!graph.has(destination)) {
      throw new Error(
        `Destination node '${destination}' does not exist in the graph`,
      );
    }

    // Initialize distances and previous nodes
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>(graph.keys());

    // Set all distances to infinity except origin
    graph.forEach((_, node) => {
      distances.set(node, node === origin ? 0 : Infinity);
      previous.set(node, null);
    });

    // Dijkstra's main loop
    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let currentNode: string | null = null;
      let smallestDistance = Infinity;

      unvisited.forEach((node) => {
        const distance = distances.get(node)!;
        if (distance < smallestDistance) {
          smallestDistance = distance;
          currentNode = node;
        }
      });

      // If we reached destination or no path exists
      if (currentNode === null || smallestDistance === Infinity) {
        break;
      }

      // If we reached the destination, we can stop early
      if (currentNode === destination) {
        break;
      }

      unvisited.delete(currentNode);

      // Update distances to neighbors
      const neighbors = graph.get(currentNode) || [];
      neighbors.forEach(({ node: neighbor, cost }) => {
        if (unvisited.has(neighbor)) {
          const newDistance = distances.get(currentNode!)! + cost;
          if (newDistance < distances.get(neighbor)!) {
            distances.set(neighbor, newDistance);
            previous.set(neighbor, currentNode);
          }
        }
      });
    }

    // Reconstruct path
    const path = this.reconstructPath(previous, origin, destination);
    const totalCost = distances.get(destination)!;

    if (totalCost === Infinity) {
      throw new Error(
        `No path exists between '${origin}' and '${destination}'`,
      );
    }

    return { path, totalCost };
  }

  /**
   * Builds an adjacency list from edges
   */
  private buildGraph(
    edges: GraphEdge[],
  ): Map<string, Array<{ node: string; cost: number }>> {
    const graph = new Map<string, Array<{ node: string; cost: number }>>();

    edges.forEach((edge) => {
      // Add edge from -> to
      if (!graph.has(edge.from)) {
        graph.set(edge.from, []);
      }
      graph.get(edge.from)!.push({ node: edge.to, cost: edge.cost });

      // Add reverse edge (undirected graph)
      if (!graph.has(edge.to)) {
        graph.set(edge.to, []);
      }
      graph.get(edge.to)!.push({ node: edge.from, cost: edge.cost });

      // Ensure all nodes exist in graph even if they have no outgoing edges
      if (!graph.has(edge.from)) graph.set(edge.from, []);
      if (!graph.has(edge.to)) graph.set(edge.to, []);
    });

    return graph;
  }

  /**
   * Reconstructs the shortest path from origin to destination
   */
  private reconstructPath(
    previous: Map<string, string | null>,
    origin: string,
    destination: string,
  ): string[] {
    const path: string[] = [];
    let current: string | null = destination;

    while (current !== null) {
      path.unshift(current);
      if (current === origin) break;
      current = previous.get(current)!;
    }

    return path;
  }
}

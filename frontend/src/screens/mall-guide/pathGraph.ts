/**
 * A* pathfinding on path segments (Way Graph).
 * Nodes are snapped by proximity (~2% threshold) to avoid duplicate nodes from click variance.
 */

import type { PathSegment } from "./calibrationStorage";
import type { StorePosition } from "./cityMallStores";

const SNAP_THRESHOLD = 2;
const CONNECT_RADIUS = 10;

function key(p: StorePosition): string {
  return `${p.left.toFixed(1)}_${p.top.toFixed(1)}`;
}

function dist(a: StorePosition, b: StorePosition): number {
  return Math.hypot(b.left - a.left, b.top - a.top);
}

function snapToExisting(
  p: StorePosition,
  keys: Map<string, StorePosition>
): StorePosition {
  for (const [, existing] of keys) {
    if (dist(p, existing) <= SNAP_THRESHOLD) {
      return existing;
    }
  }
  return p;
}

export interface PathGraph {
  nodes: Map<string, StorePosition>;
  neighbors: Map<string, Array<{ key: string; dist: number }>>;
}

export function buildGraph(segments: PathSegment[]): PathGraph {
  const nodes = new Map<string, StorePosition>();
  const addNode = (p: StorePosition) => {
    const snapped = snapToExisting(p, nodes);
    const k = key(snapped);
    if (!nodes.has(k)) {
      nodes.set(k, snapped);
    }
    return key(nodes.get(k)!);
  };

  const neighbors = new Map<string, Array<{ key: string; dist: number }>>();
  const addEdge = (fromKey: string, toKey: string, d: number) => {
    if (fromKey === toKey) return;
    const list = neighbors.get(fromKey) ?? [];
    if (!list.some((n) => n.key === toKey)) {
      list.push({ key: toKey, dist: d });
      neighbors.set(fromKey, list);
    }
  };

  for (const seg of segments) {
    const fromPos = snapToExisting(seg.from, nodes);
    const toPos = snapToExisting(seg.to, nodes);
    const fromKey = addNode(fromPos);
    const toKey = addNode(toPos);
    const d = dist(fromPos, toPos);
    addEdge(fromKey, toKey, d);
    addEdge(toKey, fromKey, d);
  }

  return { nodes, neighbors };
}

function heuristic(a: StorePosition, b: StorePosition): number {
  return dist(a, b);
}

/**
 * Find shortest path from start to goal using A*.
 * Returns ordered array of positions, or null if no path exists.
 */
export function findPath(
  graph: PathGraph,
  start: StorePosition,
  goal: StorePosition
): StorePosition[] | null {
  const startSnapped = snapToExisting(start, graph.nodes);
  const goalSnapped = snapToExisting(goal, graph.nodes);
  const startKey = key(startSnapped);
  const goalKey = key(goalSnapped);

  if (startKey === goalKey) {
    return [start, goal];
  }

  // Ensure start and goal are in the graph
  const nodes = new Map(graph.nodes);
  if (!nodes.has(startKey)) nodes.set(startKey, startSnapped);
  if (!nodes.has(goalKey)) nodes.set(goalKey, goalSnapped);

  const neighbors = new Map(graph.neighbors);
  const startNeighbors = neighbors.get(startKey) ?? [];
  const goalNeighbors = neighbors.get(goalKey) ?? [];

  // Connect start to nearby graph nodes (reception must be near a segment)
  for (const [k, pos] of graph.nodes) {
    if (k !== startKey && dist(startSnapped, pos) <= CONNECT_RADIUS) {
      const d = dist(startSnapped, pos);
      startNeighbors.push({ key: k, dist: d });
      const otherList = neighbors.get(k) ?? [];
      otherList.push({ key: startKey, dist: d });
      neighbors.set(k, otherList);
    }
  }
  neighbors.set(startKey, startNeighbors);

  // Connect goal to nearby graph nodes (store must be near a segment)
  for (const [k, pos] of graph.nodes) {
    if (k !== goalKey && dist(goalSnapped, pos) <= CONNECT_RADIUS) {
      const d = dist(goalSnapped, pos);
      goalNeighbors.push({ key: k, dist: d });
      const otherList = neighbors.get(k) ?? [];
      otherList.push({ key: goalKey, dist: d });
      neighbors.set(k, otherList);
    }
  }
  neighbors.set(goalKey, goalNeighbors);

  const openSet = new Set<string>([startKey]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  gScore.set(startKey, 0);
  fScore.set(
    startKey,
    heuristic(nodes.get(startKey)!, nodes.get(goalKey)!)
  );

  while (openSet.size > 0) {
    let current: string | null = null;
    let bestF = Infinity;
    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < bestF) {
        bestF = f;
        current = k;
      }
    }
    if (current === null || current === goalKey) break;

    openSet.delete(current);
    const adj = neighbors.get(current) ?? [];

    for (const { key: nextKey, dist: edgeDist } of adj) {
      const tentativeG = (gScore.get(current) ?? Infinity) + edgeDist;
      if (tentativeG < (gScore.get(nextKey) ?? Infinity)) {
        cameFrom.set(nextKey, current);
        gScore.set(nextKey, tentativeG);
        const nextPos = nodes.get(nextKey)!;
        fScore.set(
          nextKey,
          tentativeG + heuristic(nextPos, nodes.get(goalKey)!)
        );
        openSet.add(nextKey);
      }
    }
  }

  const path: StorePosition[] = [];
  let trace: string | undefined = goalKey;
  while (trace) {
    path.unshift(nodes.get(trace)!);
    trace = cameFrom.get(trace);
  }

  if (path.length > 0 && path[0].left === startSnapped.left && path[0].top === startSnapped.top) {
    return path;
  }
  return null;
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StorePosition } from "./cityMallStores";
import {
  getDefaultCalibration,
  loadStores,
  saveStores,
  type PathMode,
  type PathSegment,
  type StoredCalibration,
} from "./calibrationStorage";
import { buildGraph, findPath as findPathInGraph } from "./pathGraph";

interface StorePositionsContextValue {
  reception: StorePosition;
  stores: Record<string, StorePosition>;
  pathMode: PathMode;
  routes: Record<string, StorePosition[]>;
  pathSegments: PathSegment[];
  findStore: (query: string) => string | null;
  getStorePosition: (storeName: string) => StorePosition | null;
  getPath: (from: StorePosition, to: StorePosition, storeName?: string) => StorePosition[] | null;
  saveStore: (name: string, pos: StorePosition) => void;
  saveReception: (pos: StorePosition) => void;
  deleteStore: (name: string) => void;
  setPathMode: (mode: PathMode) => void;
  saveRoute: (storeName: string, waypoints: StorePosition[]) => void;
  deleteRoute: (storeName: string) => void;
  addPathSegment: (from: StorePosition, to: StorePosition) => void;
  removePathSegment: (index: number) => void;
  clearPathSegments: () => void;
  resetToDefaults: () => void;
  exportJson: () => string;
  importJson: (data: StoredCalibration) => void;
}

const StorePositionsContext = createContext<StorePositionsContextValue | null>(
  null
);

function findStoreInStores(
  stores: Record<string, StorePosition>,
  query: string
): string | null {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return null;
  const names = Object.keys(stores);
  for (const name of names) {
    if (name.toLowerCase() === q) return name;
  }
  for (const name of names) {
    if (name.toLowerCase().includes(q)) return name;
  }
  for (const name of names) {
    if (q.includes(name.toLowerCase())) return name;
  }
  return null;
}

export function StorePositionsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredCalibration>(() => {
    const loaded = loadStores();
    return loaded ?? getDefaultCalibration();
  });

  const persist = useCallback((next: StoredCalibration) => {
    setData(next);
    saveStores(next);
  }, []);

  const value = useMemo<StorePositionsContextValue>(() => {
    const pathMode = data.pathMode ?? "waypoints";
    const routes = data.routes ?? {};
    const pathSegments = data.pathSegments ?? [];

    const getPath = (
      from: StorePosition,
      to: StorePosition,
      storeName?: string
    ): StorePosition[] | null => {
      if (pathMode === "waypoints" && storeName && routes[storeName]?.length) {
        return [from, ...routes[storeName], to];
      }
      if (pathMode === "wayGraph" && pathSegments.length > 0) {
        const graph = buildGraph(pathSegments);
        return findPathInGraph(graph, from, to);
      }
      return null;
    };

    return {
      reception: data.reception,
      stores: data.stores,
      pathMode,
      routes,
      pathSegments,
      findStore: (query) => findStoreInStores(data.stores, query),
      getStorePosition: (name) => data.stores[name] ?? null,
      getPath,
      saveStore: (name, pos) => {
        persist({
          ...data,
          stores: { ...data.stores, [name]: { ...pos } },
        });
      },
      saveReception: (pos) => {
        persist({ ...data, reception: { ...pos } });
      },
      deleteStore: (name) => {
        const { [name]: _, ...rest } = data.stores;
        const nextRoutes = { ...(data.routes ?? {}) };
        delete nextRoutes[name];
        persist({ ...data, stores: rest, routes: nextRoutes });
      },
      setPathMode: (mode) => {
        persist({ ...data, pathMode: mode });
      },
      saveRoute: (storeName, waypoints) => {
        const nextRoutes = { ...(data.routes ?? {}), [storeName]: waypoints };
        persist({ ...data, routes: nextRoutes });
      },
      deleteRoute: (storeName) => {
        const nextRoutes = { ...(data.routes ?? {}) };
        delete nextRoutes[storeName];
        persist({ ...data, routes: nextRoutes });
      },
      addPathSegment: (from, to) => {
        const next = [...(data.pathSegments ?? []), { from: { ...from }, to: { ...to } }];
        persist({ ...data, pathSegments: next });
      },
      removePathSegment: (index) => {
        const next = (data.pathSegments ?? []).filter((_, i) => i !== index);
        persist({ ...data, pathSegments: next });
      },
      clearPathSegments: () => {
        persist({ ...data, pathSegments: [] });
      },
      resetToDefaults: () => {
        persist(getDefaultCalibration());
      },
      exportJson: () => JSON.stringify(data, null, 2),
      importJson: (imported) => {
        if (
          imported?.reception &&
          typeof imported.reception.left === "number" &&
          typeof imported.reception.top === "number" &&
          imported.stores &&
          typeof imported.stores === "object"
        ) {
          const next: StoredCalibration = {
            reception: imported.reception,
            stores: imported.stores,
          };
          if (imported.pathMode === "waypoints" || imported.pathMode === "wayGraph") {
            next.pathMode = imported.pathMode;
          }
          if (imported.routes && typeof imported.routes === "object" && !Array.isArray(imported.routes)) {
            next.routes = imported.routes;
          }
          if (Array.isArray(imported.pathSegments)) {
            next.pathSegments = imported.pathSegments;
          }
          persist(next);
        }
      },
    };
  }, [data, persist]);

  return (
    <StorePositionsContext.Provider value={value}>
      {children}
    </StorePositionsContext.Provider>
  );
}

export function useStorePositions(): StorePositionsContextValue {
  const ctx = useContext(StorePositionsContext);
  if (!ctx) {
    throw new Error("useStorePositions must be used within StorePositionsProvider");
  }
  return ctx;
}

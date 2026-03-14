/**
 * Visual markers for store positions on the map.
 * Uses the same (left, top) percent coordinates as the robot.
 * Markers show where each store is located — helps verify calibration.
 */

import { useStorePositions } from "./useStorePositions";

interface StoreMarkersProps {
  targetStore: string | null;
  showAllStores?: boolean;
}

export function StoreMarkers({ targetStore, showAllStores = false }: StoreMarkersProps) {
  const { reception, stores: storesMap } = useStorePositions();
  const stores = Object.entries(storesMap);

  return (
    <div className="absolute inset-0 pointer-events-none z-[15]">
      {/* Reception marker */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-2 border-white shadow-[0_0_8px_rgba(0,229,255,0.8)]"
        style={{ left: `${reception.left}%`, top: `${reception.top}%` }}
        title="Reception"
      />

      {/* Store markers */}
      {stores.map(([name, pos]) => {
        const isTarget = targetStore === name;
        const show = showAllStores || isTarget;

        if (!show) return null;

        return (
          <div
            key={name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${
              isTarget
                ? "w-5 h-5 rounded-full bg-toxic border-2 border-white shadow-[0_0_12px_rgba(57,255,20,0.9)] animate-pulse"
                : "w-3 h-3 rounded-full bg-primary/60 border border-white/50"
            }`}
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            title={name}
          >
            {isTarget && (
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap text-xs font-bold text-toxic drop-shadow-md">
                {name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

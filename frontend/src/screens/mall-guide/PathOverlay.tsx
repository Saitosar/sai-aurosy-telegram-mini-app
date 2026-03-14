/**
 * Renders path lines and arrows on the map.
 * Uses percent coordinates (left, top) — same system as StoreMarkers.
 */

import type { PathSegment } from "./calibrationStorage";
import type { StorePosition } from "./cityMallStores";

interface PathOverlayProps {
  path?: StorePosition[];
  segments?: PathSegment[];
  className?: string;
}

function angleBetween(a: StorePosition, b: StorePosition): number {
  return Math.atan2(b.top - a.top, b.left - a.left);
}

export function PathOverlay({
  path,
  segments,
  className = "",
}: PathOverlayProps) {
  const hasPath = path && path.length >= 2;
  const hasSegments = segments && segments.length > 0;

  if (!hasPath && !hasSegments) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 14 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {hasPath && (
          <g stroke="rgba(0,229,255,0.8)" strokeWidth="1.5" fill="none">
            {path.slice(0, -1).map((from, i) => {
              const to = path[i + 1];
              const angle = angleBetween(from, to);
              const midLeft = (from.left + to.left) / 2;
              const midTop = (from.top + to.top) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.left}
                    y1={from.top}
                    x2={to.left}
                    y2={to.top}
                    strokeLinecap="round"
                  />
                  <polygon
                    points="0,0 2,1 0,2"
                    fill="rgba(0,229,255,0.9)"
                    transform={`translate(${midLeft},${midTop}) rotate(${
                      (angle * 180) / Math.PI
                    }) scale(1.5)`}
                  />
                </g>
              );
            })}
          </g>
        )}

        {hasSegments && (
          <g stroke="rgba(0,229,255,0.6)" strokeWidth="1.2" fill="none">
            {segments.map((seg, i) => {
              const { from, to } = seg;
              const angle = angleBetween(from, to);
              const midLeft = (from.left + to.left) / 2;
              const midTop = (from.top + to.top) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.left}
                    y1={from.top}
                    x2={to.left}
                    y2={to.top}
                    strokeLinecap="round"
                  />
                  <polygon
                    points="0,0 2,1 0,2"
                    fill="rgba(0,229,255,0.8)"
                    transform={`translate(${midLeft},${midTop}) rotate(${
                      (angle * 180) / Math.PI
                    }) scale(1.2)`}
                  />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}

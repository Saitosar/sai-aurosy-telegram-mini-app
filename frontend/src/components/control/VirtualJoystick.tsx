import { useCallback, useRef, useState } from "react";

export interface JoystickOutput {
  x: number;
  y: number;
  angle: number;
  magnitude: number;
}

type VirtualJoystickProps = {
  onMove: (output: JoystickOutput) => void;
  onRelease?: () => void;
  disabled?: boolean;
  size?: number;
  className?: string;
};

const RADIUS = 0.85;

export function VirtualJoystick({
  onMove,
  onRelease,
  disabled = false,
  size = 160,
  className,
}: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const isActive = useRef(false);

  const clampToCircle = useCallback(
    (x: number, y: number) => {
      const len = Math.sqrt(x * x + y * y);
      if (len <= 1) return { x, y };
      return { x: x / len, y: y / len };
    },
    []
  );

  const toOutput = useCallback(
    (x: number, y: number): JoystickOutput => {
      const { x: cx, y: cy } = clampToCircle(x, y);
      const magnitude = Math.min(1, Math.sqrt(cx * cx + cy * cy));
      const angle =
        (Math.atan2(cx, -cy) * (180 / Math.PI) + 360) % 360;
      return { x: cx, y: cy, angle, magnitude };
    },
    [clampToCircle]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isActive.current = true;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxDist = (rect.width / 2) * RADIUS;
      const x = (e.clientX - centerX) / maxDist;
      const y = (e.clientY - centerY) / maxDist;
      const { x: cx, y: cy } = clampToCircle(x, y);
      setStickPos({ x: cx, y: cy });
      onMove(toOutput(cx, cy));
    },
    [disabled, clampToCircle, onMove, toOutput]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isActive.current || disabled) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxDist = (rect.width / 2) * RADIUS;
      const x = (e.clientX - centerX) / maxDist;
      const y = (e.clientY - centerY) / maxDist;
      const { x: cx, y: cy } = clampToCircle(x, y);
      setStickPos({ x: cx, y: cy });
      onMove(toOutput(cx, cy));
    },
    [disabled, clampToCircle, onMove, toOutput]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      isActive.current = false;
      setStickPos({ x: 0, y: 0 });
      onMove(toOutput(0, 0));
      onRelease?.();
    },
    [onMove, onRelease, toOutput]
  );

  const stickRadius = size * 0.2;
  const baseRadius = size / 2;
  const stickX = baseRadius + stickPos.x * baseRadius * RADIUS - stickRadius;
  const stickY = baseRadius + stickPos.y * baseRadius * RADIUS - stickRadius;

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Movement joystick"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={stickPos.x !== 0 || stickPos.y !== 0 ? 50 : 0}
      className={className}
      style={{ width: size, height: size, touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={disabled ? "opacity-50" : ""}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={baseRadius * RADIUS}
          fill="var(--glass-bg)"
          stroke="var(--glass-border)"
          strokeWidth={1}
        />
        <circle
          cx={stickX + stickRadius}
          cy={stickY + stickRadius}
          r={stickRadius}
          fill="var(--primary)"
          fillOpacity={0.9}
          stroke="var(--glass-border-liquid)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

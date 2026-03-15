import { useState } from "react";
import {
  Wifi,
  Thermometer,
  MapPin,
  Battery,
  AlertTriangle,
} from "lucide-react";
import type { Telemetry } from "shared";
import { haptic } from "../../utils/haptic";
import { cn } from "../ui/utils";

export type MetricId =
  | "communicationQuality"
  | "casing"
  | "winding"
  | "location"
  | "battery"
  | "alarms";

type RobotMetricsPanelProps = {
  telemetry: Telemetry | null;
  lastUpdated: Date | null;
  isStale: boolean;
};

function MetricRow({
  id,
  label,
  icon: Icon,
  value,
  isActive,
  onClick,
  children,
}: {
  id: MetricId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      data-metric-id={id}
      onClick={() => {
        haptic.impact("light");
        onClick();
      }}
      className={cn(
        "w-full flex items-center justify-between rounded-xl p-3 transition-colors text-left",
        isActive
          ? "bg-primary/10 ring-2 ring-primary ring-inset"
          : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="p-2 rounded-lg glass-icon-container">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium text-[15px]">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        {children ?? (
          <span className="font-mono text-foreground text-[15px] px-3 py-1 rounded-lg glass-button-secondary">
            {value ?? "—"}
          </span>
        )}
      </div>
    </button>
  );
}

export function RobotMetricsPanel({
  telemetry,
  lastUpdated,
  isStale,
}: RobotMetricsPanelProps) {
  const [activeMetric, setActiveMetric] = useState<MetricId | null>(null);

  const position = telemetry?.position ?? { x: 0, y: 0 };
  const battery = telemetry?.battery ?? 0;
  const communicationQuality = telemetry?.communicationQuality;
  const casingTemp = telemetry?.temperature?.casing;
  const windingTemp = telemetry?.temperature?.winding;
  const alarms = telemetry?.alarms;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[13px] font-semibold text-foreground">Telemetry</h3>
        {lastUpdated && (
          <span
            className={cn(
              "text-[11px] font-medium",
              isStale ? "text-amber-500" : "text-muted-foreground"
            )}
            title={lastUpdated.toLocaleTimeString()}
          >
            {isStale
              ? "Data may be outdated"
              : `Updated ${Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago`}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <MetricRow
          id="communicationQuality"
          label="Communication Quality"
          icon={Wifi}
          value={
            communicationQuality !== undefined
              ? `${communicationQuality}%`
              : "—"
          }
          isActive={activeMetric === "communicationQuality"}
          onClick={() =>
            setActiveMetric((m) =>
              m === "communicationQuality" ? null : "communicationQuality"
            )
          }
          children={
            communicationQuality !== undefined && (
              <div className="flex items-center gap-4">
                <div className="w-24 rounded-full h-2 overflow-hidden bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      communicationQuality > 80
                        ? "bg-toxic"
                        : communicationQuality > 50
                          ? "bg-primary"
                          : "bg-red-500"
                    )}
                    style={{ width: `${communicationQuality}%` }}
                  />
                </div>
                <span className="font-mono text-foreground text-[15px] px-3 py-1 rounded-lg glass-button-secondary">
                  {communicationQuality}%
                </span>
              </div>
            )
          }
        />
        <MetricRow
          id="casing"
          label="Casing Temperature"
          icon={Thermometer}
          value={casingTemp !== undefined ? `${casingTemp} °C` : "—"}
          isActive={activeMetric === "casing"}
          onClick={() =>
            setActiveMetric((m) => (m === "casing" ? null : "casing"))
          }
        />
        <MetricRow
          id="winding"
          label="Winding Temperature"
          icon={Thermometer}
          value={windingTemp !== undefined ? `${windingTemp} °C` : "—"}
          isActive={activeMetric === "winding"}
          onClick={() =>
            setActiveMetric((m) => (m === "winding" ? null : "winding"))
          }
        />
        <MetricRow
          id="location"
          label="Location"
          icon={MapPin}
          value={`X: ${position.x}, Y: ${position.y}`}
          isActive={activeMetric === "location"}
          onClick={() =>
            setActiveMetric((m) => (m === "location" ? null : "location"))
          }
        />
        <MetricRow
          id="battery"
          label="Battery"
          icon={Battery}
          value={`${battery}%`}
          isActive={activeMetric === "battery"}
          onClick={() =>
            setActiveMetric((m) => (m === "battery" ? null : "battery"))
          }
          children={
            <div className="flex items-center gap-4">
              <div className="w-24 rounded-full h-2 overflow-hidden bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    battery > 80 ? "bg-toxic" : battery > 20 ? "bg-primary" : "bg-red-500"
                  )}
                  style={{ width: `${battery}%` }}
                />
              </div>
              <span className="font-mono text-foreground text-[15px] px-3 py-1 rounded-lg glass-button-secondary">
                {battery}%
              </span>
            </div>
          }
        />
        <MetricRow
          id="alarms"
          label="Alarms"
          icon={AlertTriangle}
          value=""
          isActive={activeMetric === "alarms"}
          onClick={() =>
            setActiveMetric((m) => (m === "alarms" ? null : "alarms"))
          }
          children={
            <span
              className={cn(
                "font-medium text-[15px] px-3 py-1 rounded-lg",
                alarms && alarms.length > 0
                  ? "text-red-500 bg-red-500/10 border border-red-500/30"
                  : "text-muted-foreground"
              )}
            >
              {alarms && alarms.length > 0
                ? alarms.join(", ")
                : "No current anomalies"}
            </span>
          }
        />
      </div>
    </div>
  );
}

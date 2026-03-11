import { motion } from "framer-motion";
import type { DemoMetrics } from "./useDemo";

interface BusinessMetricsProps {
  metrics: DemoMetrics;
  isRunning: boolean;
  isComplete: boolean;
}

const METRIC_CONFIG = [
  { key: "visitorsAttracted" as const, label: "Visitors attracted", suffix: "" },
  { key: "childrenInteractions" as const, label: "Children interactions", suffix: "" },
  { key: "eventDurationMinutes" as const, label: "Event duration", suffix: " min" },
  { key: "engagementTimeSeconds" as const, label: "Engagement time", suffix: " sec" },
  { key: "promotionImpressions" as const, label: "Promotion impressions", suffix: "" },
] as const;


export function BusinessMetrics({
  metrics,
  isRunning,
  isComplete,
}: BusinessMetricsProps) {
  const showMetrics = isRunning || isComplete;

  return (
    <section className="px-6 py-12">
      <h2 className="text-xl font-semibold text-white uppercase tracking-wider mb-4">
        Business Value
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {METRIC_CONFIG.map(({ key, label, suffix }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${
              showMetrics
                ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.08)]"
                : "bg-[#111111]/80 border-white/5"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-white">
              {metrics[key]}
              {suffix}
            </p>
          </motion.div>
        ))}
      </div>

      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-primary/10 border border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
        >
          <p className="text-center font-semibold text-primary text-lg">
            This robot event increased visitor engagement in the mall.
          </p>
        </motion.div>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { getStoreItem } from "../../api/store";
import type { StoreItem } from "shared";

interface HeroSectionProps {
  onStartDemo: () => void;
  isRunning: boolean;
  currentStep: number;
  isComplete: boolean;
}

export function HeroSection({
  onStartDemo,
  isRunning,
  currentStep,
  isComplete,
}: HeroSectionProps) {
  const [robot, setRobot] = useState<StoreItem | null>(null);

  useEffect(() => {
    getStoreItem("agibot-x2")
      .then(setRobot)
      .catch(() => setRobot(null));
  }, []);

  const isDancing = isRunning && (currentStep === 2 || currentStep === 3);
  const isWaving = isRunning && (currentStep === 0 || currentStep === 1);

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center px-6 py-10 md:py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8 relative flex items-center justify-center"
          animate={
            isDancing
              ? {
                  scale: [1, 1.05, 1, 1.05, 1],
                  y: [0, -8, 0, -8, 0],
                  transition: { repeat: Infinity, duration: 1.5 },
                }
              : isWaving
                ? {
                    y: [0, -4, 0],
                    transition: { repeat: Infinity, duration: 1.2 },
                  }
                : {
                    y: [0, -6, 0],
                    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  }
          }
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-[#1f1f22] border border-primary/30 shadow-[0_0_40px_rgba(0,229,255,0.2)] flex items-center justify-center">
            {robot?.imageUrl ? (
              <img
                src={robot.imageUrl}
                alt={robot.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <Bot className="w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
            )}
          </div>
        </motion.div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white mb-3 drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          Entertainment Robot Experience
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
          Meet the future attraction of your mall.
        </p>

        {!isRunning && !isComplete && (
          <motion.button
            onClick={onStartDemo}
            className="px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Event Mode Demo
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}

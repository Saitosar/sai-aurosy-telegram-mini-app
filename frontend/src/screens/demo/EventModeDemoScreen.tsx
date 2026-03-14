import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useGLTF } from "@react-three/drei";
import { useDemo } from "./useDemo";
import { HeroSection } from "./HeroSection";
import { LiveStageView } from "./LiveStageView";
import { BusinessMetrics } from "./BusinessMetrics";

export function EventModeDemoScreen() {
  const {
    isRunning,
    isComplete,
    currentStep,
    stepProgress,
    metrics,
    visitorCount,
    start,
    restart,
  } = useDemo();
  const finalMessageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    useGLTF.preload("/animated_robot_sdc.glb");
  }, []);

  useEffect(() => {
    if (isComplete && finalMessageRef.current) {
      finalMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-medium text-primary">Event Mode Demo</span>
        </div>
      </header>

      <main className="pb-20">
        <AnimatePresence mode="wait">
          {!isRunning && !isComplete && (
            <motion.div
              key="hero"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection
                onStartDemo={start}
                isRunning={false}
                currentStep={0}
                isComplete={false}
              />
            </motion.div>
          )}

          {isRunning && (
            <motion.div
              key="stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LiveStageView
                currentStep={currentStep}
                stepProgress={stepProgress}
                isRunning={isRunning}
                isComplete={false}
                visitorCount={visitorCount}
                metrics={metrics}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isComplete && (
          <>
            <section className="px-6 py-12">
              <BusinessMetrics
                metrics={metrics}
                isRunning={false}
                isComplete={true}
              />
            </section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 scroll-mt-8"
              ref={finalMessageRef}
            >
              <div className="max-w-2xl mx-auto text-center space-y-8">
                <div className="p-8 rounded-3xl glass-card">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Imagine this experience in your mall.
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Entertainment robots create unforgettable experiences and
                    attract thousands of visitors.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://t.me/Arif_Mammadov1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-primary text-primary-foreground font-medium text-lg rounded-2xl hover:opacity-90 transition-opacity"
                    >
                      Deploy Robot in My Mall
                    </a>
                    <button
                      onClick={restart}
                      className="px-8 py-4 glass-button-secondary text-foreground font-medium text-lg rounded-2xl hover:bg-muted/50 transition-colors"
                    >
                      Replay Demo
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
}

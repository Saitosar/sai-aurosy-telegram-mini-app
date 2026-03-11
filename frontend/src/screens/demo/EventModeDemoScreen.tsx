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
    useGLTF.preload("/robot_from_the_series_love_death_and_robots.glb");
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
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-[15px]">Back</span>
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
                <div className="p-8 rounded-2xl bg-primary/10 border border-primary/30 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
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
                      className="px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] transition-all"
                    >
                      Deploy Robot in My Mall
                    </a>
                    <button
                      onClick={restart}
                      className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
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

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Robot3DModel } from "./Robot3DModel";
import { useRobotPath } from "./useRobotPath";

export const ROBOT_WAYPOINTS = [
  { left: 35, top: 30 }, // step 0: greeting
  { left: 42, top: 30 }, // step 1: invite
  { left: 50, top: 32 }, // step 2: dance
  { left: 50, top: 32 }, // step 3: music
  { left: 62, top: 30 }, // step 4: photos
  { left: 50, top: 34 }, // step 5: bow
] as const;

function percentToScene(left: number, top: number): [number, number, number] {
  const x = (left - 50) / 50;
  const z = (50 - top) / 50;
  return [x, 0, z];
}

interface RobotStageProps {
  currentStep: number;
  currentStepLabel: string;
  isRunning: boolean;
  isComplete: boolean;
}

export function RobotStage({
  currentStep: _currentStep,
  currentStepLabel,
  isRunning,
  isComplete,
}: RobotStageProps) {
  const pathPosition = useRobotPath(isRunning || isComplete);
  const scenePosition = percentToScene(pathPosition.left, pathPosition.top);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 2.5, 4],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Robot3DModel
              position={scenePosition}
              scale={0.06}
              rotationY={Math.PI / 4}
            />
          </Suspense>
        </Canvas>
      </div>

      <motion.div
        className="absolute z-30 w-12 h-12"
        initial={{ left: `${pathPosition.left}%`, top: `${pathPosition.top}%` }}
        animate={{
          left: `${pathPosition.left}%`,
          top: `${pathPosition.top}%`,
          transition: { duration: 0.1, ease: "linear" },
        }}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepLabel}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-2 rounded-xl bg-black/80 border border-primary/30 text-white text-sm font-medium text-center shadow-[0_0_12px_rgba(0,229,255,0.2)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {currentStepLabel}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black/80"
              style={{ marginTop: "-1px" }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

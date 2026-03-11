import { motion } from "framer-motion";

const STAGE_CENTER_X = 50;
const STAGE_CENTER_Y = 32;
const GATHER_RADIUS = 22;

function polarToPercent(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: STAGE_CENTER_X + radius * Math.cos(rad),
    y: STAGE_CENTER_Y + radius * Math.sin(rad),
  };
}

const START_POSITIONS = [
  { x: 8, y: 12 },
  { x: 92, y: 15 },
  { x: 5, y: 35 },
  { x: 95, y: 38 },
  { x: 12, y: 85 },
  { x: 88, y: 82 },
  { x: 8, y: 55 },
  { x: 92, y: 52 },
  { x: 22, y: 8 },
  { x: 78, y: 6 },
  { x: 15, y: 72 },
  { x: 85, y: 75 },
  { x: 4, y: 48 },
  { x: 96, y: 45 },
  { x: 28, y: 92 },
  { x: 72, y: 90 },
  { x: 18, y: 28 },
  { x: 82, y: 25 },
  { x: 25, y: 68 },
  { x: 75, y: 70 },
  { x: 35, y: 5 },
  { x: 65, y: 4 },
  { x: 32, y: 78 },
  { x: 68, y: 80 },
  { x: 42, y: 10 },
  { x: 58, y: 8 },
  { x: 38, y: 88 },
  { x: 62, y: 86 },
  { x: 48, y: 15 },
  { x: 52, y: 85 },
  { x: 10, y: 42 },
  { x: 90, y: 58 },
  { x: 20, y: 50 },
  { x: 80, y: 48 },
  { x: 30, y: 35 },
  { x: 70, y: 62 },
  { x: 45, y: 25 },
  { x: 55, y: 72 },
  { x: 40, y: 42 },
  { x: 60, y: 55 },
];

const END_ANGLES = [
  200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295,
  300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 0, 5, 10, 15, 20, 25, 30, 35,
];

const DICEBEAR_BASE = "https://api.dicebear.com/9.x/personas/svg";

interface CrowdLayerProps {
  crowdCount: number;
  isRunning: boolean;
  isComplete: boolean;
}

export function CrowdLayer({
  crowdCount,
  isRunning,
  isComplete,
}: CrowdLayerProps) {
  const visibleCount = Math.min(crowdCount, START_POSITIONS.length);
  const shouldShow = isRunning || isComplete;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {START_POSITIONS.slice(0, visibleCount).map((start, i) => {
        const end = polarToPercent(END_ANGLES[i] ?? 270, GATHER_RADIUS);
        const isChild = i % 3 === 1;
        const size = isChild ? 32 : 44;
        const avatarUrl = `${DICEBEAR_BASE}?seed=visitor-${i}&size=${size}&backgroundColor=transparent`;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full overflow-hidden bg-white/10 ring-2 ring-white/20"
            initial={{
              left: `${start.x}%`,
              top: `${start.y}%`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              left: shouldShow ? `${end.x}%` : `${start.x}%`,
              top: shouldShow ? `${end.y}%` : `${start.y}%`,
              opacity: shouldShow ? 0.95 : 0,
              scale: shouldShow ? 1 : 0.5,
              transition: {
                left: { duration: 2.5, delay: i * 0.08 },
                top: { duration: 2.5, delay: i * 0.08 },
                opacity: { duration: 0.4, delay: i * 0.05 },
                scale: { duration: 0.5, delay: i * 0.05 },
              },
            }}
            style={{
              transform: "translate(-50%, -50%)",
              width: size,
              height: size,
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={
                shouldShow
                  ? {
                      y: [0, -3, 0],
                      scale: [1, 1.02, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1.5 + (i % 4) * 0.3,
                        delay: i * 0.05,
                      },
                    }
                  : {}
              }
            >
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

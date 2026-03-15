import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Footprints, Zap, RotateCcw, AlertTriangle } from "lucide-react";
import type { RobotCommandRequest } from "shared";
import { sendCommand } from "../../api/robots";
import { VirtualJoystick, type JoystickOutput } from "./VirtualJoystick";
import { RobotAvatar } from "./RobotAvatar";
import { haptic } from "../../utils/haptic";
import { cn } from "../ui/utils";

const MOVE_THROTTLE_MS = 120;

type ManualControlViewProps = {
  robotId: string;
  commandPending?: boolean;
  commandError?: string | null;
  onCommandSent?: () => void;
  onCommandError?: (msg: string) => void;
};

type MovementMode = "posture" | "walk" | "run";

export function ManualControlView({
  robotId,
  commandPending = false,
  commandError = null,
  onCommandSent,
  onCommandError,
}: ManualControlViewProps) {
  const [activeMode, setActiveMode] = useState<MovementMode | null>(null);
  const [lastCommandError, setLastCommandError] = useState<string | null>(null);
  const [localPending, setLocalPending] = useState(false);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMoveRef = useRef<JoystickOutput | null>(null);

  const isPending = commandPending || localPending;

  const executeCommand = useCallback(
    async (req: RobotCommandRequest) => {
      const isMove = req.command === "move";
      if (!isMove) setLocalPending(true);
      try {
        await sendCommand(robotId, req);
        if (!isMove) {
          haptic.success();
          onCommandSent?.();
        }
        setLastCommandError(null);
      } catch (err) {
        haptic.error();
        const msg = err instanceof Error ? err.message : "Command failed";
        setLastCommandError(msg);
        onCommandError?.(msg);
      } finally {
        if (!isMove) setLocalPending(false);
      }
    },
    [robotId, onCommandSent, onCommandError]
  );

  const handleJoystickMove = useCallback(
    (output: JoystickOutput) => {
      lastMoveRef.current = output;
      if (output.magnitude < 0.05) {
        if (throttleRef.current) {
          clearTimeout(throttleRef.current);
          throttleRef.current = null;
        }
        executeCommand({
          command: "move",
          params: { direction: output.angle, speed: 0 },
        });
        return;
      }
      if (throttleRef.current) return;
      executeCommand({
        command: "move",
        params: { direction: output.angle, speed: output.magnitude },
      });
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
        const last = lastMoveRef.current;
        if (last && last.magnitude >= 0.05) {
          executeCommand({
            command: "move",
            params: { direction: last.angle, speed: last.magnitude },
          });
        }
      }, MOVE_THROTTLE_MS);
    },
    [executeCommand]
  );

  const handleJoystickRelease = useCallback(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }
    executeCommand({
      command: "move",
      params: { direction: 0, speed: 0 },
    });
  }, [executeCommand]);

  const handleModeClick = useCallback(
    async (mode: MovementMode) => {
      if (isPending) return;
      haptic.impact("medium");
      setActiveMode(mode);
      await executeCommand({ command: mode });
    },
    [isPending, executeCommand]
  );

  const handleHeadRotate = useCallback(
    (direction: "left" | "right") => {
      if (isPending) return;
      haptic.impact("light");
      executeCommand({
        command: "head_rotate",
        params: { direction, amount: 1 },
      });
    },
    [isPending, executeCommand]
  );

  const handleWaistRotate = useCallback(
    (direction: "left" | "right") => {
      if (isPending) return;
      haptic.impact("light");
      executeCommand({
        command: "waist_rotate",
        params: { direction, amount: 1 },
      });
    },
    [isPending, executeCommand]
  );

  const handleSafeStop = useCallback(() => {
    if (isPending) return;
    haptic.impact("heavy");
    executeCommand({ command: "safe_stop" });
  }, [isPending, executeCommand]);

  const displayError = commandError ?? lastCommandError;

  return (
    <div
      id="control-manage-panel"
      role="tabpanel"
      aria-labelledby="tab-manage"
      className="space-y-4"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black">
        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
        <span className="text-[13px] font-semibold uppercase tracking-wider">
          Remote operation mode
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        <div className="glass-card rounded-3xl p-4 flex flex-col items-center order-2 md:order-1">
          <motion.button
            onClick={handleSafeStop}
            disabled={isPending}
            className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-3 touch-target disabled:opacity-50"
            whileTap={isPending ? undefined : { scale: 0.95 }}
            aria-label="Emergency stop"
          >
            <AlertTriangle className="w-6 h-6 text-white fill-white" />
          </motion.button>
          <VirtualJoystick
            onMove={handleJoystickMove}
            onRelease={handleJoystickRelease}
            disabled={isPending}
            size={160}
            className="mb-3"
          />
          <motion.button
            onClick={() => handleModeClick("posture")}
            disabled={isPending}
            className={cn(
              "w-full min-h-[44px] rounded-2xl flex items-center justify-center gap-2 font-medium mb-2 touch-target",
              activeMode === "posture"
                ? "bg-yellow-500 text-black"
                : "glass-button-secondary text-muted-foreground hover:text-foreground"
            )}
            whileTap={isPending ? undefined : { scale: 0.98 }}
          >
            <User className="w-5 h-5" />
            <span className="text-[12px]">Posture</span>
          </motion.button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <motion.button
              onClick={() => handleModeClick("walk")}
              disabled={isPending}
              className={cn(
                "min-h-[44px] rounded-2xl flex flex-col items-center justify-center gap-1 font-medium touch-target",
                activeMode === "walk"
                  ? "bg-yellow-500 text-black"
                  : "glass-button-secondary text-muted-foreground hover:text-foreground"
              )}
              whileTap={isPending ? undefined : { scale: 0.98 }}
            >
              <Footprints className="w-5 h-5" />
              <span className="text-[11px]">Walk</span>
            </motion.button>
            <motion.button
              onClick={() => handleModeClick("run")}
              disabled={isPending}
              className={cn(
                "min-h-[44px] rounded-2xl flex flex-col items-center justify-center gap-1 font-medium touch-target",
                activeMode === "run"
                  ? "bg-yellow-500 text-black"
                  : "glass-button-secondary text-muted-foreground hover:text-foreground"
              )}
              whileTap={isPending ? undefined : { scale: 0.98 }}
            >
              <Zap className="w-5 h-5" />
              <span className="text-[11px]">Run</span>
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-center order-1 md:order-2">
          <RobotAvatar className="w-full max-w-[200px] aspect-square md:max-w-[220px]" />
        </div>

        <div className="glass-card rounded-3xl p-4 flex flex-col gap-4 order-3">
          <h3 className="text-[13px] font-semibold text-foreground text-center">
            Body control
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 justify-center">
              <motion.button
                onClick={() => handleHeadRotate("left")}
                disabled={isPending}
                className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center touch-target disabled:opacity-50"
                whileTap={isPending ? undefined : { scale: 0.95 }}
                aria-label="Rotate head left"
              >
                <RotateCcw className="w-5 h-5 text-primary" />
              </motion.button>
              <span className="flex items-center text-[12px] font-medium text-muted-foreground min-w-[80px] justify-center">
                Head
              </span>
              <motion.button
                onClick={() => handleHeadRotate("right")}
                disabled={isPending}
                className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center touch-target disabled:opacity-50"
                whileTap={isPending ? undefined : { scale: 0.95 }}
                aria-label="Rotate head right"
              >
                <RotateCcw className="w-5 h-5 text-primary scale-x-[-1]" />
              </motion.button>
            </div>
            <div className="flex gap-2 justify-center">
              <motion.button
                onClick={() => handleWaistRotate("left")}
                disabled={isPending}
                className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center touch-target disabled:opacity-50"
                whileTap={isPending ? undefined : { scale: 0.95 }}
                aria-label="Rotate waist left"
              >
                <RotateCcw className="w-5 h-5 text-primary" />
              </motion.button>
              <span className="flex items-center text-[12px] font-medium text-muted-foreground min-w-[80px] justify-center">
                Waist
              </span>
              <motion.button
                onClick={() => handleWaistRotate("right")}
                disabled={isPending}
                className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center touch-target disabled:opacity-50"
                whileTap={isPending ? undefined : { scale: 0.95 }}
                aria-label="Rotate waist right"
              >
                <RotateCcw className="w-5 h-5 text-primary scale-x-[-1]" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {displayError && (
        <div className="px-4 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/30 text-sm font-medium">
          {displayError}
        </div>
      )}
    </div>
  );
}

import { cn } from "../ui/utils";

type RobotAvatarProps = {
  className?: string;
};

export function RobotAvatar({ className }: RobotAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-3xl bg-black overflow-hidden",
        "ring-1 ring-white/10",
        className
      )}
    >
      <img
        src="/robot-avatar.png"
        alt="Robot"
        className="w-full h-full object-contain max-h-[280px]"
      />
    </div>
  );
}

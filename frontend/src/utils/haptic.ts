/**
 * Telegram WebApp Haptic Feedback utilities.
 * Safe to use when not in Telegram (e.g. local dev) - calls are no-ops.
 */

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "success" | "error" | "warning";

function getHaptic() {
  return (window as unknown as {
    Telegram?: {
      WebApp?: {
        HapticFeedback?: {
          impactOccurred?: (style: ImpactStyle) => void;
          notificationOccurred?: (type: NotificationType) => void;
          selectionChanged?: () => void;
        };
      };
    };
  }).Telegram?.WebApp?.HapticFeedback;
}

export const haptic = {
  impact: (style: ImpactStyle = "light") => {
    getHaptic()?.impactOccurred?.(style);
  },
  success: () => getHaptic()?.notificationOccurred?.("success"),
  error: () => getHaptic()?.notificationOccurred?.("error"),
  warning: () => getHaptic()?.notificationOccurred?.("warning"),
  selection: () => getHaptic()?.selectionChanged?.(),
};

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { NftItem } from "../../api/nft";
import { buildGetgemsUrl } from "../../api/nft";
import { haptic } from "../../utils/haptic";
import { isInTelegram } from "../../utils/telegram";

function openGetgems(url: string): void {
  haptic.impact("light");
  const tg = (window as unknown as { Telegram?: { WebApp?: { openLink?: (url: string) => void } } })
    .Telegram?.WebApp;
  if (isInTelegram() && tg?.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

interface BuyButtonProps {
  item: NftItem;
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function BuyButton({ item, className, size = "md", showIcon = true }: BuyButtonProps) {
  const url = buildGetgemsUrl(item);
  const isForSale = !!item.sale?.price;

  const sizeClasses = {
    sm: "min-h-[36px] py-2 text-sm px-3",
    md: "min-h-[44px] py-3 text-[15px] px-4",
    lg: "min-h-[48px] py-4 text-base px-6",
  };

  return (
    <motion.button
      type="button"
      onClick={() => openGetgems(url)}
      className={`${sizeClasses[size]} bg-primary text-primary-foreground font-medium rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${className ?? ""}`}
      whileTap={{ scale: 0.98 }}
      disabled={!isForSale}
    >
      {showIcon && <ExternalLink className="w-4 h-4 flex-shrink-0" />}
      {isForSale ? "Buy on Getgems" : "View on Getgems"}
    </motion.button>
  );
}

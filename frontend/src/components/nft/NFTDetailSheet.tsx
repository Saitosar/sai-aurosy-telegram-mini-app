import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { NftItem } from "../../api/nft";
import {
  formatPriceNanoton,
  getNftImageUrl,
  getNftName,
} from "../../api/nft";
import { haptic } from "../../utils/haptic";
import { BottomSheet } from "../ui/BottomSheet";
import { BuyButton } from "./BuyButton";

interface NFTDetailSheetProps {
  item: NftItem | null;
  open: boolean;
  onClose: () => void;
}

export function NFTDetailSheet({ item, open, onClose }: NFTDetailSheetProps) {
  if (!item) return null;

  const imageUrl = getNftImageUrl(item, "1500x1500") ?? getNftImageUrl(item);
  const name = getNftName(item);
  const description = item.metadata?.description;
  const price = item.sale?.price?.value;
  const attributes = item.metadata?.attributes;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight truncate">
            {name}
          </h2>
          {item.collection?.name && (
            <p className="text-sm text-muted-foreground mt-1">
              {item.collection.name}
            </p>
          )}
        </div>
        <motion.button
          onClick={() => {
            haptic.impact("light");
            onClose();
          }}
          className="glass-button-secondary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted/50 rounded-full transition-colors text-foreground touch-target flex-shrink-0"
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="aspect-square glass-icon-container rounded-2xl mb-6 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain z-10"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-muted-foreground text-6xl">
            #
          </div>
        )}
      </div>

      {price && (
        <div className="mb-6">
          <h3 className="text-[13px] font-semibold text-foreground mb-1">Price</h3>
          <p className="text-lg font-semibold text-primary">
            {formatPriceNanoton(price)}
          </p>
        </div>
      )}

      {description && (
        <div className="mb-6">
          <h3 className="text-[13px] font-semibold text-foreground mb-3">Description</h3>
          <p className="text-muted-foreground leading-relaxed text-[15px]">
            {description}
          </p>
        </div>
      )}

      {attributes && attributes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[13px] font-semibold text-foreground mb-3">Attributes</h3>
          <div className="flex flex-wrap gap-2">
            {attributes.map((a, i) => (
              <div
                key={i}
                className="inline-flex flex-col px-3 py-2 bg-muted/50 rounded-xl"
              >
                <span className="text-[11px] text-muted-foreground">{a.trait_type}</span>
                <span className="text-[13px] font-medium text-foreground">{a.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <BuyButton item={item} size="lg" className="w-full" />
    </BottomSheet>
  );
}

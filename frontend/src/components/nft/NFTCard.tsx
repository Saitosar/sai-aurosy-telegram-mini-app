import { motion } from "framer-motion";
import type { NftItem } from "../../api/nft";
import {
  formatPriceNanoton,
  getNftImageUrl,
  getNftName,
} from "../../api/nft";
import { BuyButton } from "./BuyButton";

interface NFTCardProps {
  item: NftItem;
  index?: number;
  onSelect?: (item: NftItem) => void;
}

export function NFTCard({ item, index = 0, onSelect }: NFTCardProps) {
  const imageUrl = getNftImageUrl(item);
  const name = getNftName(item);
  const price = item.sale?.price?.value;
  const attributes = item.metadata?.attributes?.slice(0, 2);

  return (
    <motion.div
      role="group"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="glass-card rounded-3xl overflow-hidden hover:bg-muted/30 transition-all flex flex-col h-full"
    >
      <button
        type="button"
        className="flex flex-col flex-1 min-w-0 text-left w-full"
        onClick={() => onSelect?.(item)}
      >
        <div className="aspect-square rounded-t-3xl overflow-hidden bg-black/40 border-b border-border">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              #
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <h4 className="font-semibold text-foreground tracking-tight truncate text-[15px]">
            {name}
          </h4>
          {attributes && attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {attributes.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 bg-primary/10 rounded-md text-[11px] font-medium text-primary"
                >
                  {a.value}
                </span>
              ))}
            </div>
          )}
          {price && (
            <p className="mt-2 text-sm font-medium text-primary">
              {formatPriceNanoton(price)}
            </p>
          )}
        </div>
      </button>
      <div className="p-4 pt-0">
        <BuyButton item={item} size="sm" className="w-full" />
      </div>
    </motion.div>
  );
}

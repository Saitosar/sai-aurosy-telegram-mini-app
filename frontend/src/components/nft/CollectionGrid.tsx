import type { NftItem } from "../../api/nft";
import { Skeleton } from "../ui/Skeleton";
import { NFTCard } from "./NFTCard";

interface CollectionGridProps {
  items: NftItem[];
  loading?: boolean;
  onSelectItem?: (item: NftItem) => void;
}

export function CollectionGrid({ items, loading, onSelectItem }: CollectionGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="glass-card rounded-3xl overflow-hidden flex flex-col"
          >
            <Skeleton className="aspect-square rounded-t-3xl" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-[15px]">No NFTs in this collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, i) => (
        <NFTCard
          key={item.address}
          item={item}
          index={i}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
}

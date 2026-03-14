import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NftItem } from "../../api/nft";
import {
  getNftCollection,
  getNftCollectionItems,
  getNftCollections,
} from "../../api/nft";
import { CollectionGrid } from "../../components/nft/CollectionGrid";
import { NFTDetailSheet } from "../../components/nft/NFTDetailSheet";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { haptic } from "../../utils/haptic";

export function NFTMarketplaceScreen() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<string[]>([]);

  const handleBack = useCallback(() => {
    haptic.impact("light");
    navigate(-1);
  }, [navigate]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState<string>("");
  const [items, setItems] = useState<NftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NftItem | null>(null);

  useEffect(() => {
    getNftCollections()
      .then((res) => {
        setCollections(res.addresses);
        if (res.addresses.length > 0) {
          setSelectedCollection((prev) => prev ?? res.addresses[0]);
        }
      })
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, []);

  const effectiveCollection = selectedCollection ?? collections[0];

  useEffect(() => {
    if (!effectiveCollection) return;
    setItemsLoading(true);
    getNftCollection(effectiveCollection)
      .then((col) => setCollectionName(col.metadata?.name ?? "Collection"))
      .catch(() => setCollectionName(""));
    getNftCollectionItems(effectiveCollection)
      .then((res) => setItems(res.nft_items))
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, [effectiveCollection]);

  const hasMultipleCollections = collections.length > 1;

  return (
    <div className="min-h-full pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <ScreenHeader
          title="NFT Marketplace"
          subtitle={collectionName || "Browse NFTs"}
          onBack={handleBack}
          className="mb-6"
        />

        {hasMultipleCollections && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {collections.map((addr) => (
              <button
                key={addr}
                type="button"
                onClick={() => setSelectedCollection(addr)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  selectedCollection === addr
                    ? "bg-primary text-primary-foreground"
                    : "glass-button-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {addr.slice(0, 8)}...
              </button>
            ))}
          </div>
        )}

        <CollectionGrid
          items={items}
          loading={loading || itemsLoading}
          onSelectItem={setSelectedItem}
        />
      </div>

      <NFTDetailSheet
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

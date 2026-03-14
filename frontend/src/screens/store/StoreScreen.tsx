import { useEffect, useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";
import type { StoreItem } from "shared";
import { getStoreItems } from "../../api/store";
import { haptic } from "../../utils/haptic";
import { Skeleton } from "../../components/ui/Skeleton";

const ORDER_TELEGRAM_USERNAME = "Arif_Mammadov1";

function openOrderChat(item?: StoreItem) {
  const text = item ? `Hi! I'm interested in ${item.name}` : undefined;
  const url = text
    ? `https://t.me/${ORDER_TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`
    : `https://t.me/${ORDER_TELEGRAM_USERNAME}`;
  const tg = (window as unknown as { Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } } })
    .Telegram?.WebApp;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function StoreScreen() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  useEffect(() => {
    getStoreItems()
      .then(setStoreItems)
      .catch(() => setStoreItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-full pb-20">
        <div className="px-6 py-8">
          <Skeleton className="mb-6 h-8 w-40" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-4 flex flex-col"
              >
                <Skeleton className="aspect-square rounded-xl mb-2" />
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-3 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Robot Store</h1>

        <div className="grid grid-cols-2 gap-4">
          {storeItems.map((item) => (
            <div
              key={item.id}
              role="group"
              className="glass-card rounded-2xl p-4 hover:bg-muted/30 transition-all flex flex-col h-full"
            >
              <button
                type="button"
                onClick={() => {
                  haptic.impact("light");
                  setSelectedItem(item);
                }}
                className="text-left group flex flex-col flex-1 min-w-0"
              >
                <div className="glass-icon-container aspect-square rounded-xl mb-2 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bot className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                {item.model && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 bg-toxic/10 rounded-md">
                      <span className="text-[11px] font-medium text-toxic">
                        {item.model}
                      </span>
                    </span>
                  </div>
                )}
                <h4 className="font-semibold text-foreground tracking-tight mb-1 text-[15px]">{item.name}</h4>
                <p className="text-[12px] text-muted-foreground line-clamp-1 leading-relaxed">{item.description}</p>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  haptic.impact("light");
                  openOrderChat(item);
                }}
                className="w-full mt-3 py-2.5 bg-primary text-primary-foreground font-medium text-[14px] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-2xl rounded-t-[2rem] p-6 max-h-[85vh] overflow-y-auto border-t border-border bg-background/95 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-1">{selectedItem.name}</h2>
                {selectedItem.model && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-toxic/10 rounded-md mt-2">
                    <span className="text-[12px] font-medium text-toxic">
                      {selectedItem.model}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  haptic.impact("light");
                  setSelectedItem(null);
                }}
                className="glass-button-secondary p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video glass-icon-container rounded-2xl mb-8 relative overflow-hidden">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Bot className="w-24 h-24 text-primary" />
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-[13px] font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{selectedItem.description}</p>
            </div>

            {selectedItem.specs && selectedItem.specs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[13px] font-semibold text-foreground mb-3">Specifications</h3>
                <ul className="space-y-3">
                  {selectedItem.specs.map((spec, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground text-[15px]">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${index % 2 === 0 ? "bg-primary" : "bg-toxic"}`} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  haptic.impact("light");
                  openOrderChat(selectedItem);
                }}
                className="w-full py-4 bg-primary text-primary-foreground font-medium text-[16px] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

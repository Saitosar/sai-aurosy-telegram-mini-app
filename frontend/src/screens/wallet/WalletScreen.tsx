import { useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { haptic } from "../../utils/haptic";

const MOCK_NFTS = [
  {
    id: "1",
    name: "AGIBOT X2",
    description: "Elite combat unit",
    image: "/agibot-x2.png",
    rarity: "Legendary",
  },
  {
    id: "2",
    name: "AGIBOT G2",
    description: "Guardian protocol",
    image: "/agibot-g2.png",
    rarity: "Epic",
  },
  {
    id: "3",
    name: "AGIBOT C5",
    description: "Stealth recon model",
    image: "/agibot-c5.png",
    rarity: "Rare",
  },
];

export function WalletScreen() {
  const navigate = useNavigate();
  const handleBack = useCallback(() => {
    haptic.impact("light");
    navigate(-1);
  }, [navigate]);

  return (
    <div className="min-h-full pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 px-4 sm:px-6 py-8">
        <ScreenHeader
          title="TON Wallet"
          subtitle="Connect wallet and view address"
          onBack={handleBack}
          className="mb-6"
        />
        <div className="space-y-4">
          {MOCK_NFTS.map((nft, i) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-card rounded-3xl overflow-hidden hover:bg-muted/30 transition-all group"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-black/40 border border-border transition-colors">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[10px] font-bold tracking-wider text-primary/90 mb-0.5">
                    {nft.rarity}
                  </span>
                  <h3 className="font-semibold text-[17px] text-foreground tracking-tight truncate">
                    {nft.name}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {nft.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

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
  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">NFT</h1>
        <div className="space-y-4">
          {MOCK_NFTS.map((nft, i) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] transition-all group"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-primary/30 transition-colors">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary/90 mb-0.5">
                    {nft.rarity}
                  </span>
                  <h3 className="font-semibold text-[17px] text-white tracking-tight truncate">
                    {nft.name}
                  </h3>
                  <p className="text-[13px] text-[var(--tg-theme-hint-color,#a1a1aa)] mt-0.5">
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

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Copy, LogOut } from "lucide-react";
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";

function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function TonWalletSection() {
  const address = useTonAddress();
  const { open } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
  };

  const isConnected = Boolean(address);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
          </div>
          <h3 className="text-white font-semibold">TON Wallet</h3>
        </div>

        {!isConnected ? (
          <motion.button
            onClick={() => open()}
            className="w-full py-4 bg-primary text-primary-foreground font-bold text-[16px] rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Wallet className="w-5 h-5" />
            Connect TON Wallet
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl glass-button-secondary">
              <code className="flex-1 text-sm font-mono text-[#a0a0a0] truncate tabular-nums">
                {truncateAddress(address)}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#a0a0a0] hover:text-white"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-primary font-medium">Copied!</p>
            )}
            <button
              onClick={handleDisconnect}
              className="w-full py-2.5 glass-button-secondary text-[#a0a0a0] hover:text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

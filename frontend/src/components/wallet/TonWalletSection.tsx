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
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground font-semibold">TON Wallet</h3>
        </div>

        {!isConnected ? (
          <motion.button
            onClick={() => open()}
            className="w-full py-4 bg-primary text-primary-foreground font-medium text-[16px] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Wallet className="w-5 h-5" />
            Connect TON Wallet
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl glass-button-secondary">
              <code className="flex-1 text-sm font-mono text-muted-foreground truncate tabular-nums">
                {truncateAddress(address)}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
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
              className="w-full py-2.5 glass-button-secondary text-muted-foreground hover:text-foreground text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
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

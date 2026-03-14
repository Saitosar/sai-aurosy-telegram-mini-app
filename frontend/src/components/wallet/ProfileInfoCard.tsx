import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Wallet, Copy, LogOut, Eye, EyeOff } from "lucide-react";
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import { getTelegramUser } from "../../utils/telegram";

function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

function maskedAddress(): string {
  return "••••••••••••••••••••";
}

function formatBalance(nanoton: string): string {
  const ton = Number(BigInt(nanoton)) / 1e9;
  return ton.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " TON";
}

export function ProfileInfoCard() {
  const address = useTonAddress();
  const { open } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [addressVisible, setAddressVisible] = useState(false);

  const user = getTelegramUser();
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "User"
    : "User";

  useEffect(() => {
    setAddressVisible(false);
  }, [address]);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    fetch(`https://tonapi.io/v2/accounts/${address}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const raw = data?.balance ?? data?.result;
        if (raw != null) {
          setBalance(formatBalance(String(raw)));
        } else {
          setBalance("—");
        }
      })
      .catch(() => {
        if (!cancelled) setBalance("—");
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

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
    <div className="glass-card-elevated rounded-3xl p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="glass-icon-container w-10 h-10 rounded-2xl flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground font-semibold">Profile info</h3>
        </div>

        <div className="text-foreground font-medium">
          {displayName}
        </div>

        {!isConnected ? (
          <motion.button
            onClick={() => open()}
            className="w-fit min-h-[44px] px-5 py-3 bg-primary text-primary-foreground font-medium text-sm rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Wallet className="w-4 h-4" />
            Connect TON wallet
          </motion.button>
        ) : (
          <div className="space-y-3">
            {balance !== null && (
              <div className="text-sm font-mono text-muted-foreground">
                Balance: <span className="text-primary font-medium">{balance}</span>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-2xl glass-button-secondary">
              <code className="flex-1 text-sm font-mono text-muted-foreground truncate tabular-nums">
                {addressVisible ? truncateAddress(address) : maskedAddress()}
              </code>
              <motion.button
                onClick={() => setAddressVisible(!addressVisible)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground touch-target"
                title={addressVisible ? "Hide address" : "Show address"}
                whileTap={{ scale: 0.98 }}
              >
                {addressVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </motion.button>
              {addressVisible && (
                <motion.button
                  onClick={handleCopy}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground touch-target"
                  title="Copy address"
                  whileTap={{ scale: 0.98 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
              )}
            </div>
            {copied && (
              <p className="text-xs text-primary font-medium">Copied!</p>
            )}
            <motion.button
              onClick={handleDisconnect}
              className="w-full min-h-[44px] py-3 glass-button-secondary text-muted-foreground hover:text-foreground text-sm font-medium rounded-2xl flex items-center justify-center gap-2 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

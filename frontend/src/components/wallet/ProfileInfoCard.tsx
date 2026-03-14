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
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="glass-icon-container w-10 h-10 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground font-semibold">Profile info</h3>
        </div>

        <div className="text-[var(--tg-theme-text-color,#fafafa)] font-medium">
          {displayName}
        </div>

        {!isConnected ? (
          <motion.button
            onClick={() => open()}
            className="w-fit px-5 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
            <div className="flex items-center gap-2 p-3 rounded-xl glass-button-secondary">
              <code className="flex-1 text-sm font-mono text-muted-foreground truncate tabular-nums">
                {addressVisible ? truncateAddress(address) : maskedAddress()}
              </code>
              <button
                onClick={() => setAddressVisible(!addressVisible)}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                title={addressVisible ? "Hide address" : "Show address"}
              >
                {addressVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {addressVisible && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
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

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, CreditCard } from "lucide-react";
import { useTonAddress } from "@tonconnect/ui-react";

type MockAction = "reserve" | "deposit" | null;

export function MockActions() {
  const address = useTonAddress();
  const [feedback, setFeedback] = useState<MockAction>(null);

  const isConnected = Boolean(address);

  const handleReserve = () => {
    setFeedback("reserve");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePayDeposit = () => {
    setFeedback("deposit");
    setTimeout(() => setFeedback(null), 3000);
  };

  if (!isConnected) return null;

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-foreground font-semibold text-[15px]">Quick Actions</h3>
        <div className="flex flex-col gap-4">
          <motion.button
            onClick={handleReserve}
            disabled={feedback !== null}
            className="w-full py-3 px-4 glass-button-secondary text-foreground font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors disabled:opacity-70"
            whileTap={{ scale: 0.99 }}
          >
            <Bot className="w-5 h-5 text-primary" />
            {feedback === "reserve" ? "Reserved!" : "Reserve Robot"}
          </motion.button>
          <motion.button
            onClick={handlePayDeposit}
            disabled={feedback !== null}
            className="w-full py-3 px-4 glass-button-secondary text-foreground font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors disabled:opacity-70"
            whileTap={{ scale: 0.99 }}
          >
            <CreditCard className="w-5 h-5 text-primary" />
            {feedback === "deposit" ? "Deposit paid!" : "Pay Demo Deposit"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

import { TonWalletSection } from "../../components/wallet/TonWalletSection";
import { MockActions } from "../../components/wallet/MockActions";

export function WalletScreen() {
  return (
    <div className="min-h-full pb-20">
      <div className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">TON Wallet</h1>
        <div className="space-y-4">
          <TonWalletSection />
          <MockActions />
        </div>
      </div>
    </div>
  );
}

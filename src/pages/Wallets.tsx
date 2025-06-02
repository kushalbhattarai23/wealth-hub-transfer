
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const wallets = [
  { name: "Khalti", balance: "NPR 0.00", created: "5/25/2025", currency: "NPR" },
  { name: "Esewa", balance: "NPR 0.00", created: "5/25/2025", currency: "NPR" },
  { name: "Machapuchhre", balance: "NPR 30,809.88", created: "5/25/2025", currency: "NPR" },
  { name: "NIC Asia", balance: "NPR 30.99", created: "5/25/2025", currency: "NPR" },
  { name: "IME Pay", balance: "NPR 1,000.00", created: "5/25/2025", currency: "NPR" },
  { name: "Laxmi Sunrise", balance: "NPR 12,972.40", created: "5/25/2025", currency: "NPR" },
  { name: "Prabhu", balance: "NPR 200.00", created: "5/25/2025", currency: "NPR" },
  { name: "Cash", balance: "NPR 765.00", created: "5/25/2025", currency: "NPR" }
];

export default function Wallets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
        <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          <span>Add Wallet</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{wallet.name}</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-2xl font-bold text-gray-900">{wallet.balance}</p>
              <p className="text-sm text-gray-500">Created {wallet.created}</p>
              <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                {wallet.currency}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

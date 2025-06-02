
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const transfers = [
  { id: 1, from: "Machapuchhre", to: "Cash", amount: "NPR 5,000.00", date: "Jun 01, 2025", status: "completed" },
  { id: 2, from: "Laxmi Sunrise", to: "Khalti", amount: "NPR 1,200.00", date: "May 30, 2025", status: "completed" },
  { id: 3, from: "Cash", to: "Esewa", amount: "NPR 500.00", date: "May 28, 2025", status: "pending" },
  { id: 4, from: "IME Pay", to: "NIC Asia", amount: "NPR 2,500.00", date: "May 25, 2025", status: "completed" }
];

export default function Transfers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          <span>New Transfer</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                    {transfer.from}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                    {transfer.to}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transfer.amount}</p>
                  <p className="text-sm text-gray-500">{transfer.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  transfer.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transfer.status}
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

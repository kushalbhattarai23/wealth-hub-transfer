
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const transactions = [
  { id: 1, name: "pizza", date: "Jun 01, 2025", wallet: "Laxmi Sunrise", amount: "-NPR 219.00", type: "expense", category: "Food" },
  { id: 2, name: "chatpate", date: "Jun 01, 2025", wallet: "Laxmi Sunrise", amount: "-NPR 80.00", type: "expense", category: "Food" },
  { id: 3, name: "recharge", date: "Jun 01, 2025", wallet: "Laxmi Sunrise", amount: "-NPR 100.00", type: "expense", category: "Phone Recharge" },
  { id: 4, name: "loan return", date: "May 31, 2025", wallet: "Cash", amount: "+NPR 200.00", type: "income", category: "Loan" },
  { id: 5, name: "travel to party", date: "May 30, 2025", wallet: "Laxmi Sunrise", amount: "-NPR 156.00", type: "expense", category: "Transportation" },
  { id: 6, name: "salary", date: "May 30, 2025", wallet: "Machapuchhre", amount: "+NPR 50,000.00", type: "income", category: "Salary" },
  { id: 7, name: "groceries", date: "May 29, 2025", wallet: "Cash", amount: "-NPR 2,500.00", type: "expense", category: "Food" },
  { id: 8, name: "internet bill", date: "May 28, 2025", wallet: "NIC Asia", amount: "-NPR 1,200.00", type: "expense", category: "Bills" }
];

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search transactions..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Wallet</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        transaction.type === 'income' ? 'bg-green-500' : 
                        transaction.category === 'Food' ? 'bg-orange-500' :
                        transaction.category === 'Phone Recharge' ? 'bg-purple-500' :
                        transaction.category === 'Transportation' ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {transaction.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{transaction.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                  <td className="py-3 px-4 text-gray-600">{transaction.wallet}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

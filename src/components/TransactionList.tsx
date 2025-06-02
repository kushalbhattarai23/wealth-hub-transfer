
import { ArrowRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "pizza",
    date: "Jun 01, 2025",
    wallet: "Laxmi Sunrise",
    amount: "-NPR 219.00",
    type: "expense",
    category: "Food"
  },
  {
    id: 2,
    name: "chatpate",
    date: "Jun 01, 2025", 
    wallet: "Laxmi Sunrise",
    amount: "-NPR 80.00",
    type: "expense",
    category: "Food"
  },
  {
    id: 3,
    name: "recharge",
    date: "Jun 01, 2025",
    wallet: "Laxmi Sunrise", 
    amount: "-NPR 100.00",
    type: "expense",
    category: "Phone Recharge"
  },
  {
    id: 4,
    name: "loan return",
    date: "May 31, 2025",
    wallet: "Cash",
    amount: "+NPR 200.00",
    type: "income",
    category: "Loan"
  },
  {
    id: 5,
    name: "travel to party",
    date: "May 30, 2025",
    wallet: "Laxmi Sunrise",
    amount: "-NPR 156.00", 
    type: "expense",
    category: "Transportation"
  }
];

export function TransactionList() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700">
          <span className="text-sm font-medium">View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                transaction.type === 'income' ? 'bg-green-500' : 
                transaction.category === 'Food' ? 'bg-orange-500' :
                transaction.category === 'Phone Recharge' ? 'bg-purple-500' :
                transaction.category === 'Transportation' ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {transaction.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.name}</p>
                <p className="text-sm text-gray-500">{transaction.date} • {transaction.wallet}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

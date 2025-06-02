
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const loans = [
  { id: 1, name: "Personal Loan - Bank", type: "borrowed", amount: "NPR 50,000.00", remaining: "NPR 35,000.00", dueDate: "2025-12-15", status: "active" },
  { id: 2, name: "Loan to Friend", type: "lent", amount: "NPR 15,000.00", remaining: "NPR 5,000.00", dueDate: "2025-08-20", status: "active" },
  { id: 3, name: "Emergency Loan", type: "borrowed", amount: "NPR 25,000.00", remaining: "NPR 0.00", dueDate: "2025-05-10", status: "completed" },
  { id: 4, name: "Business Advance", type: "lent", amount: "NPR 30,000.00", remaining: "NPR 30,000.00", dueDate: "2025-09-30", status: "active" }
];

export default function Loans() {
  const totalBorrowed = loans.filter(l => l.type === 'borrowed' && l.status === 'active').reduce((sum, loan) => sum + parseFloat(loan.remaining.replace(/[^0-9.-]+/g,"")), 0);
  const totalLent = loans.filter(l => l.type === 'lent' && l.status === 'active').reduce((sum, loan) => sum + parseFloat(loan.remaining.replace(/[^0-9.-]+/g,"")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          <span>New Loan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Borrowed</h3>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">NPR {totalBorrowed.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Amount you owe</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Lent</h3>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">NPR {totalLent.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Amount owed to you</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">All Loans</h2>
        
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  loan.type === 'borrowed' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {loan.type === 'borrowed' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{loan.name}</p>
                  <p className="text-sm text-gray-500">Due: {loan.dueDate}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${loan.type === 'borrowed' ? 'text-red-600' : 'text-green-600'}`}>
                  {loan.remaining}
                </p>
                <p className="text-sm text-gray-500">of {loan.amount}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  loan.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {loan.status}
                </span>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

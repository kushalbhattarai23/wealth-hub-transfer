
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', income: 45000, expenses: 32000 },
  { month: 'Feb', income: 48000, expenses: 35000 },
  { month: 'Mar', income: 52000, expenses: 38000 },
  { month: 'Apr', income: 47000, expenses: 33000 },
  { month: 'May', income: 50000, expenses: 39000 },
  { month: 'Jun', income: 0, expenses: 399 }
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Income vs Expenses</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `NPR ${value.toLocaleString()}`} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Savings Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `NPR ${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey={(data) => data.income - data.expenses} 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">NPR 45,778.27</p>
            <p className="text-sm text-gray-600">Current Balance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">NPR 242,000</p>
            <p className="text-sm text-gray-600">Total Income (6M)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">NPR 177,399</p>
            <p className="text-sm text-gray-600">Total Expenses (6M)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">NPR 64,601</p>
            <p className="text-sm text-gray-600">Net Savings (6M)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

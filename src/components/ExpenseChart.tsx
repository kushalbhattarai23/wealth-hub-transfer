
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Loan', value: 50, color: '#10B981' },
  { name: 'Food', value: 34, color: '#3B82F6' },
  { name: 'Transportation', value: 13, color: '#8B5CF6' },
  { name: 'Phone Recharge', value: 2, color: '#EC4899' },
  { name: 'Haircut', value: 1, color: '#F97316' }
];

export function ExpenseChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

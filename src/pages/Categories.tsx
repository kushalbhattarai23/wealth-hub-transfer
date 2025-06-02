
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Food", color: "#F97316", transactions: 45, total: "NPR 15,230" },
  { name: "Transportation", color: "#8B5CF6", transactions: 23, total: "NPR 8,450" },
  { name: "Phone Recharge", color: "#EC4899", transactions: 12, total: "NPR 3,200" },
  { name: "Bills", color: "#EF4444", transactions: 8, total: "NPR 12,500" },
  { name: "Entertainment", color: "#06B6D4", transactions: 15, total: "NPR 6,800" },
  { name: "Shopping", color: "#84CC16", transactions: 20, total: "NPR 9,750" },
  { name: "Healthcare", color: "#F59E0B", transactions: 6, total: "NPR 4,200" },
  { name: "Education", color: "#10B981", transactions: 4, total: "NPR 2,500" }
];

export default function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{category.total}</p>
              <p className="text-sm text-gray-500">{category.transactions} transactions</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

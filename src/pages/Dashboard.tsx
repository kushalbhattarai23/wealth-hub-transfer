
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Wallet</span>
          </Button>
          <Button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600">
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          value="$45,778.27"
          subtitle="Across 8 wallets"
          icon={<Wallet className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="This Month Income"
          value="$0.00"
          subtitle="2 income transactions"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="This Month Expenses"
          value="$399.00"
          subtitle="19 expense transactions"
          icon={<TrendingDown className="w-5 h-5" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList />
        <ExpenseChart />
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        wallets (name),
        categories (name, color)
      `)
      .eq('user_id', user?.id)
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Error loading transactions');
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error deleting transaction');
      } else {
        toast.success('Transaction deleted successfully');
        loadTransactions();
      }
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction({
      ...transaction,
      amount: transaction.income || transaction.expense
    });
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button 
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => setShowForm(true)}
        >
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

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No transactions yet</p>
            <Button onClick={() => setShowForm(true)}>Add your first transaction</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Wallet</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {transaction.reason.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{transaction.reason}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.wallets?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {transaction.categories ? (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: transaction.categories.color }}
                          />
                          <span className="text-sm text-gray-600">{transaction.categories.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No category</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}NPR {(transaction.income || transaction.expense)?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionForm
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={loadTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
}

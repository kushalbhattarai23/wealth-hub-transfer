
import { useState, useEffect } from "react";
import { Plus, ArrowRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransferForm } from "@/components/forms/TransferForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Transfers() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransfers();
    }
  }, [user]);

  const loadTransfers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transfers')
      .select(`
        *,
        from_wallet:wallets!transfers_from_wallet_id_fkey (name, currency),
        to_wallet:wallets!transfers_to_wallet_id_fkey (name, currency)
      `)
      .eq('user_id', user?.id)
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Error loading transfers');
    } else {
      setTransfers(data || []);
    }
    setLoading(false);
  };

  const reverseTransferBalances = async (transfer: any) => {
    if (transfer.status !== 'completed') return;

    // Get current balances
    const { data: fromWallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', transfer.from_wallet_id)
      .single();
    
    const { data: toWallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', transfer.to_wallet_id)
      .single();

    if (!fromWallet || !toWallet) {
      throw new Error('Could not fetch wallet balances');
    }

    // Reverse the transfer: add back to from_wallet, subtract from to_wallet
    const { error: fromError } = await supabase
      .from('wallets')
      .update({ balance: fromWallet.balance + transfer.amount })
      .eq('id', transfer.from_wallet_id);

    if (fromError) throw fromError;

    const { error: toError } = await supabase
      .from('wallets')
      .update({ balance: toWallet.balance - transfer.amount })
      .eq('id', transfer.to_wallet_id);

    if (toError) throw toError;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transfer?')) {
      try {
        // Find the transfer to reverse its balance effects
        const transferToDelete = transfers.find(t => t.id === id);
        
        if (transferToDelete) {
          // Reverse wallet balances if the transfer was completed
          await reverseTransferBalances(transferToDelete);
        }

        const { error } = await supabase
          .from('transfers')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Transfer deleted successfully');
        loadTransfers();
      } catch (error: any) {
        console.error('Delete transfer error:', error);
        toast.error('Error deleting transfer');
      }
    }
  };

  const handleEdit = (transfer: any) => {
    setEditingTransfer(transfer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransfer(null);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <Button 
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>New Transfer</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {transfers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No transfers yet</p>
            <Button onClick={() => setShowForm(true)}>Create your first transfer</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                      {transfer.from_wallet?.name}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                      {transfer.to_wallet?.name}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transfer.from_wallet?.currency || 'NPR'} {transfer.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(transfer.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    transfer.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : transfer.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transfer.status}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(transfer)}>
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(transfer.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransferForm
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={loadTransfers}
        transfer={editingTransfer}
      />
    </div>
  );
}

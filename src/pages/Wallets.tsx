
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletForm } from "@/components/forms/WalletForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Wallets() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  const loadWallets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error loading wallets');
    } else {
      setWallets(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error deleting wallet');
      } else {
        toast.success('Wallet deleted successfully');
        loadWallets();
      }
    }
  };

  const handleEdit = (wallet: any) => {
    setEditingWallet(wallet);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingWallet(null);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
        <Button 
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Wallet</span>
        </Button>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No wallets yet</p>
          <Button onClick={() => setShowForm(true)}>Create your first wallet</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{wallet.name}</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(wallet)}>
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(wallet.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-900">{wallet.currency} {wallet.balance.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Created {new Date(wallet.created_at).toLocaleDateString()}</p>
                <div className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                  {wallet.currency}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WalletForm
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={loadWallets}
        wallet={editingWallet}
      />
    </div>
  );
}

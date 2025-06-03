
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TransferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  transfer?: any;
}

export function TransferForm({ open, onOpenChange, onSuccess, transfer }: TransferFormProps) {
  const [amount, setAmount] = useState(transfer?.amount || '');
  const [fromWalletId, setFromWalletId] = useState(transfer?.from_wallet_id || '');
  const [toWalletId, setToWalletId] = useState(transfer?.to_wallet_id || '');
  const [description, setDescription] = useState(transfer?.description || '');
  const [date, setDate] = useState(transfer?.date || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(transfer?.status || 'completed');
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  useEffect(() => {
    if (transfer) {
      setAmount(transfer.amount);
      setFromWalletId(transfer.from_wallet_id);
      setToWalletId(transfer.to_wallet_id);
      setDescription(transfer.description || '');
      setDate(transfer.date);
      setStatus(transfer.status);
    }
  }, [transfer]);

  const loadWallets = async () => {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user?.id);
    
    if (!error && data) {
      setWallets(data);
    }
  };

  const updateWalletBalances = async (fromWalletId: string, toWalletId: string, amount: number, isReversal = false) => {
    const multiplier = isReversal ? -1 : 1;
    
    // Get current balances
    const { data: fromWallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', fromWalletId)
      .single();
    
    const { data: toWallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', toWalletId)
      .single();

    if (!fromWallet || !toWallet) {
      throw new Error('Could not fetch wallet balances');
    }

    // Update from wallet (decrease balance)
    const { error: fromError } = await supabase
      .from('wallets')
      .update({ balance: fromWallet.balance - (amount * multiplier) })
      .eq('id', fromWalletId);

    if (fromError) throw fromError;

    // Update to wallet (increase balance)
    const { error: toError } = await supabase
      .from('wallets')
      .update({ balance: toWallet.balance + (amount * multiplier) })
      .eq('id', toWalletId);

    if (toError) throw toError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (fromWalletId === toWalletId) {
      toast.error('Source and destination wallets cannot be the same');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      toast.error('Transfer amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const transferData = {
        amount: transferAmount,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        description,
        date,
        status,
        user_id: user.id,
      };

      if (transfer) {
        // For updates, first reverse the old transfer effect on wallet balances
        if (transfer.status === 'completed') {
          await updateWalletBalances(transfer.from_wallet_id, transfer.to_wallet_id, transfer.amount, true);
        }

        const { error } = await supabase
          .from('transfers')
          .update(transferData)
          .eq('id', transfer.id);
        
        if (error) throw error;

        // Apply new transfer effect on wallet balances if status is completed
        if (status === 'completed') {
          await updateWalletBalances(fromWalletId, toWalletId, transferAmount);
        }

        toast.success('Transfer updated successfully!');
      } else {
        const { error } = await supabase
          .from('transfers')
          .insert([transferData]);
        
        if (error) throw error;

        // Update wallet balances only if status is completed
        if (status === 'completed') {
          await updateWalletBalances(fromWalletId, toWalletId, transferAmount);
        }

        toast.success('Transfer created successfully!');
      }

      onSuccess();
      onOpenChange(false);
      setAmount('');
      setFromWalletId('');
      setToWalletId('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('completed');
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Error processing transfer');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transfer ? 'Edit Transfer' : 'New Transfer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-wallet">From Wallet</Label>
              <Select value={fromWalletId} onValueChange={setFromWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} (Balance: {wallet.currency} {wallet.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-wallet">To Wallet</Label>
              <Select value={toWalletId} onValueChange={setToWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} (Balance: {wallet.currency} {wallet.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Transfer description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : transfer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

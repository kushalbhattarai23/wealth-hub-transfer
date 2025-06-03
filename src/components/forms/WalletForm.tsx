
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WalletFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  wallet?: any;
}

export function WalletForm({ open, onOpenChange, onSuccess, wallet }: WalletFormProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('NPR');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Initialize form with existing data when wallet changes
  useEffect(() => {
    if (wallet) {
      setName(wallet.name || '');
      setBalance(wallet.balance?.toString() || '');
      setCurrency(wallet.currency || 'NPR');
    } else {
      setName('');
      setBalance('');
      setCurrency('NPR');
    }
  }, [wallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const walletData = {
        name,
        balance: parseFloat(balance) || 0,
        currency,
        user_id: user.id,
      };

      if (wallet) {
        const { error } = await supabase
          .from('wallets')
          .update(walletData)
          .eq('id', wallet.id);
        if (error) throw error;
        toast.success('Wallet updated successfully!');
      } else {
        const { error } = await supabase
          .from('wallets')
          .insert([walletData]);
        if (error) throw error;
        toast.success('Wallet created successfully!');
      }

      onSuccess();
      onOpenChange(false);
      setName('');
      setBalance('');
      setCurrency('NPR');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{wallet ? 'Edit Wallet' : 'Add New Wallet'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Khalti, Cash, Bank Account"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NPR">NPR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : wallet ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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

interface LoanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  loan?: any;
}

export function LoanForm({ open, onOpenChange, onSuccess, loan }: LoanFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('borrowed');
  const [amount, setAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Initialize form with existing data when loan changes
  useEffect(() => {
    if (loan) {
      setName(loan.name || '');
      setType(loan.type || 'borrowed');
      setAmount(loan.amount?.toString() || '');
      setRemainingAmount(loan.remaining_amount?.toString() || '');
      setDueDate(loan.due_date || '');
      setStatus(loan.status || 'active');
      setDescription(loan.description || '');
    } else {
      setName('');
      setType('borrowed');
      setAmount('');
      setRemainingAmount('');
      setDueDate('');
      setStatus('active');
      setDescription('');
    }
  }, [loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const loanData = {
        name,
        type,
        amount: parseFloat(amount),
        remaining_amount: parseFloat(remainingAmount) || parseFloat(amount),
        due_date: dueDate || null,
        status,
        description,
        user_id: user.id,
      };

      if (loan) {
        const { error } = await supabase
          .from('loans')
          .update(loanData)
          .eq('id', loan.id);
        if (error) throw error;
        toast.success('Loan updated successfully!');
      } else {
        const { error } = await supabase
          .from('loans')
          .insert([loanData]);
        if (error) throw error;
        toast.success('Loan created successfully!');
      }

      onSuccess();
      onOpenChange(false);
      setName('');
      setType('borrowed');
      setAmount('');
      setRemainingAmount('');
      setDueDate('');
      setStatus('active');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{loan ? 'Edit Loan' : 'New Loan'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Personal Loan, Loan to Friend"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrowed">Borrowed (I owe)</SelectItem>
                  <SelectItem value="lent">Lent (Owed to me)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount</Label>
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
            <div className="space-y-2">
              <Label htmlFor="remaining">Remaining Amount</Label>
              <Input
                id="remaining"
                type="number"
                step="0.01"
                value={remainingAmount}
                onChange={(e) => setRemainingAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (Optional)</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about the loan..."
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : loan ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

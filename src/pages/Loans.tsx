
import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanForm } from "@/components/forms/LoanForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Loans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLoans();
    }
  }, [user]);

  const loadLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error loading loans');
    } else {
      setLoans(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this loan?')) {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error deleting loan');
      } else {
        toast.success('Loan deleted successfully');
        loadLoans();
      }
    }
  };

  const handleEdit = (loan: any) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLoan(null);
  };

  const totalBorrowed = loans
    .filter(l => l.type === 'borrowed' && l.status === 'active')
    .reduce((sum, loan) => sum + parseFloat(loan.remaining_amount || 0), 0);
  
  const totalLent = loans
    .filter(l => l.type === 'lent' && l.status === 'active')
    .reduce((sum, loan) => sum + parseFloat(loan.remaining_amount || 0), 0);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <Button 
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>New Loan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Borrowed</h3>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">NPR {totalBorrowed.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Amount you owe</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Lent</h3>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">NPR {totalLent.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Amount owed to you</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">All Loans</h2>
        
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No loans yet</p>
            <Button onClick={() => setShowForm(true)}>Add your first loan</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    loan.type === 'borrowed' ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {loan.type === 'borrowed' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{loan.name}</p>
                    <p className="text-sm text-gray-500">
                      Due: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${loan.type === 'borrowed' ? 'text-red-600' : 'text-green-600'}`}>
                    NPR {loan.remaining_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">of NPR {loan.amount.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    loan.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : loan.status === 'overdue'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {loan.status}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(loan)}>
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(loan.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LoanForm
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={loadLoans}
        loan={editingLoan}
      />
    </div>
  );
}

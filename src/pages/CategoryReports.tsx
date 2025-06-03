
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CategoryReportData {
  category_id: string;
  category_name: string;
  category_color: string;
  total_income: number;
  total_expense: number;
}

export default function CategoryReports() {
  const [reportData, setReportData] = useState<CategoryReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportType, setReportType] = useState("custom");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentPeriod("monthly");
    }
  }, [user]);

  const setCurrentPeriod = (period: string) => {
    const now = new Date();
    let from: Date;
    let to: Date = new Date(now);

    switch (period) {
      case "weekly":
        from = new Date(now);
        from.setDate(now.getDate() - now.getDay()); // Start of current week
        to.setDate(from.getDate() + 6); // End of current week
        break;
      case "monthly":
        from = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month
        break;
      case "yearly":
        from = new Date(now.getFullYear(), 0, 1); // Start of current year
        to = new Date(now.getFullYear(), 11, 31); // End of current year
        break;
      default:
        return;
    }

    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(to.toISOString().split('T')[0]);
    setReportType(period);
    loadReportData(from.toISOString().split('T')[0], to.toISOString().split('T')[0]);
  };

  const loadReportData = async (fromDate?: string, toDate?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const from = fromDate || dateFrom;
      const to = toDate || dateTo;

      if (!from || !to) {
        toast.error("Please select date range");
        setLoading(false);
        return;
      }

      // Get all transactions within date range with categories
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          category_id,
          income,
          expense,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .gte('date', from)
        .lte('date', to);

      if (error) throw error;

      // Also get transactions without categories
      const { data: uncategorizedTransactions, error: uncategorizedError } = await supabase
        .from('transactions')
        .select('income, expense')
        .eq('user_id', user.id)
        .is('category_id', null)
        .gte('date', from)
        .lte('date', to);

      if (uncategorizedError) throw uncategorizedError;

      // Process data by category
      const categoryMap = new Map<string, CategoryReportData>();

      // Process categorized transactions
      transactions?.forEach(transaction => {
        if (transaction.categories) {
          const key = transaction.category_id!;
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              category_id: key,
              category_name: transaction.categories.name,
              category_color: transaction.categories.color,
              total_income: 0,
              total_expense: 0,
            });
          }
          
          const categoryData = categoryMap.get(key)!;
          categoryData.total_income += transaction.income || 0;
          categoryData.total_expense += transaction.expense || 0;
        }
      });

      // Add uncategorized transactions if any
      if (uncategorizedTransactions && uncategorizedTransactions.length > 0) {
        const uncategorizedIncome = uncategorizedTransactions.reduce((sum, t) => sum + (t.income || 0), 0);
        const uncategorizedExpense = uncategorizedTransactions.reduce((sum, t) => sum + (t.expense || 0), 0);
        
        if (uncategorizedIncome > 0 || uncategorizedExpense > 0) {
          categoryMap.set('uncategorized', {
            category_id: 'uncategorized',
            category_name: 'Uncategorized',
            category_color: '#6B7280',
            total_income: uncategorizedIncome,
            total_expense: uncategorizedExpense,
          });
        }
      }

      setReportData(Array.from(categoryMap.values()));
    } catch (error: any) {
      toast.error('Error loading report data: ' + error.message);
    }
    setLoading(false);
  };

  const handleCustomDateFilter = () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select both start and end dates");
      return;
    }
    setReportType("custom");
    loadReportData();
  };

  const totalIncome = reportData.reduce((sum, item) => sum + item.total_income, 0);
  const totalExpense = reportData.reduce((sum, item) => sum + item.total_expense, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Category Reports</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Quick Filters</Label>
              <div className="flex gap-2">
                <Button 
                  variant={reportType === "weekly" ? "default" : "outline"}
                  onClick={() => setCurrentPeriod("weekly")}
                  size="sm"
                >
                  This Week
                </Button>
                <Button 
                  variant={reportType === "monthly" ? "default" : "outline"}
                  onClick={() => setCurrentPeriod("monthly")}
                  size="sm"
                >
                  This Month
                </Button>
                <Button 
                  variant={reportType === "yearly" ? "default" : "outline"}
                  onClick={() => setCurrentPeriod("yearly")}
                  size="sm"
                >
                  This Year
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button onClick={handleCustomDateFilter} disabled={loading}>
              Apply Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-lg font-semibold text-green-600">NPR {totalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expense</p>
                  <p className="text-lg font-semibold text-red-600">NPR {totalExpense.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Amount</p>
                  <p className={`text-lg font-semibold ${(totalIncome - totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    NPR {(totalIncome - totalExpense).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {reportData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No data found for the selected date range</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expense</TableHead>
                    <TableHead className="text-right">Net Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.category_id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.category_color }}
                          />
                          <span className="font-medium">{item.category_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        NPR {item.total_income.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-semibold">
                        NPR {item.total_expense.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        (item.total_income - item.total_expense) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        NPR {(item.total_income - item.total_expense).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

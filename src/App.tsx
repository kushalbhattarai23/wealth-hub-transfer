
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Wallets from "@/pages/Wallets";
import Transactions from "@/pages/Transactions";
import Transfers from "@/pages/Transfers";
import Loans from "@/pages/Loans";
import Categories from "@/pages/Categories";
import Reports from "@/pages/Reports";
import CategoryReports from "@/pages/CategoryReports";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import ProjectSelection from "@/pages/ProjectSelection";
import ShowVerseTracker from "@/pages/ShowVerseTracker";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/project-selection" element={<ProjectSelection />} />
              <Route path="/show-verse-tracker" element={<ShowVerseTracker />} />
              <Route element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="wallets" element={<Wallets />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transfers" element={<Transfers />} />
                <Route path="loans" element={<Loans />} />
                <Route path="categories" element={<Categories />} />
                <Route path="reports" element={<Reports />} />
                <Route path="category-reports" element={<CategoryReports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

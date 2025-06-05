
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../../show-verse-tracker/src/pages/Dashboard';
import { AuthProvider } from '../../show-verse-tracker/src/components/auth/AuthProvider';
import { Navigation } from '../../show-verse-tracker/src/components/Navigation';
import { Toaster } from '../../show-verse-tracker/src/components/ui/toaster';

export default function ShowVerseTracker() {
  const navigate = useNavigate();

  const handleBackToSelection = () => {
    localStorage.removeItem('selectedProject');
    navigate('/project-selection');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Show Verse Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBackToSelection}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
}

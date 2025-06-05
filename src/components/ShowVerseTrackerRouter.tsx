
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../show-verse-tracker/src/components/auth/AuthProvider';
import { Navigation } from '../../show-verse-tracker/src/components/Navigation';
import { Toaster } from '../../show-verse-tracker/src/components/ui/toaster';
import { Dashboard } from '../../show-verse-tracker/src/pages/Dashboard';
import { AdminPortal } from '../../show-verse-tracker/src/pages/AdminPortal';
import { PublicShows } from '../../show-verse-tracker/src/pages/PublicShows';
import { MyShows } from '../../show-verse-tracker/src/pages/MyShows';
import { PublicUniverses } from '../../show-verse-tracker/src/pages/PublicUniverses';
import { MyUniverses } from '../../show-verse-tracker/src/pages/MyUniverses';
import { UniversePage } from '../../show-verse-tracker/src/pages/UniversePage';
import { UniverseDetail } from '../../show-verse-tracker/src/pages/UniverseDetail';
import { ShowDetail } from '../../show-verse-tracker/src/pages/ShowDetail';
import { UniverseDashboard } from '../../show-verse-tracker/src/pages/UniverseDashboard';
import { SignIn } from '../../show-verse-tracker/src/pages/SignIn';
import { SignUp } from '../../show-verse-tracker/src/pages/SignUp';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShowVerseTrackerRouter: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToSelection = () => {
    localStorage.removeItem('selectedProject');
    navigate('/project-selection');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Show Verse Tracker</h1>
            <Button variant="outline" size="sm" onClick={handleBackToSelection}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
        
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/shows/public" element={<PublicShows />} />
            <Route path="/shows/my" element={<MyShows />} />
            <Route path="/universes/public" element={<PublicUniverses />} />
            <Route path="/universes/my" element={<MyUniverses />} />
            <Route path="/universes" element={<UniversePage />} />
            <Route path="/universe/:universeSlug" element={<UniverseDetail />} />
            <Route path="/universe/:universeSlug/dashboard" element={<UniverseDashboard />} />
            <Route path="/show/:showSlug" element={<ShowDetail />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </main>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
};

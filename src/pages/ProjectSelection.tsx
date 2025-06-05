
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Play, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectSelection() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProjectSelect = async (project: 'fintrackr' | 'showverse') => {
    setLoading(true);
    
    // Store the selected project in localStorage
    localStorage.setItem('selectedProject', project);
    
    if (project === 'fintrackr') {
      navigate('/');
    } else {
      // Navigate to show-verse-tracker dashboard
      navigate('/show-verse-tracker');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Choose which application you'd like to access</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProjectSelect('fintrackr')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">FinTrackr</CardTitle>
              <CardDescription>Personal Finance Management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Track your finances, manage wallets, monitor transactions, and generate detailed financial reports.
              </p>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600" 
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectSelect('fintrackr');
                }}
              >
                {loading ? 'Loading...' : 'Open FinTrackr'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProjectSelect('showverse')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Show Verse Tracker</CardTitle>
              <CardDescription>Entertainment Content Management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Track your favorite shows, movies, and entertainment content across different platforms and universes.
              </p>
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600" 
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectSelect('showverse');
                }}
              >
                {loading ? 'Loading...' : 'Open Show Verse Tracker'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

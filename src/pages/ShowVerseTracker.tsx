
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, ArrowLeft, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShowVerseTracker() {
  const navigate = useNavigate();

  const handleBackToSelection = () => {
    localStorage.removeItem('selectedProject');
    navigate('/project-selection');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Play className="text-white w-5 h-5" />
            </div>
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

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Show Verse Tracker</h2>
            <p className="text-gray-600">Manage your entertainment content and track your viewing progress</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shows</CardTitle>
                <CardDescription>Track TV series and episodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Show
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movies</CardTitle>
                <CardDescription>Track movies and franchises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Movie
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Universes</CardTitle>
                <CardDescription>Organize by cinematic universes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Universe
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>This is a placeholder for the Show Verse Tracker dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                When you add the show-verse-tracker folder to your project root, this dashboard will be updated 
                to integrate with that project's components and functionality.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Add the show-verse-tracker folder to your project root</li>
                  <li>• Import and integrate the existing components</li>
                  <li>• Update routing to include show-verse-tracker routes</li>
                  <li>• Customize this dashboard with actual functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

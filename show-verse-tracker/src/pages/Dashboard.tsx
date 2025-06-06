
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalShows: number;
  watchedEpisodes: number;
  completedShows: number;
  totalUniverses: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalShows: 0,
    watchedEpisodes: 0,
    completedShows: 0,
    totalUniverses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total shows
      const { count: showsCount } = await supabase
        .from('shows')
        .select('*', { count: 'exact', head: true });

      // Fetch watched episodes by user
      const { count: watchedCount } = await supabase
        .from('user_episode_status')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'watched');

      // Fetch total universes
      const { count: universesCount } = await supabase
        .from('universes')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalShows: showsCount || 0,
        watchedEpisodes: watchedCount || 0,
        completedShows: 0, // Would need complex query to calculate
        totalUniverses: universesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to Show Verse Tracker</p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
              <span className="text-2xl">📺</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShows}</div>
              <p className="text-xs text-muted-foreground">
                Available in the database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watched Episodes</CardTitle>
              <span className="text-2xl">👁️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.watchedEpisodes}</div>
              <p className="text-xs text-muted-foreground">
                Episodes you've watched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Shows</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedShows}</div>
              <p className="text-xs text-muted-foreground">
                Shows fully watched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Universes</CardTitle>
              <span className="text-2xl">🌌</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUniverses}</div>
              <p className="text-xs text-muted-foreground">
                Available universes
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Show Verse Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Track your favorite TV shows and movies across different universes.
            </p>
            <div className="flex space-x-2">
              <Badge variant="secondary">📺 Track Shows</Badge>
              <Badge variant="secondary">🌌 Organize by Universe</Badge>
              <Badge variant="secondary">📈 View Progress</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Sign in to start tracking your viewing progress!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

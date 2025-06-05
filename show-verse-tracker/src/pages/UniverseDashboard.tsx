
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  is_public: boolean;
  creator_id: string | null;
}

interface UniverseStats {
  totalShows: number;
  totalEpisodes: number;
  watchedEpisodes: number;
}

export const UniverseDashboard: React.FC = () => {
  const { universeSlug } = useParams<{ universeSlug: string }>();
  const { user } = useAuth();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [stats, setStats] = useState<UniverseStats>({
    totalShows: 0,
    totalEpisodes: 0,
    watchedEpisodes: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (universeSlug) {
      fetchUniverse();
    }
  }, [universeSlug, user]);

  const fetchUniverse = async () => {
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .eq('slug', universeSlug)
        .single();

      if (error) throw error;
      setUniverse(data);
      await fetchStats(data.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load universe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (universeId: string) => {
    try {
      // Get shows in this universe
      const { data: showUniverses, error: showError } = await supabase
        .from('show_universes')
        .select('show_id')
        .eq('universe_id', universeId);

      if (showError) throw showError;

      const showIds = showUniverses?.map(su => su.show_id) || [];
      
      if (showIds.length === 0) {
        return;
      }

      // Get total episodes count
      const { count: episodesCount } = await supabase
        .from('episodes')
        .select('*', { count: 'exact', head: true })
        .in('show_id', showIds);

      // Get watched episodes count for current user
      let watchedCount = 0;
      if (user) {
        const { count } = await supabase
          .from('user_episode_status')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'watched')
          .in('episode_id', 
            await supabase
              .from('episodes')
              .select('id')
              .in('show_id', showIds)
              .then(res => res.data?.map(e => e.id) || [])
          );
        
        watchedCount = count || 0;
      }

      setStats({
        totalShows: showIds.length,
        totalEpisodes: episodesCount || 0,
        watchedEpisodes: watchedCount,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading universe dashboard...</div>;
  }

  if (!universe) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Universe not found</p>
      </div>
    );
  }

  const progressPercentage = stats.totalEpisodes > 0 
    ? (stats.watchedEpisodes / stats.totalEpisodes) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{universe.name}</h1>
        <p className="text-gray-600">{universe.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant={universe.is_public ? "default" : "secondary"}>
            {universe.is_public ? "Public" : "Private"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📺</span>
              <span>Shows</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShows}</div>
            <p className="text-xs text-muted-foreground">
              Total shows in universe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎬</span>
              <span>Episodes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEpisodes}</div>
            <p className="text-xs text-muted-foreground">
              Total episodes available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👁️</span>
              <span>Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user ? `${Math.round(progressPercentage)}%` : 'Sign in'}
            </div>
            <p className="text-xs text-muted-foreground">
              {user ? `${stats.watchedEpisodes} / ${stats.totalEpisodes} watched` : 'to track progress'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

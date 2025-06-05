
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../components/auth/AuthProvider';
import { ShowCard } from '../components/shows/ShowCard';
import { useToast } from '@/hooks/use-toast';

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  slug: string;
  created_at: string;
}

export const MyShows: React.FC = () => {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyShows();
    }
  }, [user]);

  const fetchMyShows = async () => {
    if (!user) return;
    
    try {
      // Get shows that the user has watched episodes from
      const { data: watchedShows, error } = await supabase
        .from('user_episode_status')
        .select(`
          episode_id,
          episodes!inner(
            show_id,
            shows!inner(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'watched');

      if (error) throw error;

      // Extract unique shows
      const uniqueShows = new Map();
      watchedShows?.forEach((item: any) => {
        const show = item.episodes.shows;
        if (!uniqueShows.has(show.id)) {
          uniqueShows.set(show.id, show);
        }
      });

      setShows(Array.from(uniqueShows.values()));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your shows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show?.slug) {
      window.location.href = `/show-verse-tracker/show/${show.slug}`;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your shows.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading your shows...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Shows</h1>
        <p className="text-gray-600">Shows you're currently watching</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onSelect={handleShowSelect} />
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't started watching any shows yet.</p>
          <p className="mt-2">Check out the public shows to get started!</p>
        </div>
      )}
    </div>
  );
};

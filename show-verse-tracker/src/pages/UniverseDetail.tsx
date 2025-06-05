
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShowCard } from '../components/shows/ShowCard';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
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

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  slug: string;
  created_at: string;
}

export const UniverseDetail: React.FC = () => {
  const { universeSlug } = useParams<{ universeSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (universeSlug) {
      fetchUniverse();
    }
  }, [universeSlug]);

  const fetchUniverse = async () => {
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .eq('slug', universeSlug)
        .single();

      if (error) throw error;
      setUniverse(data);
      fetchShows(data.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load universe details",
        variant: "destructive",
      });
      navigate('/show-verse-tracker/universes/public');
    }
  };

  const fetchShows = async (universeId: string) => {
    try {
      const { data, error } = await supabase
        .from('show_universes')
        .select(`
          shows (*)
        `)
        .eq('universe_id', universeId);

      if (error) throw error;
      setShows(data?.map(item => item.shows).filter(Boolean) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load shows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show?.slug) {
      navigate(`/show-verse-tracker/show/${show.slug}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading universe...</div>;
  }

  if (!universe) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Universe not found</p>
        <Button onClick={() => navigate('/show-verse-tracker/universes/public')} className="mt-4">
          Back to Universes
        </Button>
      </div>
    );
  }

  const isOwner = user && universe.creator_id === user.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/show-verse-tracker/universes/public')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universes
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{universe.name}</h1>
            {universe.description && (
              <p className="text-gray-600">{universe.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={universe.is_public ? "default" : "secondary"}>
                {universe.is_public ? "Public" : "Private"}
              </Badge>
            </div>
          </div>
        </div>
        {isOwner && (
          <Button 
            variant="outline"
            onClick={() => navigate(`/show-verse-tracker/universe/${universe.slug}/dashboard`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shows in this Universe</CardTitle>
          <CardDescription>
            {shows.length} {shows.length === 1 ? 'show' : 'shows'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} onSelect={handleShowSelect} />
            ))}
          </div>
          {shows.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No shows in this universe yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

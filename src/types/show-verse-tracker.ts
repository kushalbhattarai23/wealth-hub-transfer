
// Type definitions for show-verse-tracker integration
export interface ShowVerseUser {
  id: string;
  email: string;
}

export interface ShowVerseShow {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  slug: string;
  created_at: string;
  is_public: boolean;
}

export interface ShowVerseUniverse {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  is_public: boolean;
  creator_id: string;
}

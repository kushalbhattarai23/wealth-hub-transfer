# Show Verse Tracker

A comprehensive TV show and universe tracking application built with modern web technologies. Track your favorite shows, organize them into universes, and keep track of your watching progress.

🌐 **Live Demo:** [tvuniversetracker.netlify.app](https://tvuniversetracker.netlify.app/)

---

## ✨ Features

### 📺 Show Management
- Browse and track public TV shows
- View detailed show information including seasons and episodes
- Track watch progress for individual episodes
- Mark entire seasons or shows as watched/unwatched
- Search and filter shows

### 🌌 Universe System
- Create and manage TV show universes
- Add shows to universes to create collections
- Public and private universe support
- Universe dashboard with progress statistics
- Episode timeline across universe shows

### 👤 User Features
- User authentication with email/password
- Personal watch progress tracking
- Dashboard with watching statistics
- Progress visualization with charts and metrics

### 🔧 Admin Features
- Admin portal for content management
- Bulk import shows and episodes via CSV
- Support for various CSV formats

---

## 🧰 Technology Stack

### 🖥️ Frontend
- React 18
- TypeScript
- Vite for development and building
- TailwindCSS for styling
- shadcn/ui component library
- Lucide React for icons
- React Router for navigation
- React Query for data fetching
- React Hook Form for form handling

### 🗄️ Backend
- Supabase for backend services
- PostgreSQL database
- Row Level Security (RLS) for data protection
- Real-time subscriptions
- Built-in authentication

### 🛠️ Development Tools
- ESLint for code linting
- TypeScript for type safety
- Environment variable management
- Hot module replacement

---

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable React components
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/          # Utility functions and helpers
├── pages/        # Application pages/routes
└── types/        # TypeScript type definitions
```

### Key Components

- `AuthProvider`: Handles user authentication state
- `ShowCard`: Displays show information
- `UniverseCard`: Displays universe information
- `EpisodeList`: Lists episodes with watch status
- `ShowTracker`: Tracks show progress
- `CreateUniverseForm`: Form for creating universes

### Pages

- `/`: Main dashboard
- `/shows/public`: Public shows listing
- `/shows/my`: User's tracked shows
- `/universes/public`: Public universes
- `/universes/my`: User's universes
- `/show/:showSlug`: Show details
- `/universe/:universeSlug`: Universe details


## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- AI support [Bolt.new](https://bolt.new)
- AI support [Lovable.dev](https://lovable.dev)

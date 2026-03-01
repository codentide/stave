# 🎵 STAVE HUBS - Music Development Suite

A modern web application for creating, organizing, and editing music projects. Perfect for solo artists, small bands, and music producers who need a professional yet intuitive tool for managing albums, EPs, and singles.

## ✨ Features

### Core Functionality

- **Hub Management** - Create and manage music projects (albums, EPs, singles)
- **Song Management** - Full CRUD for songs within projects
- **Metadata Editing** - Edit song details inline: title, BPM, key, status, tags
- **Lyrics Editor** - Add and edit lyric sections (Intro, Verse, Chorus, etc.)
- **Cover Images** - Upload song cover art (stored as Data URL)
- **Export** - Download lyrics as `.txt` files
- **Tag System** - Organize songs with custom tags

### Technical Features

- **Local Storage** - All data persists in browser (no server needed for MVP)
- **Dark Mode** - Beautiful light/dark theme support
- **Responsive Design** - Works on desktop and tablet
- **Type Safety** - Full TypeScript with Zod validation
- **Performance** - Optimized components with React.memo and debouncing
- **Error Boundaries** - Graceful error handling across the app

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repo>
cd stave
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating a Project

1. Click "Crear Nuevo Proyecto" on the dashboard
2. Fill in name, type (Album/EP/Single), and color
3. Start adding songs

### Managing Songs

1. Open a project to see songs list
2. Click "Crear Canción" or click an existing song
3. Edit metadata inline or add lyrics

### Editing Lyrics

- Click "+ Nueva Sección" to add lyric sections
- Choose section type (Intro, Verse, Chorus)
- Edit content with auto-expand textarea
- Delete sections with the remove button

### Exporting

- Open a song
- Click menu icon (⋮)
- Select "Exportar Letra" to download as .txt

## 🏗️ Architecture

### Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3 with TypeScript 5
- **Styling:** Tailwind CSS 4
- **State:** Jotai (primitive atoms + localStorage)
- **Validation:** Zod (runtime type safety)
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React

### Folder Structure

```
src/
├── app/                    # Next.js pages & layouts
│   ├── layout.tsx         # Root layout
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # Base components (shadcn)
│   ├── shared/           # Reusable components
│   └── features/         # Feature-specific components
├── atoms/                # Jotai state management
│   ├── features/         # Domain atoms (hub, song)
│   └── providers/        # Provider context factories
├── lib/
│   ├── constants/        # App constants
│   ├── utils/           # Helper functions
│   └── hooks/           # Custom React hooks
├── types/               # TypeScript & Zod schemas
└── styles/              # Tailwind config
```

### State Management

**Jotai Atoms** - Simple, composable state with zero boilerplate:

- Primitives: `atom<T>(initialValue)`
- Persistence: `atomWithStorage(key, initialValue)`
- Domain-based organization: `atoms/features/hub/`, `atoms/features/song/`

**Data Layer Abstraction** - All mutations via hooks in `atoms/features/`:

- `useCreateHub()`, `useUpdateHubMeta()`, `useDeleteHub()`
- `useCreateSong()`, `useUpdateSongMeta()`, `useUpdateSongLyrics()`
- Future-proof: Can swap localStorage → Supabase without component changes

### Performance

- ✅ Memoized components (SongCard)
- ✅ Debounced edits (600ms for metadata)
- ✅ Lazy-loaded features
- ✅ Efficient re-renders with Jotai subscriptions

## 💾 Data Persistence

Currently, all data is stored in **browser localStorage**:

```
Key: "stave:hubs" → JSON array of hubs with songs
```

**Post-MVP:** Will migrate to Supabase with:

- PostgreSQL database
- Cloud Storage for images
- Real-time sync (Supabase listeners)
- Multi-user support

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Start production server
npm start
```

### Code Style

- **TypeScript:** Strict mode, no `any` types
- **Components:** Functional with hooks, minimal props
- **Naming:** camelCase for vars/functions, PascalCase for components
- **Comments:** Only non-obvious logic, explain WHY not WHAT
- **Styling:** Tailwind only, no inline styles

### Making Changes

1. Create feature branch: `git checkout -b feature/description`
2. Follow existing patterns (see `CLAUDE.md`)
3. Test locally: `npm run dev`
4. Run linter: `npm run lint`
5. Commit with clear message: `git commit -m "type: description"`

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Architecture decisions, project vision, workflow
- **[TODO.md](./TODO.md)** - Post-MVP tasks and roadmap
- **[JOTAI_MIGRATION.md](./JOTAI_MIGRATION.md)** - State management patterns
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - Supabase integration roadmap

## 🗺️ Roadmap

### Phase 1: MVP Local ✅ COMPLETE

- Hub and song management
- Metadata and lyrics editing
- Cover images
- Local persistence
- Error boundaries

### Phase 2: Supabase Backend (Next)

- PostgreSQL integration
- Cloud storage for images
- React Query setup
- User authentication

### Phase 3: Collaboration (Future)

- Real-time multiplayer editing
- User sharing and permissions
- Comments and feedback
- Revision history

## 🐛 Troubleshooting

### Data not persisting?

- Check browser localStorage settings (not disabled)
- Open DevTools → Application → LocalStorage → look for "stave:hubs"

### Components not updating?

- Verify atom is imported from correct path
- Check Jotai hooks are inside components (not root level)
- Use React DevTools to inspect atom state

### Styling looks wrong?

- Clear browser cache
- Run `npm run dev` and hard refresh (Ctrl+Shift+R)

## 🤝 Development

This is a **proprietary project** in active development. Contributions are not currently accepted.

For architecture decisions and development guidelines, see `CLAUDE.md`.

## 📄 License & Intellectual Property

**All rights reserved.** This project is proprietary software.

- ❌ No license to use, copy, or distribute
- ❌ Not open source
- 🚀 Future SaaS product in development

Unauthorized copying, modification, or distribution is prohibited.

For inquiries about licensing or usage, contact the project owner.

## 🙏 Credits

Built with:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jotai](https://jotai.org/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Current Version:** 1.0.0 (MVP Local)
**Last Updated:** March 1, 2026
**Status:** Active Development

For questions or feedback, see the documentation files above.

<div align="center">
  <h3 style="font-size:32px;">
    <strong>Stave</strong>
  </h3>
  <p>A web suite for creating, organizing, and editing music projects. Manage hubs (albums, EPs, singles) with songs that include detailed metadata, section-based lyrics, and audio playback via YouTube. Built for artists and producers who want a clean, frictionless workflow.</p>

  <div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-323232?style=for-the-badge&logo=react&logoColor=2361DAFB)](https://es.react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Jotai](https://img.shields.io/badge/Jotai-323232?style=for-the-badge&logo=react&logoColor=white)](https://jotai.org/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

  </div>
</div>

## Features

- **Hubs**: Create and organize albums, EPs, or singles with name, color, and type
- **Songs**: Full CRUD with musical metadata (BPM, key, status, tags)
- **Lyrics**: Section-based editor (Intro, Verse, Chorus, Bridge, Outro) with auto-resize and custom ordering
- **Audio Player**: Add YouTube tracks to any song and play them directly with play/pause, seek, and track navigation controls
- **Local persistence**: All data saved to localStorage — no server required
- **Dark / light mode**: Full theme support

## Audio Player

Each song can have multiple audio tracks linked from YouTube.

- Paste a YouTube link and the app fetches the title automatically via oEmbed
- Playback controls: play/pause, previous, next, and timeline seek
- Player runs in the background at the lowest possible quality to conserve resources
- **Coming soon:** local audio file upload support

## Project structure

```
stave/
├── app/
│   ├── layout.tsx
│   └── dashboard/
│       ├── page.tsx            # Hub list
│       └── [hubId]/
│           ├── page.tsx        # Hub detail (songs)
│           └── [songId]/
│               └── page.tsx    # Song editor
├── components/
│   ├── ui/                     # Base components (shadcn/ui)
│   ├── shared/                 # Reusable components
│   └── features/
│       ├── hub/                # HubCard, HubHeader, CreateHubModal
│       ├── song/               # SongHeader, SongLyrics, SongCard
│       └── audio/              # AudioPlayer, TrackCard, AddTrackForm
├── lib/
│   ├── atoms/                  # Global state (Jotai)
│   ├── constants/              # App constants (keys, tags, types)
│   └── utils/                  # Helpers (format, audio, ui)
└── types/                      # Zod schemas + TypeScript types
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/codentide/stave.git
   cd stave
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Usage

### Hubs

- **Create:** Click the empty card on the dashboard, pick a name, type, and color
- **Edit:** Click directly on the hub name or color to edit inline
- **Delete:** Use the options menu on the hub card

### Songs

- **Create:** Inside a hub, click the new song card
- **Edit metadata:** Click any field (title, BPM, key, status, tags) to edit inline
- **Delete:** Use the options menu inside the song

### Lyrics

- **Add section:** Click `+ Add section` to add an Intro, Verse, Chorus, etc.
- **Change type:** Click the section label to change it
- **Edit content:** The textarea grows automatically as you type
- **Delete section:** Hover over the section and click the delete icon

### Audio Player

- **Add track:** Click `Add audio track`, paste a YouTube link, and click `Add`
- **Play:** Click any track in the list to start playback
- **Controls:** Play/pause, previous, next, and seek from the player
- **Delete track:** Hover over the track and click the delete icon

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint check
```

## Roadmap

### Phase 1: Local MVP ✅
- Hub and song management
- Metadata and section-based lyrics
- Audio player with YouTube
- localStorage persistence

### Phase 2: Supabase Backend
- PostgreSQL database
- User authentication
- Local audio file upload and storage

### Phase 3: Collaboration
- Real-time co-editing
- Project sharing
- Change history

## License

All rights reserved. Proprietary project under active development.

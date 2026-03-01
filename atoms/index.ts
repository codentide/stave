/**
 * ATOMS - Jotai state management
 * Central export point for all atoms, state readers, and actions across the app
 *
 * Organized by domain:
 * - features/hub/: Hub atoms, state readers, and mutations
 * - features/song/: Song atoms, state readers, and mutations
 * - scopes/: Page-scoped atoms (local state)
 * - providers/: Scope providers (state isolation)
 */

// Feature domains
export * from './features/hub'
export * from './features/song'

// Scoped atoms (page-local state)
export * from './scopes'

// Providers (scope providers for state isolation)
export * from './providers/song-page.provider'

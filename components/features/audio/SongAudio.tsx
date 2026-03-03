'use client'

import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube'
import { Track, Song } from '@/types'
import { useAddSongTrack, useRemoveSongTrack } from '@/atoms'
import { useSongPageAtoms } from '@/atoms/providers/song-page.provider'
import { useAtom } from 'jotai'
import { useState, useRef, useEffect } from 'react'
import { AddTrackForm } from './AddTrackForm'
import { TrackCard } from './TrackCard'
import { AudioPlayer } from './AudioPlayer'
import { extractYouTubeId } from '@/lib/utils'

// YouTube player options — no native controls, no related videos at the end
const PLAYER_OPTS = {
  width: '1',
  height: '1',
  playerVars: {
    controls: 0 as const,
    modestbranding: 1 as const,
    rel: 0 as const,
  },
}

interface Props {
  songId: Song['id']
  items?: Track[]
}

export const SongAudio = ({ songId, items = [] }: Props) => {
  const atoms = useSongPageAtoms()
  const [hubId] = useAtom(atoms.pageHubIdAtom)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  // YouTubePlayer instance — controlled imperatively via the IFrame API
  const playerRef = useRef<YouTubePlayer | null>(null)
  // Ref mirror of playing so async callbacks always read the latest value
  const isPlayingRef = useRef(false)

  const addTrack = useAddSongTrack()
  const removeTrack = useRemoveSongTrack()

  const activeTrack = items.find((t) => t.id === activeId)
  const activeIndex = items.findIndex((t) => t.id === activeId)
  const activeVideoId = activeTrack ? extractYouTubeId(activeTrack.url) : null

  // Keep isPlayingRef in sync so callbacks don't use stale closures
  useEffect(() => {
    isPlayingRef.current = playing
  }, [playing])

  // Sync play/pause state → YouTube player API
  useEffect(() => {
    if (!playerRef.current) return
    if (playing) playerRef.current.playVideo()
    else playerRef.current.pauseVideo()
  }, [playing])

  // Poll currentTime every 500ms while playing to drive the progress slider
  useEffect(() => {
    if (!playing) return

    const tick = async () => {
      if (!playerRef.current) return
      const currentTime = await playerRef.current.getCurrentTime()
      setProgress(currentTime)
    }

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [playing])

  const handleAddTrack = (track: Omit<Track, 'id' | 'songId'>) => {
    addTrack(hubId, songId, track)
  }

  const handleRemoveTrack = (trackId: string) => {
    removeTrack(hubId, songId, trackId)
    if (activeId === trackId) {
      playerRef.current = null
      setActiveId(null)
      setPlaying(false)
      setProgress(0)
      setDuration(0)
    }
  }

  const handleSelectTrack = (track: Track) => {
    setProgress(0)
    setDuration(0)
    setActiveId(track.id)
    setPlaying(true)
  }

  const handlePrev = () => {
    if (activeIndex <= 0) return
    handleSelectTrack(items[activeIndex - 1])
  }

  const handleNext = () => {
    if (activeIndex + 1 >= items.length) {
      // End of playlist — stop playback
      setPlaying(false)
      return
    }
    handleSelectTrack(items[activeIndex + 1])
  }

  const handleSeek = async (time: number) => {
    setProgress(time)
    await playerRef.current?.seekTo(time, true)
  }

  const handleReady = async (event: YouTubeEvent) => {
    playerRef.current = event.target
    const dur = await event.target.getDuration()
    setDuration(dur)
    // Autoplay if the user already clicked a track
    if (isPlayingRef.current) {
      event.target.playVideo()
    }
  }

  const handleTogglePlay = () => setPlaying((p) => !p)
  const handlePlay = () => setPlaying(true)
  const handlePause = () => setPlaying(false)

  return (
    <section className="flex flex-col gap-6">
      {/* YouTube iFrame oculto — audio only, resolución mínima */}
      {activeVideoId && (
        <div className="sr-only">
          <YouTube
            key={activeVideoId}
            videoId={activeVideoId}
            opts={PLAYER_OPTS}
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnd={handleNext}
          />
        </div>
      )}

      {!!items.length && (
        <>
          {activeTrack && (
            <AudioPlayer
              track={activeTrack}
              isPlaying={playing}
              progress={progress}
              duration={duration}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={activeIndex > 0}
              hasNext={activeIndex < items.length - 1}
            />
          )}
          <div className="space-y-2">
            {items.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={activeId === track.id}
                onClick={() => handleSelectTrack(track)}
                onRemove={() => handleRemoveTrack(track.id)}
              />
            ))}
          </div>
        </>
      )}

      <AddTrackForm onAdd={handleAddTrack} />
    </section>
  )
}

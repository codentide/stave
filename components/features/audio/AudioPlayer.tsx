'use client'

import { Track } from '@/types'
import { Button } from '@/components/ui'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { capitalize, formatTime } from '@/lib/utils'

interface Props {
  track: Track
  isPlaying: boolean
  progress: number
  duration: number
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export const AudioPlayer = ({
  track,
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  onSeek,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    onSeek(newTime)
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-border/30 bg-background/40">
      {/* Controls */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <h3 className="text-[13px] text-foreground/80">{track.name}</h3>
          <span className="text-xs text-foreground/40">
            {capitalize(track.type)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onPrev}
            disabled={!hasPrev}
            className="h-8 w-8 p-0"
          >
            <SkipBack size={16} />
          </Button>
          <Button
            size="sm"
            onClick={onTogglePlay}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onNext}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <SkipForward size={16} />
          </Button>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max={Math.max(duration, 0)}
          value={progress}
          onChange={handleSliderChange}
          className="w-full h-1 bg-foreground/20 rounded-full cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/40">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

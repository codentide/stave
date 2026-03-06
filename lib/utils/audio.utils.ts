export const formatTime = (seconds: number): string => {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const totalSecs = Math.floor(seconds)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /[?&]v=([^&#]+)/, // youtube.com/watch?v=ID
    /youtu\.be\/([^?&#]+)/, // youtu.be/ID
    /\/embed\/([^?&#]+)/, // youtube.com/embed/ID
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

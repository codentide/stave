import { CreateSongInput, Hub, Song } from '@/types'
import { EmptySongCardState } from './EmptySongCardState'
import { SongCard } from './SongCard'
import { useCreateSong } from '@/atoms'

interface Props {
  hubId?: Hub['id']
  items: Song[]
}

export const SongCollection = ({ hubId, items = [] }: Props) => {
  const createSong = useCreateSong()

  const handleCreate = () => {
    const newSong: CreateSongInput = {
      title: 'New Song',
      key: '',
      bpm: 0,
      status: 'DRAFT',
      tags: [],
    }
    if (hubId) createSong(hubId, newSong)
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {items.map((item) => (
        <SongCard key={item.id} content={item} />
      ))}
      <EmptySongCardState className="mt-4" onCreate={handleCreate} />
    </div>
  )
}

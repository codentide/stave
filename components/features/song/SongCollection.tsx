import { CreateSongInput, Hub, Song } from '@/types'
import { EmptySongCardState } from './EmptySongCardState'
import { SongCard } from './SongCard'
import { useStaveActions } from '@/store/stave.store'

interface Props {
  hubId?: Hub['id']
  items: Song[]
}

interface ItemProps {
  item: Song
}

export const SongCollection = ({ hubId, items = [] }: Props) => {
  const Item = ({ item }: ItemProps) => <SongCard content={item} />
  const { createSong } = useStaveActions()

  const handleCreate = () => {
    const newSong: CreateSongInput = {
      title: 'New Song',
      key: '',
      bpm: null,
      status: 'DRAFT',
      tags: [],
    }
    if (hubId) createSong(hubId, newSong)
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
      <EmptySongCardState className="mt-4" onCreate={handleCreate} />
    </div>
  )
}

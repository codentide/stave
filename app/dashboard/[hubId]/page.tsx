'use client'

import { HubHeader } from '@/components/features/hub/HubHeader'
import { SongCollection } from '@/components/features/song'
import { useHubs } from '@/store/stave.store'
import { useParams } from 'next/navigation'

interface Props {
  params: {
    hubId: string
  }
}

export default function HubPage({}: Props) {
  const { hubId } = useParams()
  const hubs = useHubs()
  const hub = hubs.find((h) => h.id === hubId)
  const HubStyle = {
    '--primary': `${hub?.color}`,
  } as React.CSSProperties

  if (!hub) return

  return (
    <main
      className="flex flex-col gap-16 max-w-5xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar"
      style={HubStyle}
    >
      {/* HubHeader */}
      <HubHeader content={hub} />
      <SongCollection hubId={hub?.id} items={hub?.songs || []} />
      <section>{/* Gallery */}</section>
      <section>{/* Documents */}</section>
    </main>
  )
}

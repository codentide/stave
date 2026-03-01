'use client'

import { useHubs } from '@/atoms'
import { HubHeader } from '@/components/features/hub'
import { SongCollection } from '@/components/features/song'
import { createCustomStyles } from '@/lib/utils/ui.utils'
import { Hub } from '@/types'
import { useParams } from 'next/navigation'

interface Props {
  params: {
    hubId: Hub['id']
  }
}

export default function HubPage({}: Props) {
  const { hubId } = useParams()
  const hubs = useHubs()
  const hub = hubs.find((h) => h.id === hubId)

  if (!hub) {
    return (
      <main className="flex flex-col gap-16 max-w-5xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar">
        <div className="text-foreground/40">Hub no encontrado</div>
      </main>
    )
  }

  return (
    <main
      className="flex flex-col gap-16 max-w-5xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar"
      style={createCustomStyles(hub?.color)}
    >
      <HubHeader content={hub} />
      <SongCollection hubId={hub?.id} items={hub?.songs || []} />
      <section>{/* Gallery */}</section>
      <section>{/* Documents */}</section>
    </main>
  )
}

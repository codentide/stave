'use client'

import { EmptyHubCardState, HubCard } from '@/components/features/hub'
import { useCreateModalActions } from '@/store/create-modal.store'
import { useHubs, useStaveActions } from '@/store/stave.store'

export default function DashboardPage() {
  const hubs = useHubs() || []
  const { setActiveHubId } = useStaveActions()
  const { open: openCreateHubModal } = useCreateModalActions()

  return (
    <div className="max-w-6xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-none mb-2 font-serif italic">
            Hubs
          </h1>
          <p className="text-foreground/50 font-light text-sm">
            Gestiona tus producciones, álbumes y sesiones de grabación.
          </p>
        </div>
      </header>

      {
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubs.map((hub) => (
            <HubCard
              key={hub.id}
              hub={hub}
              onClick={() => setActiveHubId(hub.id)}
            />
          ))}
          {hubs.length < 12 && (
            <EmptyHubCardState onCreate={openCreateHubModal} />
          )}
        </div>
      }
    </div>
  )
}

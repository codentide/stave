'use client'

import { EmptyDashboardState, HubCard } from '@/components/features/hub'
import { useHubs, useStaveActions } from '@/store/stave.store'

export default function DashboardPage() {
  const hubs = useHubs() || []
  const { setActiveHubId, createHub } = useStaveActions()

  // Provisional
  const handleCreateNew = () => {
    createHub({
      name: `VERTiGO #${hubs.length + 1}`,
      type: 'EP',
      description: 'Nueva sesión de producción',
      color: '#F59E0B',
    })
  }

  return (
    <div className="max-w-6xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-none mb-2 font-serif italic">
            Proyectos
          </h1>
          <p className="text-foreground/50 font-light text-sm">
            Gestiona tus producciones, álbumes y sesiones de grabación.
          </p>
        </div>
      </header>

      {hubs.length === 0 ? (
        <EmptyDashboardState onCreate={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hubs.map((hub) => (
            <HubCard
              key={hub.id}
              hub={hub}
              onClick={() => setActiveHubId(hub.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

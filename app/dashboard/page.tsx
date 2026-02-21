'use client'

import { EmptyDashboardState, ProjectCard } from '@/components/features/hub'
import { useProjects, useStaveActions } from '@/store/stave.store'

export default function DashboardPage() {
  const projects = useProjects() || []
  const { setActiveProjectId, createProject } = useStaveActions()

  // Provisional
  const handleCreateNew = () => {
    createProject({
      name: `VERTiGO #${projects.length + 1}`,
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

      {projects.length === 0 ? (
        <EmptyDashboardState onCreate={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setActiveProjectId(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

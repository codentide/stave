'use client'

import { FolderMinusIcon, Mic2, Plus, Disc } from 'lucide-react'
import { ScrollArea, Separator, Button } from '@/components/ui'
import { ThemeToggler, Tooltip } from './'
import { cn } from '@/lib/utils/ui.utils'
import {
  useActiveProjectId,
  useProjects,
  useStaveActions,
} from '@/store/stave.store'

export const Sidebar = () => {
  const projects = useProjects()
  const activeProjectId = useActiveProjectId()
  const { setActiveProjectId, createProject } = useStaveActions()

  const handleCreateProject = () => {
    const projectCount = projects.length + 1
    createProject({
      name: `Proyecto #${projectCount}`,
      type: 'ALBUM',
      description: 'Sesión de composición activa',
      color: '#F59E0B',
    })
  }

  return (
    <aside className="fixed w-64 h-screen bg-card border-r border-border flex flex-col shrink-0 select-none">
      {/* Branding */}
      <div className="flex items-center justify-between p-4 ">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mic2 className="text-primary-foreground w-4.5 h-4.5" />
          </div>
          <div className="flex">
            <h1 className="flex items-center gap-1 text-md leading-none mt-1 font-medium text-foreground font-serif">
              <span>STAVE</span>
            </h1>
          </div>
        </div>
        {/* Modo oscuro */}
        <ThemeToggler />
      </div>

      <Separator className="w-full h-1" />

      {/* Navegación Estática */}
      {/* 
      <div className="px-3 py-4">
        <nav className="flex flex-col gap-1">
          <Button
            variant={!activeProjectId ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start gap-3"
            onClick={() => setActiveProjectId(null)}
          >
            <LayoutDashboard
              className={cn(
                'w-4 h-4',
                activeProjectId === null ? 'text-primary' : 'opacity-70'
              )}
            />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <Search className="w-4 h-4 opacity-70" />
            Explorar
          </Button>
        </nav>
      </div> 
      <Separator className="w-full bg-border/50" />
      */}

      {/* Listado de Proyectos */}
      <div className="flex-1 flex flex-col min-h-0 py-4">
        <div className="px-6 mb-4 flex items-center justify-between">
          <h2 className="text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
            Proyectos
          </h2>
          {/* Botón de crear nuevo proyecto */}
          <Tooltip content="Crear nuevo" side="right">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
              onClick={handleCreateProject}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </Tooltip>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            {projects.length === 0 ? (
              <div className="px-4 py-8 text-center border border-dashed border-border rounded-lg mx-1 opacity-50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No hay proyectos activos.
                </p>
              </div>
            ) : (
              projects.map((project) => {
                const isActive = activeProjectId === project.id
                return (
                  <Button
                    key={project.id}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveProjectId(project.id)}
                    className={cn(
                      'w-full justify-start gap-3 font-normal group relative transition-all',
                      isActive &&
                        'text-primary bg-primary/10 hover:bg-primary/15'
                    )}
                  >
                    <Disc
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span className="truncate flex-1 text-left">
                      {project.name}
                    </span>
                    {isActive && (
                      <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      {/* <div className="p-4 bg-muted/20 border-t border-border mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center">
            <Music2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium">Configuración</span>
          <Settings className="ml-auto w-3.5 h-3.5 opacity-40" />
        </Button>
      </div> */}
    </aside>
  )
}

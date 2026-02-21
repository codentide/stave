import { Button } from '@/components/ui/button'
import { Music4, Plus } from 'lucide-react'

export const EmptyDashboardState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border/40 rounded-3xl bg-muted/5">
    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
      <Music4 className="w-10 h-10 text-muted-foreground/40" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">
      No hay proyectos todavía
    </h3>
    <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm px-4">
      Tu librería está lista para recibir tu próxima producción. Crea un nuevo
      proyecto para comenzar.
    </p>
    <Button
      onClick={onCreate}
      className="gap-2 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="w-4 h-4" />
      Empezar nueva sesión
    </Button>
  </div>
)

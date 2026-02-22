import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const EmptyHubCardState = ({ onCreate }: { onCreate: () => void }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center p-6 h-36',
      'border border-dashed border-border/30 rounded-xl',
      'bg-muted/10 hover:bg-muted/15 hover:border-primary/25',
      'group transition-colors duration-200 cursor-pointer'
    )}
    onClick={onCreate}
  >
    <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-2 border border-border/20 group-hover:bg-primary transition-colors duration-200">
      <Plus className="w-6 h-6 text-muted-foreground/50 group-hover:text-background" />
    </div>
    <h3 className="text-sm font-light text-foreground/40 group-hover:text-primary">
      Nuevo Hub
    </h3>
  </div>
)

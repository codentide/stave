import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface Props {
  onCreate: () => void
  className?: string
}

export const EmptySongCardState = ({ className, onCreate }: Props) => (
  <div
    className={cn(
      'flex items-center justify-center gap-3 p-6 h-18',
      'border border-dashed border-border/80 rounded-xl',
      'bg-transparent hover:bg-primary/5 hover:border-primary/25',
      'group transition-colors duration-200 cursor-pointer',
      className
    )}
    onClick={onCreate}
  >
    <div className="w-6 h-6 bg-background/30 rounded-full flex items-center justify-center border border-border/20 group-hover:bg-primary transition-colors duration-200">
      <Plus className="w-4 h-4 text-foreground/50 group-hover:text-background" />
    </div>
    <h3 className="text-sm font-light text-foreground/40 group-hover:text-primary">
      Nueva Canción
    </h3>
  </div>
)

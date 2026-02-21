import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { getRelativeTime } from '@/lib/utils/date.utils'
import { capitalize } from '@/lib/utils/format.utils'
import { Hub } from '@/types'
import { Clock } from 'lucide-react'

export const HubCard = ({
  hub,
  onClick,
}: {
  hub: Hub
  onClick: () => void
}) => {
  const relativeCreatedAt = getRelativeTime(hub.createdAt)
  return (
    <Card
      className={cn(
        'group p-5',
        'dark:border-border/50 dark:hover:border-primary/25',
        'border-border hover:border-primary/25',
        'hover:shadow-[0_0_40px_0px_rgba(235,158,71,0.05)] shadow-none',
        'cursor-pointer transition-all duration-300 '
      )}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        {/* <div className="flex justify-between items-start">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${hub.color}16`,
              color: hub.color,
            }}
          >
            <Music4 className="w-5 h-5" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div> */}
        <div>
          <CardTitle className="text-[16px] font-bold text-foreground/60 dark:text-foreground/72 group-hover:text-primary dark:group-hover:text-primary transition-colors">
            {hub.name}
          </CardTitle>
          <CardDescription className="text-xs font-light line-clamp-1 mt-1 text-foreground/40">
            {hub.description || 'Sin descripción...'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-0 flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-[10px] tracking-wider font-medium  text-foreground/32">
          <Clock className="w-3 h-3" />
          <span className=" mt-px font-medium text-[10px] leading-[0.8]">
            {capitalize(relativeCreatedAt)}
          </span>
        </div>
        <small className="w-fit px-2 rounded-sm text-[12px] line-clamp-1 text-foreground/32 bg-muted/36 capitalize">
          {hub.type}
        </small>
      </CardContent>
    </Card>
  )
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import {
  getRelativeTime,
  capitalize,
  cn,
  createCustomStyles,
} from '@/lib/utils'
import { Hub } from '@/types'
import { Clock } from 'lucide-react'
import Link from 'next/link'

export const HubCard = ({
  content,
  onClick,
}: {
  content: Hub
  onClick: () => void
}) => {
  const { createdAt, color, id, name, description, type } = content

  const relativeCreatedAt = getRelativeTime(createdAt)
  const customStyles = color ? createCustomStyles(color) : undefined

  return (
    <Link href={'/dashboard/' + id}>
      <Card
        className={cn(
          'overflow-hidden relative group p-5 h-36',
          'dark:border-border/50 dark:hover:border-primary/25',
          'border-border hover:border-primary/25',
          'hover:shadow-[0_0_40px_0px] shadow-primary/8 shadow-none',
          'cursor-pointer transition-all duration-300 '
        )}
        onClick={onClick}
        style={customStyles}
      >
        <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-[76%] rounded-full bg-primary/40 group-hover:bg-primary/80 transition-all duration-300 " />
        <CardHeader className="p-0">
          <div>
            <CardTitle className="text-[16px] font-bold text-foreground/60 dark:text-foreground/72 transition-colors line-clamp-1">
              {name}
            </CardTitle>
            <CardDescription className="text-xs font-light line-clamp-1 mt-1 text-foreground/40">
              {description || 'Sin descripción...'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-0 flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[10px] tracking-wider font-medium  text-foreground/32">
            <Clock className="w-3 h-3" />
            <span className=" font-light text-[10px] leading-[0.8] pb-px">
              {capitalize(relativeCreatedAt)}
            </span>
          </div>
          <small className="w-fit px-2 rounded-sm text-[12px] line-clamp-1 text-foreground/32 bg-background/30 capitalize">
            {type}
          </small>
        </CardContent>
      </Card>
    </Link>
  )
}

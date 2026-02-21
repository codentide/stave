import {
  Tooltip as ShadTooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SimpleTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
}

//  Una abstracción sobre el Tooltip de Shadcn para evitar el boilerplate.
export const Tooltip = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 200,
}: SimpleTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <ShadTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-foreground dark:bg-primary border-border text-background"
        >
          {content}
          <TooltipArrow className="bg-foreground dark:bg-primary fill-transparent size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] " />
        </TooltipContent>
      </ShadTooltip>
    </TooltipProvider>
  )
}

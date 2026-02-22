'use client'

import { EditableText } from '@/components/shared'
import { Button, Separator } from '@/components/ui'
import { getRelativeTime } from '@/lib/utils'
import { useStaveActions } from '@/store/stave.store'
import { Hub } from '@/types'
import { Clock, MoreHorizontal } from 'lucide-react'

interface Props {
  content: Pick<Hub, 'id' | 'name' | 'description' | 'type' | 'createdAt'> | Hub
}

export const HubHeader = ({ content }: Props) => {
  const { id, name, type, description, createdAt } = content
  const { updateHubMeta } = useStaveActions()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <small className="text-xs text-primary">{type}</small>
        {/* [ ]: Menú de opciones (cambiar color & borrar) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground/80 hover:text-primary transition-colors"
        >
          <MoreHorizontal />
        </Button>
      </div>
      <div className="flex flex-col gap-0.5">
        <EditableText
          className="text-3xl font-bold leading-none font-serif italic -ml-0.5 tracking-wider"
          value={name}
          onChange={(newName) => updateHubMeta(id, { name: newName })}
        />
        <EditableText
          className="text-foreground/64 font-light text-sm leading-[1.6]"
          value={description || ''}
          onChange={(newDescription) =>
            updateHubMeta(id, { description: newDescription })
          }
          maxLength={255}
          multiline={true}
          rows={2}
        />
      </div>
      <div className="flex items-center gap-2 text-foreground/32 -mb-1">
        <Clock className="w-3 h-3 mb-[0.5px] " />
        <span className="font-light text-xs leading-[1.6]">
          Creado {getRelativeTime(createdAt)}
        </span>
        <span className="text-xs text-foreground/16 font-bold">•</span>
        <span className="font-light text-xs leading-[1.6]">
          Actualizado {getRelativeTime(createdAt)}
        </span>
      </div>
      <Separator className="opacity-36" />
    </section>
  )
}

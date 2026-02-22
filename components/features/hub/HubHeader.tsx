'use client'

import {
  ActionMenu,
  ColorPickerPopoverButton,
  EditableText,
} from '@/components/shared'
import { Separator } from '@/components/ui'
import { getRelativeTime } from '@/lib/utils'
import { useUpdateHubMeta, useDeleteHub } from '@/atoms'
import { Hub } from '@/types'
import { Clock, Trash2 } from 'lucide-react'
import { PageBreadcrumb } from '@/components/shared/PageBreadcrumb'

interface Props {
  content:
    | Pick<Hub, 'id' | 'name' | 'description' | 'type' | 'createdAt' | 'color'>
    | Hub
}

export const HubHeader = ({ content }: Props) => {
  const { id, name, type, description, createdAt, color } = content
  const updateHubMeta = useUpdateHubMeta()
  const deleteHub = useDeleteHub()

  const handleChangeColor = (newColor: string) => {
    updateHubMeta(id, { color: newColor })
  }

  const handleDeleteHub = () => {
    deleteHub(id)
  }

  const menuActions = [
    {
      label: 'Borrar Hub',
      icon: Trash2,
      onClick: handleDeleteHub,
      variant: 'destructive' as const,
    },
  ]

  const BreadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: name },
  ]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-8">
        <PageBreadcrumb items={BreadcrumbItems} />
        <div className="flex items-center gap-2">
          <ColorPickerPopoverButton
            value={color}
            onChange={handleChangeColor}
          />
          <ActionMenu actions={menuActions} color={color} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <small className="text-xs text-primary mb-2">{type}</small>

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
        {/* [ ]: Crear updatedAd */}
        <span className="font-light text-xs leading-[1.6]">
          Actualizado {getRelativeTime(createdAt)}
        </span>
      </div>
      <Separator className="opacity-36" />
    </section>
  )
}

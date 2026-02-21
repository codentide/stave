import { Form, HubColorField, HubTypeField } from '@/components/form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  useCreateModalActions,
  useCreateModalIsOpen,
} from '@/store/create-modal.store'
import { useStaveActions } from '@/store/stave.store'
import { createHubInput } from '@/types'
import { useState } from 'react'
import { HubTypeEnum } from '@/types'
import { HUB_COLOR_VALUES } from '@/lib/constants/form.constant'

interface Props {
  onOpenChange?: () => void
}

type FormField = keyof createHubInput

const initalFormData = {
  name: '',
  type: HubTypeEnum.enum.ALBUM,
  color: HUB_COLOR_VALUES[0],
}

export const CreateHubModal = ({ onOpenChange }: Props) => {
  const [formData, setFormData] = useState<createHubInput>(initalFormData)
  const isOpen = useCreateModalIsOpen()

  const { createHub } = useStaveActions()
  const { close } = useCreateModalActions()

  const handleOpenChange = () => {
    onOpenChange?.()

    // Para evitar que cambie antes de cerrar
    setTimeout(() => setFormData(initalFormData), 100)
    if (isOpen) close()
  }

  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [field]: value,
      }
    })
  }

  const handleSubmit = () => {
    const newHub = createHub({
      name: formData.name,
      type: formData.type,
      color: formData.color,
    })

    console.debug('[NUEVO-HUB]:', newHub)
    handleOpenChange()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'flex flex-col gap-6 p-5 pt-12 rounded-2xl',
          'lg:p-10 lg:gap-8',
          'selection:bg-(--hub-selected-color)/75',
          'selection:text-background'
        )}
        style={
          {
            '--hub-selected-color': formData.color,
          } as React.CSSProperties
        }
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="font-serif italic text-2xl leading-none">
            Nuevo Hub
          </DialogTitle>
          <DialogDescription className="text-foreground/50">
            Donde podrás desarrollar tu proyecto musical de inicio a fin.
          </DialogDescription>
        </DialogHeader>
        {/* Formulario de creación */}
        <Form
          id="create-hub-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="gap-5">
            <Field className="gap-0">
              <FieldLabel
                htmlFor="hub-name"
                className="text-sm text-foreground/75 font-medium mb-2"
              >
                Título
              </FieldLabel>
              <Input
                id="hub-name"
                name="hubName"
                className="focus-visible:border-(--hub-selected-color)/32 "
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej. Nocturnal Echoes..."
              />
            </Field>
            <FieldSet>
              <FieldLegend
                variant="label"
                id="hub-type-legend"
                className="text-sm text-foreground/75 font-medium mb-2"
              >
                Tipo de Hub
              </FieldLegend>
              <HubTypeField
                id="hub-type"
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                aria-labelledby="hub-type-legend"
              />
            </FieldSet>
            <FieldSet>
              <FieldLegend
                variant="label"
                id="hub-color-legend"
                className="text-sm text-foreground/75 font-medium mb-2"
              >
                Color
              </FieldLegend>
              <HubColorField
                id="hub-color"
                value={formData.color}
                onChange={(value) => handleInputChange('color', value)}
                aria-labelledby="hub-color-legend"
              />
            </FieldSet>
          </FieldGroup>
        </Form>

        <DialogFooter className="sm:justify-start">
          <Button
            form="create-hub-form"
            className="w-full bg-(--hub-selected-color) hover:bg-(--hub-selected-color)/90"
          >
            Crear Hub
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

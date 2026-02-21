import { ComponentPropsWithoutRef, SyntheticEvent } from 'react'

interface Props extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit?: (data: Record<string, unknown>) => void
  children: React.ReactNode
}

export const Form = ({ children, onSubmit, ...props }: Props) => {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    console.debug('[FORM-COMPONENT]', data)
    onSubmit?.(data)
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

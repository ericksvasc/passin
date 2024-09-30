import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogContent } from './ui/dialog'
import { type ChangeEvent, useEffect, useState } from 'react'

const editAttendeeForm = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

type EditAttendeeForm = z.infer<typeof editAttendeeForm>

interface Attendee {
  id: number
  name: string
  email: string
  createdAt: string
  checkInDate: string | null
}

interface AttendeeEditDialogProps {
  attendee: Attendee // Define que props terá um campo attendee do tipo Attendee
}

export function EditAttendee({ attendee }: AttendeeEditDialogProps) {
  const [attendeeValue, setAttendeeValue] = useState(attendee)

  useEffect(() => {
    setAttendeeValue(attendee) // Atualiza o estado com o novo attendee sempre que o prop mudar
  }, [attendee])

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setAttendeeValue({
      ...attendeeValue,
      name: event.target.value,
    })
  }
  function onSearchEmailChanged(event: ChangeEvent<HTMLInputElement>) {
    setAttendeeValue({
      ...attendeeValue,
      email: event.target.value,
    })
  }

  const { register, control, handleSubmit, formState, reset } =
    useForm<EditAttendeeForm>({
      resolver: zodResolver(editAttendeeForm),
    })

  //   reset()

  return (
    <DialogContent>
      <form>
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          placeholder="Nome completo"
          {...register('name')}
          value={attendeeValue.name}
          onChange={onSearchInputChanged}
          className="text-black"
          autoFocus
        />
        {formState.errors.name && (
          <p className="text-red-400 text-sm">
            {formState.errors.name.message}
          </p>
        )}

        <label htmlFor="name">Email:</label>
        <input
          id="email"
          placeholder="Nome completo"
          {...register('email')}
          value={attendeeValue.email}
          onChange={onSearchEmailChanged}
          className="text-black"
          autoFocus
        />
        {formState.errors.email && (
          <p className="text-red-400 text-sm">
            {formState.errors.email.message}
          </p>
        )}
      </form>
    </DialogContent>
  )
}

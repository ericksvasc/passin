import * as Form from '@radix-ui/react-form'
import { DialogContent, DialogTitle } from './ui/dialog'
import { type ChangeEvent, useEffect, useState } from 'react'

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
export function AttendeeEditDialog({ attendee }: AttendeeEditDialogProps) {
  const [attendeeDados, setAttendee] = useState<Attendee>(attendee)

  useEffect(() => {
    setAttendee(attendee) // Atualiza o estado com o novo attendee sempre que o prop mudar
  }, [attendee])

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setAttendee({
      ...attendeeDados,
      name: event.target.value,
    })
  }

  return (
    <DialogContent>
      {/* <DialogTitle>{attendee.name}</DialogTitle>
      <DialogTitle>name</DialogTitle> */}
      <Form.Root>
        <Form.Field name="name">
          <div>
            {' '}
            <Form.Label>Name</Form.Label>
            {/* <Form.Message match="valueMissing">
              Por favor preencha um nome válido
            </Form.Message> */}
          </div>

          <Form.Control asChild>
            <input
              className="bg-white text-zinc-800 flex-1 outline-none gap-3"
              type="text"
              placeholder="Nome do participante"
              onChange={onSearchInputChanged}
              value={attendeeDados?.name}
            />
          </Form.Control>
        </Form.Field>
      </Form.Root>
    </DialogContent>
  )
}

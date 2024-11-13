import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '../ui/input'
import { createAttendee } from '../../http/create-attendee'

const editAttendeeForm = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .refine(value => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
      message: 'O nome não pode conter números ou caracteres especiais',
    }),
  email: z.string().email('Insira um email válido'),
})

type EditAttendeeForm = z.infer<typeof editAttendeeForm>

interface AttendeeEditDialogProps {
  //   attendee: Attendee // Define que props terá um campo attendee do tipo Attendee
  slug: string
  onCloseDialog: () => void
}

const patchAttendee = z.object({
  slug: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
})

type AttendeePatch = z.infer<typeof patchAttendee>

export function CreateAttendeeDialog({
  slug,
  onCloseDialog,
}: AttendeeEditDialogProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState, reset } =
    useForm<EditAttendeeForm>({
      resolver: zodResolver(editAttendeeForm),
      mode: 'onChange',
    })

  async function handlePatchAteendee(data: EditAttendeeForm) {
    if (data.name === null && data.email === null) {
      return onCloseDialog()
    }

    const patchData: AttendeePatch = {
      slug,
      name: data.name,
      email: data.email,
    }
    await createAttendee(patchData)

    const eventslug = slug

    queryClient.invalidateQueries({ queryKey: ['attendees', eventslug] })
    onCloseDialog()
  }

  return (
    <DialogContent className="">
      <div className="flex flex-col justify-between h-full">
        <DialogTitle className="mb-1">Criar participante</DialogTitle>
        <DialogDescription className="mb-6">
          Inclua as informações necessárias e clique em salvar
        </DialogDescription>
        <form
          onSubmit={handleSubmit(handlePatchAteendee)}
          action=""
          className="flex flex-col justify-between h-full"
        >
          <div className="flex flex-1 gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-sm">
                Nome:
              </label>
              <div className="px-3 py-1.5 border border-orange-400/20 bg-transparent rounded-lg text-sm  gap-3 ">
                <Input
                  id="name"
                  placeholder="Nome Completo"
                  {...register('name')}
                  autoFocus
                />
              </div>
              {formState.errors.name && (
                <p className="text-red-400 text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-sm">
                Email:
              </label>
              <div className="px-3 py-1.5 border border-orange-400/20 bg-transparent rounded-lg text-sm ">
                <Input
                  id="email"
                  placeholder="Email válido"
                  {...register('email')}
                />
              </div>
              {formState.errors.email && (
                <p className="text-red-400 text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <DialogClose asChild className=" text-zinc-300">
              <button type="button" onClick={() => reset()}>
                Cancelar
              </button>
            </DialogClose>

            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-400/90 text-zinc-900 px-4 py-1.5 rounded-[4px]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}

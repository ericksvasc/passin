import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
// } from '../ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { createAttendee } from '../../http/create-attendee'
import { Button } from '../theme/ui/button'
import { Input } from '../theme/ui/input'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../theme/ui/dialog'

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
    reset()
  }

  return (
    <DialogContent className="bg-muted w-[600px] h-[400px]">
      <div className="flex flex-col justify-between h-full text-foreground">
        <DialogTitle className="mb-1">Criar participante</DialogTitle>
        <DialogDescription className="mb-6 text-muted-foreground">
          Inclua as informações necessárias e clique em salvar
        </DialogDescription>
        <form
          onSubmit={handleSubmit(handlePatchAteendee)}
          action=""
          className="flex flex-col justify-between h-full"
        >
          <div className="flex flex-1 gap-6">
            <div className="flex flex-col gap-2.5 w-full">
              <label htmlFor="name" className="text-sm">
                Nome:
              </label>

              <Input
                id="name"
                placeholder="Nome completo"
                {...register('name')}
                autoFocus
                className="bg-transparent dark:border-muted-foreground"
              />

              {formState.errors.name && (
                <p className="text-destructive text-sm">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <label htmlFor="name" className="text-sm">
                Email:
              </label>
              <Input
                id="email"
                {...register('email')}
                placeholder="Email válido"
                className="bg-transparent dark:border-muted-foreground"
              />
              {formState.errors.email && (
                <p className="text-destructive text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <DialogClose asChild>
              {/* <button type="button" onClick={() => reset()}>
                Cancelar
              </button> */}
              <Button
                className="hover:bg-muted-foreground/5"
                onClick={() => reset()}
                variant={'secondary'}
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" variant={'default'} size={'lg'}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}

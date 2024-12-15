import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog'
import { useEffect } from 'react'
import { attendeePatch } from '../../http/patchAttendee'
import { useQueryClient } from '@tanstack/react-query'
import type { AttendeeResponse } from '../../http/get-attendee'
import { Input } from '../theme/ui/input'
import { Button } from '../theme/ui/button'

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

interface Attendee {
  id: number
  name: string
  email: string
  createdAt: string
  checkInDate: string | null
}

interface AttendeeEditDialogProps {
  attendee: Attendee // Define que props terá um campo attendee do tipo Attendee
  slug: string
  onCloseDialog: () => void
}

const patchAttendee = z.object({
  attendeeId: z.number().int(),
  slug: z.string(),
  name: z.string().min(2).nullish(),
  email: z.string().email().nullish(),
})

type AttendeePatch = z.infer<typeof patchAttendee>

export function EditAttendee({
  attendee,
  onCloseDialog,
  slug,
}: AttendeeEditDialogProps) {
  const queryClient = useQueryClient()

  async function handlePatchAteendee(data: EditAttendeeForm) {
    if (data.name === attendee.name && data.email === attendee.email) {
      return onCloseDialog()
    }
    const patchData: AttendeePatch = {
      attendeeId: attendee.id,
      slug,
      name: data.name !== attendee.name ? data.name : null,
      email: data.email !== attendee.email ? data.email : null,
    }
    await attendeePatch(patchData)

    const ordersListcache = queryClient.getQueriesData<AttendeeResponse>({
      queryKey: ['attendees', slug],
    })

    for (let i = 0; i < ordersListcache.length; i++) {
      const [cacheKey, cacheData] = ordersListcache[i]

      if (!cacheData) {
        continue
      }

      queryClient.setQueryData<AttendeeResponse>(cacheKey, {
        ...cacheData,

        ateendees: cacheData.ateendees.map(attendeeCache => {
          if (attendeeCache.id === attendee.id) {
            return {
              ...attendeeCache,
              name:
                data.name !== attendeeCache.name
                  ? data.name
                  : attendeeCache.name,
              email:
                data.email !== attendeeCache.email
                  ? data.email
                  : attendeeCache.email,
            }
          }
          return attendeeCache
        }),
      })
    }

    onCloseDialog()
  }

  const { register, handleSubmit, reset } = useForm<EditAttendeeForm>({
    resolver: zodResolver(editAttendeeForm),
    defaultValues: {
      name: attendee.name,
      email: attendee.email,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (attendee) {
      reset({
        name: attendee.name || '',
        email: attendee.email || '',
      }) // Atualiza o estado com o novo attendee sempre que o prop mudar
    }
  }, [attendee, reset])

  return (
    <DialogContent className="bg-muted w-[440px] h-[380px]">
      <div className="flex flex-col h-full text-foreground">
        <DialogTitle className="mb-1">Editar Participante</DialogTitle>
        <DialogDescription className="mb-8 text-muted-foreground">
          Edite as informações necessárias e clique em salvar
        </DialogDescription>
        <form
          onSubmit={handleSubmit(handlePatchAteendee)}
          action=""
          className="flex flex-col h-full text-foreground"
        >
          <div className="flex flex-1 gap-6 flex-col">
            <div className="flex gap-2.5 w-full items-center">
              <label htmlFor="name" className="text-sm">
                Nome:
              </label>
              <Input
                id="name"
                placeholder="Nome Completo"
                type="text"
                className="bg-transparent border-primary/50"
                {...register('name')}
                autoFocus
              />
              {/* {formState.errors.name && (
                <p className="text-red-400 text-sm">
                  {formState.errors.name.message}
                </p>
              )} */}
            </div>

            <div className="flex gap-2.5 w-full items-center">
              <label htmlFor="name" className="text-sm">
                Email:
              </label>
              <Input
                id="email"
                placeholder="Email válido"
                type="email"
                className="bg-transparent border-primary/50"
                {...register('email')}
              />
            </div>
            {/* {formState.errors.email && (
              <p className="text-red-400 text-sm">
                {formState.errors.email.message}
              </p>
            )} */}
          </div>

          <div className="flex justify-end gap-5">
            <DialogClose asChild>
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

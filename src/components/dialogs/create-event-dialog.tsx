import { useForm } from 'react-hook-form'
import { boolean, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
// } from '../ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAttendee } from '../../http/create-attendee'
import { Button } from '../theme/ui/button'
import { Input } from '../theme/ui/input'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../theme/ui/dialog'
import { generateSlug } from '../functions/create-slug'
import { useEffect, useState } from 'react'
import { checkSlug } from '@/http/check-slug-'
import { Ban, CircleCheck, X } from 'lucide-react'
import { Textarea } from '../theme/ui/textarea'
import InputNumber from '../theme/ui/input-number'
import { Label } from 'react-aria-components'

const createEventForm = z.object({
  title: z.string().min(1, 'O titulo é obrigatório'),
  details: z.string(),
  maximumAttendees: z.string(),
  slug: z.string(),
})

type CreateEventForm = z.infer<typeof createEventForm>

interface AttendeeEditDialogProps {
  //   attendee: Attendee // Define que props terá um campo attendee do tipo Attendee
  onCloseDialog: () => void
  open: boolean
}

const postEvent = z.object({
  managerId: z.string(),
  title: z.string().min(1, 'O titulo é obrigatório'),
  details: z.string(),
  maximumAttendees: z.number(),
  slug: z.string(),
})

type PostEvent = z.infer<typeof postEvent>

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// {
//   onOpenDialog,
//   onCloseDialog,
// }: { onOpenDialog: () => void; onCloseDialog: () => void }

export function CreateEventDialog({
  onCloseDialog,
  open,
}: AttendeeEditDialogProps) {
  // const delay = 1000
  const [title, setTitle] = useState('')
  const [formSubmit, setFormSubimit] = useState<boolean>(false)
  // const [shouldCheckSlug, setShouldCheckSlug] = useState(false)
  // const [slugWasEdited, setSlugWasEdited] = useState<boolean>(false)
  // const [slugIsValid, setSlugIsValid] = useState<boolean>(false)
  // const debouncedTitle = useDebounce(title, delay)
  // const debouncedSubmit = useDebounce(formSubmit, delay)
  const [slug, setSlug] = useState('')
  // const debouncedSlug = useDebounce(slug, delay)

  const queryClient = useQueryClient()

  // const {
  //   mutateAsync: checkSlugMutate,
  //   isError: checkSlugError,
  //   status: slugCheckStatus,
  //   isPending: checkSlugIsPending,
  // } = useMutation({
  //   mutationFn: checkSlug,
  //   mutationKey: ['slug'],
  //   onSuccess: () => {
  //     setFormSubimit(true)
  //     setSlugIsValid(true)
  //   },
  //   onError: () => {
  //     setFormSubimit(false)
  //     setSlugIsValid(false)
  //   },
  // })

  const { register, handleSubmit, formState, reset, getValues, watch } =
    useForm<CreateEventForm>({
      resolver: zodResolver(createEventForm),
      mode: 'onChange',
      defaultValues: {
        title: title || '',
      },
    })

  async function handleCreateEvent(data: CreateEventForm) {
    // if (data.name === null && data.email === null) {
    //   return onCloseDialog()
    // }
    // const patchData: PostEvent = {
    //   slug,
    //   name: data.name,
    //   email: data.email,
    // }
    // await createAttendee(patchData)
    // const eventslug = slug
    // queryClient.invalidateQueries({ queryKey: ['attendees', eventslug] })
    // onCloseDialog()
    // reset()

    console.log(data)
  }

  // const slug = generateSlug(getValues().title)

  // useEffect(() => {
  //   const subscription = watch((value, { name }) => {
  //     if (name === 'title' && value.title) {
  //       console.log(value.title)
  //       setSlug(`/${generateSlug(value.title)}`)
  //       // checkSlugMutate(generateSlug(value.title))
  //     }
  //   })
  //   return () => subscription.unsubscribe()
  // }, [watch])

  // useEffect(() => {
  //   setSlug(`/${generateSlug(slug)}`)
  //   checkSlugMutate(generateSlug(slug))
  // }, [slug, checkSlugMutate])

  useEffect(() => {
    if (open) {
      setTitle('')
      reset({
        title: '',
        slug: '',
      })
      console.log('resetado')
    }
  }, [reset, open])

  // useEffect(() => {
  //   if (debouncedTitle !== '' && !slugWasEdited) {
  //     // const newSlug = `/${generateSlug(debouncedTitle)}`
  //     // setSlug(newSlug)

  //     checkSlugMutate(generateSlug(debouncedTitle))
  //   }
  // }, [debouncedTitle, checkSlugMutate, slugWasEdited])

  // useEffect(() => {
  //   if (slugWasEdited) {
  //     null
  //   } else {
  //     setSlug(generateSlug(title))
  //   }
  // }, [title, slugWasEdited])

  // useEffect(() => {
  //   setFormSubimit(false)
  //   setSlug(generateSlug(slug))
  // }, [slug])

  // useEffect(() => {
  //   if (debouncedSlug !== '' && shouldCheckSlug) {
  //     checkSlugMutate(generateSlug(debouncedSlug))
  //   }
  // }, [debouncedSlug, shouldCheckSlug, checkSlugMutate])

  // useEffect(() => {
  //   if (debouncedSlug) {
  //     const newSlug = `/${generateSlug(debouncedSlug)}`
  //     setSlug(newSlug)
  //     checkSlugMutate(generateSlug(debouncedSlug))
  //   }
  // }, [debouncedSlug, checkSlugMutate])

  // const { onChange: onChangeMaximium, ...rest } = register('maximumAttendees')

  const [maximumAttendees, setMaximumAttendees] = useState<number>(3)

  return (
    <DialogContent className="bg-muted max-w-full w-[800px] min-h-[600px] h-auto">
      <div className="flex flex-col justify-between h-full text-foreground">
        <DialogTitle className="mb-1">Criar evento</DialogTitle>
        <DialogDescription className="mb-6 text-muted-foreground">
          Inclua as informações necessárias e clique em criar
        </DialogDescription>
        <form
          onSubmit={handleSubmit(handleCreateEvent)}
          action=""
          className="flex flex-col justify-between h-full"
        >
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2.5 w-full">
              <label htmlFor="title" className="text-sm">
                Titulo:
              </label>

              <Input
                id="title"
                placeholder="Titulo"
                {...register('title')}
                autoFocus
                onChange={e => {
                  const value = e.target.value
                  setTitle(value)
                }}
                className="bg-transparent  dark:border-muted-foreground h-14 placeholder:text-sm md:text-lg "
              />

              {formState.errors.title && (
                <p className="text-destructive text-sm">
                  {formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <label htmlFor="description" className="text-sm">
                Descrição:
              </label>

              <Textarea
                className="bg-transparent border-b border dark:border-muted-foreground"
                placeholder="Descreva o seu evento"
                {...register('details')}
                id="description"
              />

              {formState.errors.details && (
                <p className="text-destructive text-sm">
                  {formState.errors.details.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <Label className="text-sm font-normal text-foreground">
                Número máximos de participantes:
              </Label>

              <InputNumber
                registration={register('maximumAttendees')}
                label="Participantes Máximos"
                minValue={1}
                defaultValue={100}
                onChange={e => {
                  setMaximumAttendees(e.target.value.toString().length)
                }}
                maximumAttendeesNumber={maximumAttendees}
              />

              {formState.errors.maximumAttendees && (
                <p className="text-destructive text-sm">
                  {formState.errors.maximumAttendees.message}
                </p>
              )}
            </div>

            {/* <div className="flex flex-col gap-2.5 w-full">
              <label htmlFor="name" className="text-sm">
                Slug:
              </label>
              <div className="flex items-center gap-3 w-full flex-1">
                <span>/</span>
                <div className="w-full flex rounded-md border border-input ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:border-muted-foreground items-center pr-2">
                  <Input
                    id="slug"
                    {...register('slug')}
                    value={slug}
                    placeholder="Slug"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    onChange={e => {
                      const value = e.target.value
                      setSlug(generateSlug(value))
                      setShouldCheckSlug(true)
                      setSlugWasEdited(true)
                    }}
                  />
                  {slugCheckStatus === 'idle' ? null : checkSlugError ? (
                    <X color="red" />
                  ) : (
                    slug !== '' && formSubmit && <CircleCheck color="green" />
                  )}
                </div>
              </div>
              {formState.errors.slug && (
                <p className="text-destructive text-sm">
                  {formState.errors.slug.message}
                </p>
              )}
            </div> */}
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

            <Button
              type="submit"
              variant={'default'}
              size={'lg'}
              // disabled={checkSlugError || (!formSubmit && !slugIsValid)}
            >
              Criar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}

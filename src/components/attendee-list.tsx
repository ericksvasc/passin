import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'

import { IconButton } from './ui/button'

import { type ChangeEvent, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptBR from 'dayjs/locale/pt-br'
// import { DialogTrigger } from './ui/dialog'
import { EditAttendee } from './dialogs/attendee-edit-dialog'
import { getAteendees } from '../http/get-attendee'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { checkinAttendee } from '../http/checkIn-attendee'
import { deleteCheckin } from '../http/delete-checkin'
import { CreateAttendeeDialog } from './dialogs/create-attendee-dialog'
import { ModelEditDialog } from './dialogs/modal-attendee-edit'
import { useParams, useSearchParams } from 'react-router-dom'
import { Button } from './theme/ui/button'
import { Input } from './theme/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './theme/ui/table'
import { Checkbox } from './theme/ui/checkbox'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from './theme/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { DialogTrigger } from './theme/ui/dialog'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

interface Attendee {
  id: number
  name: string
  email: string
  createdAt: string
  checkInDate: string | null
}

export function AttendeeList({
  onOpenDialog,
  onCloseDialog,
}: { onOpenDialog: () => void; onCloseDialog: () => void }) {
  const { eventslug } = useParams() // Captura o parâmetro da URL

  // const navigate = useNavigate()

  // useEffect(() => {
  //   if (eventId === null) {
  //     navigate('/events', { replace: true })
  //   }
  // }, [eventId, navigate])

  const queryClient = useQueryClient()

  const [editModelOpen, setEditModelOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const [attendeeEdit, setAttendeeEdit] = useState<Attendee | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const [attendeeName, setAttendeeName] = useState(() => {
    if (searchParams.has('attendeeName')) {
      return searchParams.get('attendeeName') || ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    if (searchParams.has('page')) {
      return Number(searchParams.get('page'))
    }

    return 1
  })
  const [totalAttendee, setTotalAttendee] = useState(10)

  const [attendees, setAttendees] = useState<Attendee[]>([])

  const { data } = useQuery({
    queryKey: ['attendees', eventslug, { page, attendeeName }],
    queryFn: () =>
      // if (eventslug) {
      getAteendees({
        page,
        attendeeName,
        slug: eventslug ?? '',
      }),
    // }
    // return Promise.reject(new Error('Event ID is required'))
    // enabled: !!eventslug, // Apenas executa a query se eventId for verdade (não null)
    staleTime: 1000 * 60, // 60 segundos
  })

  useEffect(() => {
    if (data) {
      setTotalAttendee(data.total)
      setAttendees(data.ateendees)
    }
  }, [data])

  useEffect(() => {
    setCurrentName(attendeeName)
  }, [attendeeName])

  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  function setCurrentName(name: string) {
    if (name !== '') {
      setSearchParams(prev => {
        prev.set('attendeeName', name)

        return prev
      })
    } else {
      setSearchParams(prev => {
        prev.delete('attendeeName')

        return prev
      })
    }
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())

    if (page !== 1) {
      url.searchParams.set('page', String(page))
    } else {
      url.searchParams.delete('page')
    }

    window.history.pushState({}, '', url)
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setAttendeeName(event.target.value)
    setPage(1)
  }
  function goToNextPage() {
    setPage(page + 1)
  }
  function goToInitialPage() {
    setPage(1)
  }
  function goToFinalPage() {
    setPage(Math.ceil(totalAttendee / 10))
  }
  function goTolastPage() {
    page > 1 && setPage(page - 1)
  }

  const lastPage = Math.ceil(totalAttendee / 10)

  // const handleDelete = () => {
  //   // Lógica para deletar os itens selecionados
  //   console.log('Deletar IDs:', selectedIds)
  //   // Aqui você pode chamar a API para deletar os itens ou atualizar o estado dos dados
  // }

  // const [isOpen, setIsOpen] = useState(false) // Controle do estado de abertura/fechamento

  // useEffect(() => {
  //   if (isOpen) {
  //     const timeout = setTimeout(() => {
  //       setIsOpen(false) // Fecha o Toast após 3 segundos
  //     }, 5000)

  //     return () => clearTimeout(timeout)
  //   }
  // }, [isOpen])

  // useEffect(() => {
  //   console.log(toasts)
  //   const timeout = setTimeout(() => {
  //     if (toasts.length > 0) {
  //       setToasts(prev => prev.slice(1)) // Remove o primeiro toast da lista
  //     }
  //   }, 5000)

  //   return () => clearTimeout(timeout)
  // }, [toasts])

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (!attendees) return

    const newSelected = checked
      ? new Set(attendees.map(attendee => attendee.id.toString()))
      : new Set<string>()

    setSelectedEvents(newSelected)
    console.log(newSelected)
  }

  const handleSelectEvent = (attendeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEvents)

    if (checked) {
      newSelected.add(attendeeId)
    } else {
      newSelected.delete(attendeeId)
    }

    setSelectedEvents(newSelected)

    console.log(newSelected)
  }

  const isAllSelected = attendees?.length
    ? selectedEvents.size === attendees.length
    : false

  interface HandelCheckin {
    attendeeIds: number[]
    name: string | null | undefined
  }

  async function handleCheckIn({ attendeeIds, name }: HandelCheckin) {
    await checkinAttendee(
      {
        attendeeIds,
        slug: eventslug ?? '',
      },
      queryClient
    )

    // if (name !== null && name !== undefined) {
    //   toast.success('Check-in realizado', {
    //     description: `${name}`,
    //     action: {
    //       label: 'Cancelar',
    //       onClick: () =>
    //         deleteCheckin(
    //           {
    //             attendeeIds,
    //             slug: eventslug ?? '',
    //           },
    //           queryClient
    //         ),
    //     },
    //     position: 'top-right',
    //     richColors: false,
    //   })
    // }

    if (attendeeIds.length > 1) {
      toast.success('Check-in em lote com sucesso', {
        action: {
          label: 'Cancelar',
          onClick: () =>
            deleteCheckin(
              {
                attendeeIds,
                slug: eventslug ?? '',
              },
              queryClient
            ),
        },
        position: 'top-right',
        richColors: false,
      })
    } else
      toast.success('Check-in realizado', {
        description: `${name}`,
        action: {
          label: 'Cancelar',
          onClick: () =>
            deleteCheckin(
              {
                attendeeIds,
                slug: eventslug ?? '',
              },
              queryClient
            ),
        },
        position: 'top-right',
        richColors: false,
      })
  }

  const [selectedAction, setSelectedAction] = useState<string>('')

  const attendeesToCheckIn = Array.from(selectedEvents)
    .map(id => Number(id))
    .filter(id => {
      const attendee = attendees.find(a => a.id === id)
      return attendee && attendee.checkInDate === null
    })

  async function handleApplyAction() {
    if (selectedAction === 'checkin') {
      // Filter out attendees that already have check-ins

      if (attendeesToCheckIn.length === 0) {
        toast.error('Nenhum participante selecionado precisa de check-in')
        return
      }

      const name =
        attendeesToCheckIn.length === 1
          ? attendees.find(a => a.id === attendeesToCheckIn[0])?.name || null
          : null

      await handleCheckIn({
        attendeeIds: attendeesToCheckIn,
        name,
      })

      // Clear selections after successful action
      // setSelectedEvents(new Set())
      setSelectedAction('')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* {attendeeEdit ? <AttendeeEditDialog attendee={attendeeEdit} /> : null} */}
      {editModelOpen === false ? (
        attendeeEdit ? (
          <EditAttendee
            attendee={attendeeEdit}
            slug={eventslug ?? ''}
            onCloseDialog={onCloseDialog}
          />
        ) : (
          <CreateAttendeeDialog
            slug={eventslug ?? ''}
            onCloseDialog={onCloseDialog}
          />
        )
      ) : (
        <ModelEditDialog
          // eventId={eventId ?? ''}
          // slug={eventslug ?? ''}
          onCloseDialog={onCloseDialog}
          menuPosition={menuPosition}
          onOpenEdit={() => setEditModelOpen(false)}
        />
      )}

      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold text-foreground">Participantes</h1>

        <div className="flex px-3 py-1.5 items-center gap-3 border border-input rounded-md w-72 focus-within:ring-2 focus-within:ring-ring h-10">
          <Search size={16} className="text-muted-foreground" />

          <Input
            className="outline-none border-0 h-full text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 p-0 m-0"
            placeholder="Buscar participante"
            onChange={onSearchInputChanged}
            value={attendeeName}
          />
        </div>
        {selectedEvents.size > 0 && (
          <>
            <Select
              onValueChange={value => {
                setSelectedAction(value)
              }}
              value={selectedAction}
            >
              <SelectTrigger className="w-[210px] text-foreground">
                <SelectValue placeholder="Ações no participante" />
              </SelectTrigger>
              <SelectContent className="text-foreground">
                <SelectGroup>
                  <SelectItem value="cancelar">Cancelar</SelectItem>
                  {attendeesToCheckIn.length >= 1 && (
                    <SelectItem
                      value="checkin"
                      // onSelect={() => {
                      //   // handleCheckIn({
                      //   //   attendeeIds: Array.from(selectedEvents).map(id =>
                      //   //     Number(id)
                      //   //   ),
                      //   //   name: 'erick',
                      //   // })
                      // }}
                    >
                      Fazer checkin
                    </SelectItem>
                  )}
                  <SelectItem value="deletar">Deletar</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={() => handleApplyAction()}>Aplicar</Button>
          </>
        )}

        <DialogTrigger
          onClick={() => {
            setEditModelOpen(false)
            setAttendeeEdit(null)
            onOpenDialog()
          }}
          asChild
        >
          <Button className="ml-auto">
            <Plus size={25} />
            Novo participante
          </Button>
        </DialogTrigger>
      </div>

      {/* Tabela de participantes */}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="h-16 border-b hover:bg-inherit">
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="bg-secondary size-5 border-secondary-foreground dark:border-border"
                />
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Participante</TableHead>
              <TableHead>Data de inscrição</TableHead>
              <TableHead>Data do check-in</TableHead>
              <TableHead className="w-[48px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map(dataE => {
              return (
                <TableRow key={dataE.id} className="text-foreground">
                  <TableCell>
                    <Checkbox
                      checked={selectedEvents.has(dataE.id.toString())}
                      onCheckedChange={checked => {
                        handleSelectEvent(
                          dataE.id.toString(),
                          checked as boolean
                        )
                      }}
                      className="bg-secondary size-5 border-secondary-foreground dark:border-border"
                    />
                  </TableCell>
                  <TableCell>{dataE.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{dataE.name}</span>
                      <span className="text-muted-foreground">
                        {dataE.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{dayjs().to(dataE.createdAt)}</TableCell>
                  <TableCell>
                    {dataE.checkInDate === null ? (
                      <span className="text-orange-500/95">
                        <button
                          type="button"
                          onClick={() =>
                            handleCheckIn({
                              attendeeIds: [dataE.id],
                              name: dataE.name,
                            })
                          }
                        >
                          Confirmar check-in
                        </button>
                      </span>
                    ) : (
                      dayjs().to(dataE.checkInDate)
                    )}
                  </TableCell>
                  <TableCell>
                    <DialogTrigger
                      onClick={event => {
                        setEditModelOpen(true)
                        setAttendeeEdit(dataE)
                        onOpenDialog()
                        setMenuPosition({
                          x: event.currentTarget.getBoundingClientRect().left,
                          y: event.currentTarget.getBoundingClientRect().bottom,
                        })
                      }}
                      asChild
                    >
                      <IconButton>
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter className="h-16">
            <TableRow className="text-muted-foreground bg-background hover:bg-background">
              <TableCell className="py-3 px-4 text-sm" colSpan={3}>
                Mostrando {attendees.length} de {totalAttendee} itens
              </TableCell>
              <TableCell className="text-right" colSpan={3}>
                <div className="flex items-center justify-end gap-8">
                  <span>
                    Página {page} de {lastPage}{' '}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <IconButton
                      onClick={() => page > 1 && goToInitialPage()}
                      variant="left"
                      disabled={page === 1}
                    >
                      <ChevronsLeft size={16} />
                    </IconButton>
                    <IconButton
                      onClick={() => page > 1 && goTolastPage()}
                      variant="left"
                      disabled={page === 1}
                    >
                      <ChevronLeft size={16} />
                    </IconButton>
                    <IconButton
                      disabled={page === lastPage}
                      onClick={() => page !== lastPage && goToNextPage()}
                      variant="right"
                    >
                      <ChevronRight size={16} />
                    </IconButton>
                    <IconButton
                      onClick={() => page !== lastPage && goToFinalPage()}
                      variant="right"
                      disabled={page === lastPage}
                    >
                      <ChevronsRight size={16} />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* </div> */}
    </div>
  )
}

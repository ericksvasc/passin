import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'

import { CheckboxIndicator, CheckboxRoot } from './ui/checkbox'
import { IconButton } from './ui/button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCel } from './table/table-cel'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptBR from 'dayjs/locale/pt-br'
import { DialogTrigger } from './ui/dialog'
import { EditAttendee } from './dialogs/attendee-edit-dialog'
import { getAteendees } from '../http/get-attendee'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { checkinAttendee } from '../http/checkIn-attendee'
import {
  ToastDescription,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from '../components/ui/toast'
import { deleteCheckin } from '../http/delete-checkin'
import { CreateAttendeeDialog } from './dialogs/create-attendee-dialog'
import { ModelEditDialog } from './dialogs/modal-attendee-edit'
import { useParams, useSearchParams } from 'react-router-dom'

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
  // const [searchParams] = useSearchParams()

  // const eventId = searchParams.get('eventId')

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

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelect = (id: number) => {
    const stringId = id.toString() // Converte o id para string
    if (selectedIds.includes(stringId)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== stringId))
    } else {
      setSelectedIds([...selectedIds, stringId])
    }
  }

  useEffect(() => {
    console.log('Deletar IDs:', selectedIds)
  }, [selectedIds])

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

  const [toasts, setToasts] = useState<Attendee[]>([]) // Lista de toasts
  const toastTimers = useRef<Map<number, NodeJS.Timeout>>(new Map())

  // useEffect(() => {
  //   console.log(toasts)
  //   const timeout = setTimeout(() => {
  //     if (toasts.length > 0) {
  //       setToasts(prev => prev.slice(1)) // Remove o primeiro toast da lista
  //     }
  //   }, 5000)

  //   return () => clearTimeout(timeout)
  // }, [toasts])

  return (
    <div className="flex flex-col gap-6">
      {toasts.map(attendee => (
        <ToastRoot
          key={attendee.id}
          open={true}
          // onOpenChange={setIsOpen}
          duration={6000}
        >
          <ToastTitle>Checkin Realizado</ToastTitle>
          <ToastDescription>{attendee.name}</ToastDescription>
          {/* <ToastAction altText="teste" asChild> */}
          <button
            type="button"
            className="text-orange-500 inline-flex h-[30px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
            onClick={() => {
              deleteCheckin(
                {
                  attendeeId: attendee.id,
                  slug: eventslug ?? '',
                },
                queryClient
              )

              setToasts(prev => prev.filter(t => t.id !== attendee.id))

              const timer = toastTimers.current.get(attendee.id)
              if (timer) {
                clearTimeout(timer)
                toastTimers.current.delete(attendee.id)
              }
            }}
          >
            Cancelar
          </button>
          {/* </ToastAction> */}
        </ToastRoot>
      ))}
      <ToastViewport />

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
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="flex items-center px-3 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm w-72 gap-3">
          <Search size={16} className="text-emerald-100" />
          <input
            className="bg-transparent flex-1 outline-none gap-3"
            type="text"
            placeholder="Buscar participante"
            onChange={onSearchInputChanged}
            value={attendeeName}
          />
        </div>
        <DialogTrigger
          onClick={() => {
            setEditModelOpen(false)
            setAttendeeEdit(null)
            onOpenDialog()
          }}
          asChild
        >
          <button
            className="ml-auto flex gap-3 text-zinc-50 text-base bg-[#eb5a0c] px-2.5 py-2 rounded-md justify-center items-center"
            type="button"
          >
            <Plus size={25} />
            Novo participante
          </button>
        </DialogTrigger>
      </div>

      {/* Tabela de participantes */}

      <Table className="bg-[#0d0b0a]">
        <thead>
          <tr className="border-b border-white/10 h-16">
            <TableHeader className="w-[48px]">
              <CheckboxRoot>
                <CheckboxIndicator>
                  <CheckIcon size={14} strokeWidth={3} />
                </CheckboxIndicator>
              </CheckboxRoot>
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader className="w-[48px]" />
          </tr>
        </thead>
        <tbody>
          {attendees.map(dataE => {
            return (
              <tr
                key={dataE.id}
                className="border-b border-white/10 text-zinc-300 hover:bg-zinc-50/5 transition-opacity duration-1000 ease-in-out"
              >
                <TableCel>
                  <CheckboxRoot
                    onCheckedChange={() => handleSelect(dataE.id)}
                    // checked={selectedIds.includes(dataE.id.toString())} // Converte o número para string
                  >
                    <CheckboxIndicator>
                      <CheckIcon size={14} strokeWidth={3} />
                    </CheckboxIndicator>
                  </CheckboxRoot>
                </TableCel>
                <TableCel>{dataE.id}</TableCel>
                <TableCel>
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-50 font-semibold">
                      {dataE.name}
                    </span>
                    <span>{dataE.email}</span>
                  </div>
                </TableCel>
                <TableCel>{dayjs().to(dataE.createdAt)}</TableCel>
                <TableCel>
                  {dataE.checkInDate === null ? (
                    <span className="text-orange-500/95">
                      <button
                        type="button"
                        onClick={() => {
                          checkinAttendee(
                            {
                              attendeeId: dataE.id,
                              slug: eventslug ?? '',
                            },
                            queryClient
                          )
                          // setIsOpen(true)
                          setToasts(prev => [...prev, dataE])

                          const existingTimeout = toastTimers.current.get(
                            dataE.id
                          )
                          if (existingTimeout) {
                            clearTimeout(existingTimeout)
                          }

                          // Cria um novo timeout para remover o toast após 5 segundos
                          const timeout = setTimeout(() => {
                            setToasts(prev =>
                              prev.filter(t => t.id !== dataE.id)
                            ) // Remove o toast
                            toastTimers.current.delete(dataE.id) // Remove o timer associado
                          }, 5000)

                          toastTimers.current.set(dataE.id, timeout) // Salva o novo timer
                        }}
                      >
                        Confirmar check-in
                      </button>
                    </span>
                  ) : (
                    dayjs().to(dataE.checkInDate)
                  )}
                </TableCel>
                <TableCel>
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
                </TableCel>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="">
          <tr className="text-zinc-300">
            <TableCel className="py-3 px-4 text-sm" colSpan={3}>
              Mostrando {attendees.length} de {totalAttendee} itens
            </TableCel>
            <TableCel className="text-right" colSpan={3}>
              <div className="flex items-center justify-end gap-8">
                <span>
                  Página {page} de {lastPage}{' '}
                </span>
                <div className="flex items-center gap-1.5">
                  <IconButton
                    onClick={goToInitialPage}
                    variant="left"
                    disabled={page === 1}
                  >
                    <ChevronsLeft size={16} />
                  </IconButton>
                  <IconButton
                    onClick={goTolastPage}
                    variant="left"
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    variant="right"
                    disabled={page === lastPage}
                  >
                    <ChevronRight size={16} />
                  </IconButton>
                  <IconButton
                    onClick={goToFinalPage}
                    variant="right"
                    disabled={page === lastPage}
                  >
                    <ChevronsRight size={16} />
                  </IconButton>
                </div>
              </div>
            </TableCel>
          </tr>
        </tfoot>
      </Table>
      {/* </div> */}
    </div>
  )
}

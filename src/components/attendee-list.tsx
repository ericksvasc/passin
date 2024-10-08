import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'

import { CheckboxIndicator, CheckboxRoot } from './ui/checkbox'
import { IconButton } from './ui/button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCel } from './table/table-cel'
import { type ChangeEvent, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptBR from 'dayjs/locale/pt-br'
import { env } from '../env'
import { DialogTrigger } from './ui/dialog'
import { AttendeeEditDialog } from './attendee-edit-dialog'
import { EditAttendee } from './attendee-edit-dialo2'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

interface Attendee {
  id: number
  name: string
  email: string
  createdAt: string
  checkInDate: string | null
}

// interface AttendeeTableProps {
//   attendees: Attendee[]
// }

export function AttendeeList() {
  const [attendeeEdit, setAttendeeEdit] = useState<Attendee | null>(null)

  const [InputValue, setValueInput] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('name')) {
      return url.searchParams.get('name') || ''
    }

    return ''
  })
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())
    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })
  const [totalAttendee, setTotalAttendee] = useState(10)

  const [attendees, setAttendees] = useState<Attendee[]>([])

  useEffect(() => {
    if (!env.databaseUrl) {
      console.error('Database URL is not defined')
      return
    }

    const url = new URL(
      `${env.databaseUrl}/events/hr0e68xev2zkbuh71mai0szz/ateendees`
    )
    url.searchParams.set('pageIndex', String(page - 1))
    if (InputValue.length > 0) {
      url.searchParams.set('name', InputValue)
    }
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.ateendess)
        setTotalAttendee(data.total)
      })
  }, [page, InputValue])

  useEffect(() => {
    setCurrentName(InputValue)
  }, [InputValue])

  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  function setCurrentName(InputValue: string) {
    const url = new URL(window.location.toString())

    if (InputValue !== '') {
      url.searchParams.set('name', InputValue)
    } else {
      url.searchParams.delete('name')
    }

    window.history.pushState({}, '', url)
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
    setValueInput(event.target.value)
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

  return (
    <div className="flex flex-col gap-6">
      {/* {attendeeEdit ? <AttendeeEditDialog attendee={attendeeEdit} /> : null} */}
      {attendeeEdit ? <EditAttendee attendee={attendeeEdit} /> : null}
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="flex items-center px-3 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm w-72 gap-3">
          <Search size={16} className="text-emerald-100" />
          <input
            className="bg-transparent flex-1 outline-none gap-3"
            type="text"
            placeholder="Buscar participante"
            onChange={onSearchInputChanged}
            value={InputValue}
          />
        </div>
      </div>

      {/* Tabela de participantes */}

      <Table>
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
                    <span className="text-zinc-400">Não fez o check-in</span>
                  ) : (
                    dayjs().to(dataE.checkInDate)
                  )}
                </TableCel>
                <TableCel>
                  <DialogTrigger
                    onClick={() => {
                      setAttendeeEdit(dataE)
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

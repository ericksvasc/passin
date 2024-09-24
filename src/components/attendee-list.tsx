import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from 'lucide-react'
// import { Input } from '../ui/input'
import { CheckboxIndicator, CheckboxRoot } from './ui/checkbox'
import { IconButton } from './ui/button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCel } from './table/table-cel'
import { type ChangeEvent, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptBR from 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

interface Attendee {
  id: number
  name: string
  email: string
  createdAt: string
  checkInDate: string | null
}

export function AttendeeList() {
  const [InputValue, setValueInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalAttendee, setTotalAttendee] = useState(10)

  const [attendees, setAttendees] = useState<Attendee[]>([])

  useEffect(() => {
    const url = new URL(
      'http://localhost:5273/events/hr0e68xev2zkbuh71mai0szz/ateendees'
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

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setValueInput(event.target.value)
    setPage(1)
  }
  function goToNextPage() {
    page < Math.ceil(totalAttendee / 10) && setPage(page + 1)
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="flex items-center px-3 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm w-72 gap-3">
          <Search size={16} className="text-emerald-100" />
          <input
            className="bg-transparent flex-1 outline-none gap-3"
            type="text"
            placeholder="Buscar participante"
            onChange={onSearchInputChanged}
          />

          {/* <Input placeholder="Buscar participante" /> */}
        </div>
      </div>

      {/* Tabela de participantes */}

      {/* <div className="rounded-lg border border-white/10"> */}
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
                  <CheckboxRoot>
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
                  <IconButton>
                    <MoreHorizontal size={16} />
                  </IconButton>
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

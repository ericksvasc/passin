import { useQuery } from '@tanstack/react-query'
import { CheckIcon, Plus, Search } from 'lucide-react'
import { getEvents } from '../http/get-events'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { CheckboxIndicator, CheckboxRoot } from './ui/checkbox'
import { TableCel } from './table/table-cel'
import { Link } from 'react-router-dom'

export function EventsList() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Eventos</h1>

        <div className="flex items-center px-3 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm w-72 gap-3">
          <Search size={16} className="text-emerald-100" />
          <input
            className="bg-transparent flex-1 outline-none gap-3"
            type="text"
            placeholder="Buscar participante"
            // onChange={onSearchInputChanged}
            // value={InputValue}
          />
        </div>
        {/* <DialogTrigger
          onClick={() => {
            // setEditModelOpen(false)
            // setAttendeeEdit(null)
            // onOpenDialog()
          }}
          asChild
        > */}
        <button
          className="ml-auto flex gap-3 text-zinc-50 text-base bg-[#eb5a0c] px-2.5 py-2 rounded-md justify-center items-center"
          type="button"
        >
          <Plus size={25} />
          Novo evento
        </button>
        {/* </DialogTrigger> */}
      </div>

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
            <TableHeader>Nome</TableHeader>
            <TableHeader>Número de Participantes</TableHeader>
            <TableHeader>Máximo de Participantes</TableHeader>
            <TableHeader>Participantes</TableHeader>
            <TableHeader className="w-[48px]" />
          </tr>
        </thead>
        <tbody>
          {events?.map(event => {
            return (
              <tr
                key={event.id}
                className="border-b border-white/10 text-zinc-300 hover:bg-zinc-50/5 transition-opacity duration-1000 ease-in-out h-16"
              >
                <TableCel>
                  <CheckboxRoot>
                    <CheckboxIndicator>
                      <CheckIcon size={14} strokeWidth={3} />
                    </CheckboxIndicator>
                  </CheckboxRoot>
                </TableCel>
                <TableCel>{event.title}</TableCel>
                <TableCel>{event.attendeeCount}</TableCel>
                <TableCel>{event.maximumAttendees}</TableCel>
                <TableCel className="text-orange-500">
                  <Link to={`/events/${event.slug}/attendees`}>
                    Ver participantes
                  </Link>
                </TableCel>
                <TableCel />
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

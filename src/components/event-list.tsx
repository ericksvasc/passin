import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { getEvents } from '../http/get-events'

import { Link } from 'react-router-dom'
import { Button } from './theme/ui/button'
import { Input } from './theme/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './theme/ui/table'
import { Checkbox } from './theme/ui/checkbox'
import { useState } from 'react'
import { CreateEventDialog } from './dialogs/create-event-dialog'
import { Dialog, DialogTrigger } from './theme/ui/dialog'

export function EventsList() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60,
  })

  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (!events) return

    const newSelected = checked
      ? new Set(events.map(event => event.id))
      : new Set<string>()

    setSelectedEvents(newSelected)
  }

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    const newSelected = new Set(selectedEvents)

    if (checked) {
      newSelected.add(eventId)
    } else {
      newSelected.delete(eventId)
    }

    setSelectedEvents(newSelected)
  }

  const isAllSelected = events?.length
    ? selectedEvents.size === events.length
    : false

  const [isOpen, setIsOpen] = useState(false) // Controle do estado de abertura/fechamento

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-6">
        <CreateEventDialog
          onCloseDialog={() => setIsOpen(false)}
          open={isOpen}
        />
        <div className="flex gap-4 items-center">
          <h1 className="text-foreground text-2xl font-bold">Eventos</h1>

          <div className="flex px-3 py-1.5 items-center gap-3 border border-input rounded-md w-72 focus-within:ring-2 focus-within:ring-ring h-10">
            <Search size={16} className="text-muted-foreground" />

            <Input
              className="outline-none border-0 h-full text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 p-0 m-0"
              placeholder="Buscar eventos"
            />
          </div>

          {/* <div className="flex items-center px-3 py-1.5 border border-input bg-transparent rounded-lg text-sm w-72 gap-3">
          <Search
            size={16}
            className="dark:text-emerald-100 text-emerald-700"
          />

          <input
            className="bg-transparent text-foreground flex-1 outline-none gap-3"
            type="text"
            placeholder="Buscar participante"
            // onChange={onSearchInputChanged}
            // value={InputValue}
          />
        </div> */}
          <DialogTrigger
            onClick={() => {
              // setEditModelOpen(false)
              // setAttendeeEdit(null)
              setIsOpen(true)
            }}
            asChild
          >
            <Button className="ml-auto">
              <Plus size={25} />
              Novo evento
            </Button>
          </DialogTrigger>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader className="h-16 border-b">
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="bg-secondary size-5 border-secondary-foreground dark:border-border"
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Número de Participantes</TableHead>
              <TableHead>Máximo de Participantes</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead className="w-[48px]" />
            </TableHeader>

            <TableBody>
              {events?.map(event => {
                return (
                  <TableRow
                    key={event.id}
                    className="h-[69.23px] text-foreground"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedEvents.has(event.id)}
                        onCheckedChange={checked =>
                          handleSelectEvent(event.id, checked as boolean)
                        }
                        className="bg-secondary size-5 border-secondary-foreground dark:border-border"
                      />
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.attendeeCount}</TableCell>
                    <TableCell>{event.maximumAttendees}</TableCell>
                    <TableCell className="dark:text-primary text-primary font-medium">
                      <Link to={`/events/${event.slug}/attendees`}>
                        Ver participantes
                      </Link>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Dialog>
  )
}

import { EventsList } from '../components/event-list'
import { Header } from '../components/header'

export function Events() {
  return (
    <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
      <Header />
      <EventsList />
    </div>
  )
}

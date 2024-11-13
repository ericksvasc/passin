import { useState } from 'react'
import { AttendeeList } from '../components/attendee-list'
import { Header } from '../components/header'
import { Dialog } from '../components/ui/dialog'
import { ToastProvider } from '../components/ui/toast'

export function Attendees() {
  const [isOpen, setIsOpen] = useState(false) // Controle do estado de abertura/fechamento
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <ToastProvider swipeDirection="right">
        <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
          <Header />
          <AttendeeList
            onOpenDialog={() => setIsOpen(true)}
            onCloseDialog={() => setIsOpen(false)}
          />
        </div>
      </ToastProvider>
    </Dialog>
  )
}

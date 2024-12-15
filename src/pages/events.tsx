import { useState } from 'react'
import { EventsList } from '../components/event-list'
import { Header } from '../components/header'
import { ToastProvider } from '@/components/ui/toast'

export function Events() {
  const [isOpen, setIsOpen] = useState(false) // Controle do estado de abertura/fechamento
  return (
    <ToastProvider swipeDirection="right">
      <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
        <Header />
        <EventsList
        // onOpenDialog={() => setIsOpen(true)}
        // onCloseDialog={() => setIsOpen(false)}
        />
      </div>
    </ToastProvider>
  )
}

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Attendees } from './pages/attendees'
import { NotFound } from './pages/notFound'
import { Events } from './pages/events'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Attendees />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </BrowserRouter>
  )
}

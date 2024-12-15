import { createBrowserRouter } from 'react-router-dom'
import { Attendees } from './pages/attendees'
import { Events } from './pages/events'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Events />,
  },
  {
    path: '/events',
    element: <Events />,
  },
  {
    path: '/events/:eventslug/attendees',
    element: <Attendees />,
  },
])

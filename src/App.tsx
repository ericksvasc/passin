import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export function App() {
  return (
    <RouterProvider router={router} />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="*" element={<NotFound />} />
    //     <Route path="/" element={<Attendees />} />
    //     <Route path="/events" element={<Events />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

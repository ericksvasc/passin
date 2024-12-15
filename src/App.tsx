import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider } from './components/theme/theme-provider'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import { Toaster } from 'sonner'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="passin-theme">
      <HelmetProvider>
        <Helmet titleTemplate="%s | passin" />
        <Toaster
          richColors
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                'mb-16 px-4 py-2 h-[68px] w-[350px] flex items-center bg-secondary-foreground rounded-lg text-sm text-secondary',
              actionButton:
                'bg-destructive rounded-sm px-1.5 py-1 text-secondary-foreground text-sm font-medium',
              icon: 'mr-4',
              description: 'text-sm text-muted',
            },
          }}
        />
        <RouterProvider router={router} />
      </HelmetProvider>
    </ThemeProvider>
  )
}

import { api } from '../lib/axios'

interface CreateEvent {
  title: string
  details?: string
  maximumAttendees?: number
}

type EventResponse = {
  title: string
  details: string | null
  maximumAttendees: number | null
  id: string
  slug: string
}

export async function createEvent({
  title,
  details,
  maximumAttendees,
}: CreateEvent): Promise<EventResponse> {
  const result = await api.post<EventResponse>('/events', {
    title,
    details,
    maximumAttendees,
  })

  return result.data
}

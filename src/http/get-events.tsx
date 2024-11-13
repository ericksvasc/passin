import { api } from '../lib/axios'

export type GetEventsResponse = {
  id: string
  title: string
  details: string | null
  slug: string
  maximumAttendees: number | null
  attendeeCount: number
}[]

export async function getEvents(): Promise<GetEventsResponse> {
  const result = await api.get<GetEventsResponse>('/events')

  return result.data
}

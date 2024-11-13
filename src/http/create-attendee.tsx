import { api } from '../lib/axios'

interface PatchAttendee {
  slug: string
  name: string
  email: string
}

type AttendeeResponse = {
  ateendeeId: number
  name: string
  email: string
  eventId: string
  createdAt: string
}

export async function createAttendee({
  slug,
  name,
  email,
}: PatchAttendee): Promise<AttendeeResponse> {
  const result = await api.post<AttendeeResponse>(`/events/${slug}/attendees`, {
    name,
    email,
  })

  return result.data
}

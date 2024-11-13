import { api } from '../lib/axios'

interface GetAttendee {
  page: number
  attendeeName: string
  slug: string
}

export type AttendeeResponse = {
  ateendees: {
    id: number
    name: string
    email: string
    createdAt: string
    checkInDate: string | null
  }[]
  total: number
  eventName: string
}

export async function getAteendees({
  page,
  attendeeName,
  slug,
}: GetAttendee): Promise<AttendeeResponse> {
  const result = await api.get<AttendeeResponse>(`/events/${slug}/ateendees`, {
    params: {
      pageIndex: page === 1 ? null : page - 1,
      attendeeName: attendeeName ? attendeeName : null,
    },
  })

  return result.data
}

import type { QueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { AttendeeResponse } from './get-attendee'
import dayjs from 'dayjs'

interface PatchAttendee {
  attendeeId: number
  slug: string
}

export async function checkinAttendee(
  { attendeeId, slug }: PatchAttendee,
  queryClient: QueryClient
) {
  await api.get(`/attendees/${slug}/${attendeeId}/check-in`)

  const ordersListcache = queryClient.getQueriesData<AttendeeResponse>({
    queryKey: ['attendees'],
  })

  for (let i = 0; i < ordersListcache.length; i++) {
    const [cacheKey, cacheData] = ordersListcache[i]

    if (!cacheData) {
      continue
    }

    queryClient.setQueryData<AttendeeResponse>(cacheKey, {
      ...cacheData,
      ateendees: cacheData.ateendees.map(attendee => {
        if (attendee.id === attendeeId) {
          return {
            ...attendee,
            checkInDate: dayjs().format(),
          }
        }
        return attendee
      }),
    })
  }
}

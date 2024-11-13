import type { QueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { AttendeeResponse } from './get-attendee'

interface DeleteCheckin {
  attendeeId: number
  slug: string
}

export async function deleteCheckin(
  { attendeeId, slug }: DeleteCheckin,
  queryClient: QueryClient
) {
  await api.delete(`/attendees/${slug}/${attendeeId}/check-in`)

  // queryClient.invalidateQueries({ queryKey: ['attendees'] })

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
            checkInDate: null,
          }
        }
        return attendee
      }),
    })
  }
}

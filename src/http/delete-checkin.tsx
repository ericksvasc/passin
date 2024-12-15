import type { QueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { AttendeeResponse } from './get-attendee'

interface DeleteCheckin {
  attendeeIds: number[]
  slug: string
}

export async function deleteCheckin(
  { attendeeIds, slug }: DeleteCheckin,
  queryClient: QueryClient
) {
  await api.post(`/attendees/${slug}/check-in/delete`, {
    attendeeIds,
  })

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
        const isCheckedIn = attendeeIds.includes(attendee.id)
        return isCheckedIn
          ? {
              ...attendee,
              checkInDate: null,
            }
          : attendee
      }),
    })
  }
}

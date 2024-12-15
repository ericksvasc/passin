import type { QueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { AttendeeResponse } from './get-attendee'
import dayjs from 'dayjs'

interface PatchAttendee {
  attendeeIds: number[]
  slug: string
}

export async function checkinAttendee(
  { attendeeIds, slug }: PatchAttendee,
  queryClient: QueryClient
) {
  await api.post(`/attendees/${slug}/check-in`, {
    attendeeIds,
  })

  const ordersListcache = queryClient.getQueriesData<AttendeeResponse>({
    queryKey: ['attendees'],
  })

  for (let i = 0; i < ordersListcache.length; i++) {
    const [cacheKey, cacheData] = ordersListcache[i]

    if (!cacheData) {
      continue
    }

    // queryClient.setQueryData<AttendeeResponse>(cacheKey, {
    //   ...cacheData,
    //   ateendees: cacheData.ateendees.map(attendee => {
    //     attendeeId.map(id => {
    //       if (attendee.id === id) {
    //         return {
    //           ...attendee,
    //           checkInDate: dayjs().format(),
    //         }
    //       }
    //     })

    //     // if (attendee.id === attendeeId) {
    //     //   return {
    //     //     ...attendee,
    //     //     checkInDate: dayjs().format(),
    //     //   }
    //     // }
    //     return attendee
    //   }),
    // })

    queryClient.setQueryData<AttendeeResponse>(cacheKey, {
      ...cacheData,
      ateendees: cacheData.ateendees.map(attendee => {
        const isCheckedIn = attendeeIds.includes(attendee.id)
        return isCheckedIn
          ? {
              ...attendee,
              checkInDate: dayjs().format(),
            }
          : attendee
      }),
    })
  }
}

import { api } from '../lib/axios'

interface PatchAttendee {
  attendeeId: number
  name?: string | null
  email?: string | null
  slug: string
}

export async function attendeePatch({
  attendeeId,
  name,
  email,
  slug,
}: PatchAttendee) {
  // await fetch(`${env.databaseUrl}/attendees/${eventId}/${attendeeId}`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     name,
  //     email,
  //   }),
  // }).then(response => response.json())

  api.patch(`/attendees/${slug}/${attendeeId}`, { name, email })
}

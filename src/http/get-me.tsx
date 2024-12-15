import { api } from '@/lib/axios'

export type GetMeResponse = {
  name: string
  id: string
  email: string
  phone: string
  role: 'manager' | 'attendee' | null
  createdAt: Date
  updatedAt: Date
}

export async function getMe(): Promise<GetMeResponse> {
  const result = await api.get<GetMeResponse>('/api/me')

  return result.data
}

import { api } from '@/lib/axios'

export async function checkSlug(slug: string) {
  return await api.get(`/checkslug/${slug}`)
}

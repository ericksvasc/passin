import { getMe } from '@/http/get-me'
import { useQuery } from '@tanstack/react-query'
import { Dialog } from './theme/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './theme/ui/dropdown-menu'
import { Avatar, AvatarFallback } from './theme/ui/avatar'

export function AccountMenu() {
  function getNameInitials(fullName: string) {
    const nameParts = fullName.trim().split(/\s+/)

    if (nameParts.length === 0) return ''

    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase()
    }

    const firstInitial = nameParts[0][0]
    const lastInitial = nameParts[nameParts.length - 1][0]

    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const nameAvatar = profile?.name && getNameInitials(profile.name)

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="text-foreground">
            <AvatarFallback className="bg-muted">{nameAvatar}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-muted mt-2">
          <DropdownMenuLabel className="flex flex-col">
            <span>{profile?.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {profile?.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  )
}

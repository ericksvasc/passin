import Logo from '../assets/logo.svg'
import { NavLink } from './ui/nav-link-'

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img src={Logo} alt="" />

      <nav className="flex gap-5 items-center font-medium text-sm">
        <NavLink href="/" variant="active">
          Eventos
        </NavLink>

        <NavLink href="/">Participantes</NavLink>
      </nav>
    </div>
  )
}

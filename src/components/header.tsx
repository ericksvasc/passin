import { Link } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ModeToggle } from './theme/mode-toggle'
import { AccountMenu } from './account-menu'

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img src={Logo} alt="" />

      <nav className="flex gap-5 items-center font-medium text-sm text-foreground">
        <Link to="/events">
          <div>Eventos</div>
        </Link>

        {/* <Link to="/">
          <div>Participantes</div>
        </Link> */}

        {/* <NavLink href="/">Participantes</NavLink> */}
      </nav>

      <div className="flex items-center justify-end w-full gap-4">
        <ModeToggle />
        <AccountMenu />
      </div>
    </div>
  )
}

// type NavLinkInterface = {
//   title: string
// }

// export function NavLink(props: NavLinkInterface) {
//   return (
//     <a className="text-zinc-300" href="/">
//       {props.title}
//     </a>
//   )
// }

import { forwardRef, type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const navLink = tv({
  variants: {
    variant: {
      active: 'text-zinc-300',
      nonActive: '',
    },
  },

  defaultVariants: {
    variant: 'nonActive',
  },
})

type navlinkProps = ComponentProps<'a'> & VariantProps<typeof navLink>

export const NavLink = forwardRef<HTMLAnchorElement, navlinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <a {...props} ref={ref} className={navLink({ variant, className })}>
        {props.children}
      </a>
    )
  }
)

NavLink.displayName = 'a'

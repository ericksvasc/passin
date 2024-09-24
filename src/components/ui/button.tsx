import { forwardRef, type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'border border-white/10 rounded-md p-1.5 transition-all duration-300 ',

  variants: {
    variant: {
      baseB: 'bg-black/20',
      left: 'bg-zinc-800/90',
      right: 'bg-zinc-700/80',
    },

    disabled: {
      true: 'opacity-70 cursor-not-allowed', // estilo para disabled
    },
  },

  defaultVariants: {
    variant: 'baseB',
  },
})

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, disabled, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={button({ variant, disabled, className })}
      />
    )
  }
)

IconButton.displayName = 'Button'

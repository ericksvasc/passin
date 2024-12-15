import { forwardRef, type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'border rounded-md p-1.5 transition-all duration-300 ',

  variants: {
    variant: {
      baseB: 'bg-secondary',
      left: 'bg-muted-foreground/20',
      right: 'bg-muted-foreground/30',
    },

    disabled: {
      true: 'dark:opacity-70 opacity-60 cursor-not-allowed', // estilo para disabled
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

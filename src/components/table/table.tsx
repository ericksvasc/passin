import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
// import { tv, type VariantProps } from 'tailwind-variants'

// const table = tv({
//   base: 'border border-white/10 rounded-md p-1.5',

//   variants: {
//     variant: {
//       baseB: 'bg-black/20',
//       left: 'bg-zinc-800/90',
//       right: 'bg-zinc-700/80',
//     },
//   },

//   defaultVariants: {
//     variant: 'baseB',
//   },
// })

type TableProps = ComponentProps<'table'>

export const Table = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  return (
    <div
      className={twMerge('rounded-lg border border-white/10', props.className)}
    >
      <table ref={ref} {...props} className="w-full" />
    </div>
  )
})

Table.displayName = 'Table'

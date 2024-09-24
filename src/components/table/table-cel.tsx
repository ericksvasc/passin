import { type ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type TableProps = ComponentProps<'td'>

export const TableCel = forwardRef<HTMLTableCellElement, TableProps>(
  (props, ref) => {
    return (
      <td
        ref={ref}
        {...props}
        className={twMerge('py-3 px-4 text-sm', props.className)}
      />
    )
  }
)

TableCel.displayName = 'Td'

import { type ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type TableProps = ComponentProps<'th'>

export const TableHeader = forwardRef<HTMLTableCellElement, TableProps>(
  (props, ref) => {
    return (
      <th
        ref={ref}
        {...props}
        className={twMerge(
          'px-4 text-sm font-semibold text-left',
          props.className
        )}
      />
    )
  }
)

TableHeader.displayName = 'Th'

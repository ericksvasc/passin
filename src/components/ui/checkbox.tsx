import * as Checkbox from '@radix-ui/react-checkbox'
import { twMerge } from 'tailwind-merge'

export function CheckboxRoot(props: Checkbox.CheckboxProps) {
  return (
    <Checkbox.Root
      {...props}
      className={twMerge(
        'border checked:bg-red-50 bg-black/20 border-white/10 size-5 rounded text-zinc-50 data-[state=checked]:bg-white  data-[state=checked]:text-zinc-950',
        props.className
      )}
    />
  )
}

export function CheckboxIndicator(props: Checkbox.CheckboxIndicatorProps) {
  return (
    <Checkbox.Indicator
      {...props}
      className={twMerge('flex items-center justify-center', props.className)}
    />
  )
}

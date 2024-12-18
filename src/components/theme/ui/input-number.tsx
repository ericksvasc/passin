'use client'
import { Minus, Plus } from 'lucide-react'
import {
  Button,
  Group,
  Input,
  NumberField,
  type NumberFieldProps,
} from 'react-aria-components'
import { forwardRef } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type CustomChangeEvent = {
  target: {
    value: number
    name?: string
  }
}

type InputNumberProps = Omit<NumberFieldProps, 'onChange' | 'value'> & {
  onChange?: (event: CustomChangeEvent) => void
  label?: string
  value?: number
  name?: string
  registration?: Partial<UseFormRegisterReturn>
  defaultValue?: number
  minValue?: number
  maximumAttendeesNumber: number
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      onChange,
      label = 'Number input with plus/minus buttons',
      minValue = 0,
      value,
      name,
      registration,
      defaultValue,
      maximumAttendeesNumber,
      ...props
    },
    ref
  ) => {
    return (
      <NumberField
        value={value}
        defaultValue={defaultValue}
        minValue={minValue}
        onChange={value => {
          const event: CustomChangeEvent = {
            target: { value: Number(value), name },
          }
          onChange?.(event)
          if (registration?.onChange) {
            registration.onChange(
              event as unknown as React.ChangeEvent<HTMLInputElement>
            )
          }
        }}
        {...props}
      >
        <div className="flex flex-col gap-2 w-full">
          {/* <Label className="text-sm font-normal text-foreground">
            {label}:
          </Label> */}
          <Group className="flex gap-2.5 h-10 w-full items-center  text-sm shadow-sm shadow-black/5 transition-shadow disabled:cursor-not-allowed disabled:opacity-50">
            <Button
              slot="decrement"
              className="flex aspect-square h-[inherit] items-center justify-center rounded-s-lgbg-muted text-sm text-muted-foreground/80 transition-shadow hover:bg-muted-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  border border-input dark:border-muted-foreground"
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Input
              className="flex h-10  text-center w-full rounded-sm border border-input dark:border-muted-foreground bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              ref={ref}
              name={name}
              defaultValue={defaultValue}
              {...registration}
              // style={{
              //   width: `calc(${maximumAttendeesNumber}ch + 4rem)`,
              // }}
            />
            <Button
              slot="increment"
              className=" flex aspect-square h-[inherit] items-center justify-center rounded-e-lg bg-muted text-sm text-muted-foreground/80 transition-shadow hover:bg-muted-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50   border border-input dark:border-muted-foreground"
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </Group>
        </div>
      </NumberField>
    )
  }
)

InputNumber.displayName = 'InputNumber'
export default InputNumber

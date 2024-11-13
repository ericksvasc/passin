import * as DialogPrimitive from '@radix-ui/react-dialog'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
// import { twMerge } from 'tailwind-merge'

export function Dialog(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

// export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
//   return <DialogPrimitive.Trigger {...props} />
// }

export const DialogTrigger = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.DialogTriggerProps
>((props, ref) => <DialogPrimitive.Trigger {...props} ref={ref} />)

export function DialogPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />
}

// export function DialogClose(props: DialogPrimitive.DialogCloseProps) {
//   return <DialogPrimitive.Close {...props} />
// }

export const DialogClose = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.DialogCloseProps
>((props, ref) => <DialogPrimitive.Close {...props} ref={ref} />)

// export function DialogOverlay(props: DialogPrimitive.DialogOverlayProps) {
//   return <DialogPrimitive.Overlay {...props} />
// }

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogOverlayProps
>((props, ref) => (
  <DialogPrimitive.Overlay
    {...props}
    ref={ref}
    className={twMerge(
      'bg-black/10 fixed inset-0 backdrop-blur-sm',
      props.className
    )}
  />
))

// export function DialogContent(props: DialogPrimitive.DialogContentProps) {
//   return (
//     <DialogPortal>
//       <DialogOverlay className="bg-black/10 fixed inset-0 backdrop-blur-sm" />

//       <DialogPrimitive.DialogContent
//         {...props}
//         className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]  bg-zinc-950 p-8 rounded-lg"
//       />
//     </DialogPortal>
//   )
// }

export const DialogContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps & { overlayClass?: string }
>(({ overlayClass, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClass} />
    <DialogPrimitive.Content
      {...props}
      ref={ref}
      className={twMerge(
        'fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-zinc-950 p-8 rounded-xl',
        props.className
      )}
    />
  </DialogPortal>
))

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle
      {...props}
      className={twMerge('text-lg font-semibold', props.className)}
    />
  )
}

export function DialogDescription(
  props: DialogPrimitive.DialogDescriptionProps
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className={twMerge(
        'text-zinc-400 text-sm leading-relaxed',
        props.className
      )}
    />
  )
}

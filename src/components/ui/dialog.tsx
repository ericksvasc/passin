import * as DialogPrimitive from '@radix-ui/react-dialog'
// import { twMerge } from 'tailwind-merge'

export function Dialog(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Dialog {...props} />
}

export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...props} />
}

export function DialogPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />
}

export function DialogClose(props: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.Close {...props} />
}

export function DialogOverlay(props: DialogPrimitive.DialogOverlayProps) {
  return <DialogPrimitive.Overlay {...props} />
}

export function DialogContent(props: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay className="bg-black/10 fixed inset-0 backdrop-blur-sm" />

      <DialogPrimitive.DialogContent
        {...props}
        className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]  bg-zinc-950 p-8 rounded-lg"
      />
    </DialogPortal>
  )
}

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle {...props} className="text-lg font-semibold" />
  )
}

export function DialogDescription(
  props: DialogPrimitive.DialogDescriptionProps
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className="text-zinc-400 text-sm leading-relaxed"
    />
  )
}

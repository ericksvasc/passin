import * as Toast from '@radix-ui/react-toast'

export function ToastProvider(props: Toast.ToastProviderProps) {
  return <Toast.Provider {...props} />
}

export function ToastRoot(props: Toast.ToastProps) {
  return (
    <Toast.Root
      className="h-20 grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
      {...props}
    />
  )
}

export function ToastTitle(props: Toast.ToastTitleProps) {
  return (
    <Toast.Title
      className="mb-[5px] text-[15px] font-medium text-zinc-800 [grid-area:_title]"
      {...props}
    />
  )
}

export function ToastDescription(props: Toast.ToastDescriptionProps) {
  return (
    <Toast.Description
      className="text-zinc-900 m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]"
      {...props}
    />
  )
}

export function ToastAction(props: Toast.ToastActionProps) {
  return <Toast.Action {...props} />
}

export function ToastClose(props: Toast.ToastCloseProps) {
  return <Toast.Close {...props} />
}

export function ToastViewport(props: Toast.ToastViewportProps) {
  return (
    <Toast.Viewport
      //   className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
      className="fixed top-0 right-0 z-[2147483647] m-8 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-0 outline-none"
      {...props}
    />
  )
}

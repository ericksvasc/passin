import { DialogContent } from '../ui/dialog'
import { Trash2, UserRoundPen } from 'lucide-react'

// const editAttendeeForm = z.object({
//   name: z
//     .string()
//     .min(1, 'O nome é obrigatório')
//     .refine(value => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
//       message: 'O nome não pode conter números ou caracteres especiais',
//     }),
//   email: z.string().email('Insira um email válido'),
// })

// type EditAttendeeForm = z.infer<typeof editAttendeeForm>

interface AttendeeEditDialogProps {
  // slug: string
  onCloseDialog: () => void
  onOpenEdit: () => void
  menuPosition: {
    x: number
    y: number
  }
}

// const patchAttendee = z.object({
//   slug: z.string(),
//   name: z.string().min(2),
//   email: z.string().email(),
// })

// type AttendeePatch = z.infer<typeof patchAttendee>

export function ModelEditDialog({
  // slug,
  // onCloseDialog,
  menuPosition,
  onOpenEdit,
}: AttendeeEditDialogProps) {
  // const queryClient = useQueryClient()

  // async function handlePatchAteendee(data: EditAttendeeForm) {
  //   if (data.name === null && data.email === null) {
  //     return onCloseDialog()
  //   }

  //   const patchData: AttendeePatch = {
  //     slug,
  //     name: data.name,
  //     email: data.email,
  //   }
  //   await createAttendee(patchData)

  //   queryClient.invalidateQueries({ queryKey: ['attendees'] })
  //   onCloseDialog()
  // }

  return (
    <DialogContent
      className="w-40 h-24 p-0 rounded-md"
      style={{
        top: menuPosition.y - 96 / 2 - 40,
        left: menuPosition.x - 160 / 2 + 30,
      }}
      overlayClass="backdrop-blur-none bg-transparent"
    >
      <div className="flex flex-col h-full justify-center">
        <button
          type="button"
          className="h-full flex items-center px-4 gap-2 text-green-50"
          onClick={onOpenEdit}
        >
          <UserRoundPen size={18} />
          Editar
        </button>
        <span className="w-full border-b border-white/30" />
        <button
          type="button"
          className="h-full flex items-center px-4 gap-2 text-red-400"
        >
          <Trash2 size={18} />
          Deletar
        </button>
      </div>
    </DialogContent>
  )
}

import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
} from '../ui/alert-dialog'
import { AccessibleWorkspaceResponseDTO, useDeleteWorkspace } from '../../../generated'

interface Props {
  workspace: AccessibleWorkspaceResponseDTO
}

export default function WorkspaceCard({ workspace }: Props) {
  const navigate = useNavigate()
  const { mutate, error } = useDeleteWorkspace(
    workspace.id,
    {},
    {
      onSuccess: () => {
        window.location.reload()
      },
    },
  )
  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
      <div>
        <span className="font-medium">{workspace.name}</span>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            void navigate({ to: `/workspaces/${String(workspace.id)}/` })
          }}
        >
          edit
        </Button>
        <Button
          variant="outline"
          className="bg-orange-400 text-white"
          onClick={() => {
            void navigate({ to: `/workspaces/${String(workspace.id)}/users` })
          }}
        >
          manage
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-2">
              <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => {
                  mutate(undefined)
                }}
              >
                Yes, delete it
              </AlertDialogAction>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">
                {error.message || 'Failed to delete workspace'}
              </p>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

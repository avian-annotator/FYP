import { Button } from '@/components/ui/button'
import { useDeleteWorkspace } from '../../../generated'

type DeleteWorkspaceButtonProps = {
  workspaceId: number
  onDeleted?: () => void // optional callback after deletion
}

export function DeleteWorkspaceButton({ workspaceId, onDeleted }: DeleteWorkspaceButtonProps) {
  const { mutate, error, isSuccess } = useDeleteWorkspace(
    workspaceId,
    {},
    {
      onSuccess: () => {
        if (onDeleted) onDeleted()
      },
    },
  )

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => {
          mutate(undefined)
        }}
        title="Delete Workspace"
      >
        Delete
      </Button>
      {error && (
        <p className="text-red-600 text-sm mt-1">{error.message || 'Failed to delete workspace'}</p>
      )}
      {isSuccess && <p className="text-green-600 text-sm mt-1">Workspace deleted successfully!</p>}
    </>
  )
}

import { Button } from '@/components/ui/button'
import { useDeleteWorkspace } from '../../../generated'

type DeleteWorkspaceButtonProps = {
  workspaceId: number
}

export function DeleteWorkspaceButton({ workspaceId }: DeleteWorkspaceButtonProps) {
  const { mutate, error } = useDeleteWorkspace(workspaceId)

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
    </>
  )
}

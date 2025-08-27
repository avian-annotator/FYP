import { Button } from '../ui/button'
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
import { useDeleteUser, useRemoveUserFromWorkspace, UserResponseDTO } from '../../../generated'
import { Separator } from '../ui/separator'

type UserCardProps = {
  user: UserResponseDTO
  workspaceId?: number
}

export default function UserCard({ user, workspaceId }: UserCardProps) {
  /** Idea here is this can be reused for the admin page */
  const deleteUser = useDeleteUser(
    user.id,
    {},
    {
      onSuccess: () => {
        window.location.reload()
      },
    },
  )
  const removeUser = useRemoveUserFromWorkspace(
    workspaceId ?? -1,
    user.id,
    {},
    {
      onSuccess: () => {
        window.location.reload()
      },
    },
  )

  const { mutate } = workspaceId == -1 ? deleteUser : removeUser
  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
      <div className="flex h-5 items-center space-x-3 m-0">
        <span className="font-medium">Username: {user.username}</span>
        <Separator orientation="vertical" className=" bg-gray-400" />
        <span className="font-medium">User ID: {user.id}</span>
      </div>

      <div className="flex space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove this user from the workspace
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
                Yes, remove them
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

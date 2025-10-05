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
import {
  useDeleteUser,
  useRemoveUserFromWorkspace,
  UserResponseDTO,
  CurrentUserResponseDTO,
} from '../../../generated'
import { Separator } from '../ui/separator'
import { useAuth } from '../../auth'
import { EditUserButton } from './EditUserButton'

type UserCardProps = {
  user: UserResponseDTO | CurrentUserResponseDTO
  workspaceId?: number
}

export default function UserCard({ user, workspaceId }: UserCardProps) {
  /** Idea here is this can be reused for the admin page */
  const { userDetails } = useAuth()

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
  const isDeleting = workspaceId == -1
  const isEditing = isDeleting && userDetails

  const isCurrAdmin = userDetails?.id === user.id
  const isDeleteCurrAdmin = isDeleting && isCurrAdmin

  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm dark:bg-slate-900">
      <div className="flex h-5 items-center space-x-3 m-0">
        <span className="font-medium">Username: {user.username}</span>
        <Separator orientation="vertical" className=" bg-gray-400" />
        <span className="font-medium">User ID: {user.id}</span>
        <Separator orientation="vertical" className=" bg-gray-400" />
        <span className="font-medium">Role: {user.role}</span>
      </div>

      <div className="flex space-x-2">
        <EditUserButton user={user} />
        {!isEditing && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{isDeleting ? 'delete' : 'remove'}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isDeleteCurrAdmin
                    ? 'You may not delete your own admin account'
                    : 'Are you sure?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isDeleteCurrAdmin
                    ? ''
                    : isDeleting
                      ? 'This will delete this user from Avian Annotator'
                      : 'This will remove this user from the workspace'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end space-x-2">
                <AlertDialogCancel className="btn">
                  {isDeleteCurrAdmin ? 'Return' : 'Cancel'}
                </AlertDialogCancel>
                {!isDeleteCurrAdmin && (
                  <AlertDialogAction
                    className="bg-red-500 text-white"
                    onClick={() => {
                      mutate(undefined)
                    }}
                  >
                    {isDeleting ? 'Yes, delete them' : 'Yes, remove them'}
                  </AlertDialogAction>
                )}
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

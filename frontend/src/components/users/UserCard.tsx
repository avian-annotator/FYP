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
import { UserResponseDTO } from '../../../generated'
interface Props {
  user: UserResponseDTO
}

export default function UserCard({ user }: Props) {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
      <div>
        <span className="font-medium">Username: {user.username}</span>
      </div>
      <div className="flex space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              {/*TODO: pass custom remove message through (so user card can be reused for admin page)*/}
              <AlertDialogDescription>
                This will remove this user from the workspace
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-2">
              <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => {
                  //TODO: add remove logic
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

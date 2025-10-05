import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  useEditMe,
  EditUserRequestBodyDTO,
  UserResponseDTO,
  CurrentUserResponseDTO,
} from '../../../generated'
import { useQueryClient } from '@tanstack/react-query'

type EditUserButtonProps = {
  user: UserResponseDTO | CurrentUserResponseDTO
}

export function EditUserButton({ user }: EditUserButtonProps) {
  const queryClient = useQueryClient()
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editUserRequestBodyDTO: EditUserRequestBodyDTO = {
    username: username !== user.username ? username : undefined,
    password: password !== '' ? password : undefined,
  }

  const mutation = useEditMe(editUserRequestBodyDTO)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    mutation.mutate(undefined, {
      onSuccess: () => {
        window.location.reload()
        setOpen(false)
        setError(null)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950"
          variant="ghost"
          onClick={() => {
            mutation.reset()
            setUsername(user.username)
            setPassword('')
            setError(null)
          }}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            New username
          </label>
          <input
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            name="username"
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            New password (leave this empty to keep the same password)
          </label>
          <input
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            name="password"
            type="password"
            value={password}
            placeholder="Enter new password or leave blank"
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
          {error && (
            <p role="alert" className="text-red-600 mb-2">
              {error}
            </p>
          )}
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
          {mutation.isError && (
            <p className="mt-2 text-red-600">
              Error: {mutation.error.message || 'Failed to update user'}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

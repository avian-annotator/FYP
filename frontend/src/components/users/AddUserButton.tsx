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
import { AddUserToWorkspaceRequestBodyDTO, useGetUsersFromWorkspace } from '../../../generated'
import { useAddUserToWorkspace } from '@/lib/utils'

export function AddUserButton({ workspace }: { workspace: number }) {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data } = useGetUsersFromWorkspace(workspace, { excludeExisting: true }, {})
  const users = data?.data.content === undefined ? [] : data.data.content

  const mutation = useAddUserToWorkspace(workspace)

  const onSubmit = (e: React.FormEvent) => {
    if (id === null) return
    const addUserToWorkspaceRequestBodyDTO: AddUserToWorkspaceRequestBodyDTO = {
      userId: id,
    }

    e.preventDefault()

    setError(null)
    mutation.mutate(addUserToWorkspaceRequestBodyDTO, {
      onSuccess: () => {
        window.location.reload()
        mutation.reset()
        setOpen(false)
        setId(0)
        setError(null)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mt-4 text-green-600 bg-green-100 hover:bg-green-200 dark:bg-green-950"
          variant="ghost"
          onClick={() => {
            mutation.reset()
          }}
        >
          Add new user?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">User</label>
          <select
            value={Number(id)}
            onChange={e => {
              setId(Number(e.target.value))
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>
              -- Choose a user --
            </option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          {error && (
            <p role="alert" className="text-red-600">
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
            <Button type="submit"> Add</Button>
          </DialogFooter>
          {mutation.isError && (
            <p className="mt-2 text-red-600">
              Error: {mutation.error.message || 'Failed to add user'}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

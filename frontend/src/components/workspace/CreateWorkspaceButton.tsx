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
import { useCreateWorkspace, CreateWorkspaceRequestBodyDTO } from '../../../generated'

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')

  const createWorkspaceRequestBodyDTO: CreateWorkspaceRequestBodyDTO = {
    name: workspaceName,
  }
  const mutation = useCreateWorkspace(createWorkspaceRequestBodyDTO)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(undefined, {
      onSuccess: () => {
        window.location.reload()
        setOpen(false)
        setWorkspaceName('')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 text-green-600 bg-green-100 hover:bg-green-200" variant="ghost">
          Create new Workspace?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Workspace Name</label>
          <input
            type="text"
            value={workspaceName}
            onChange={e => {
              setWorkspaceName(e.target.value)
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter workspace name"
          />
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit"> Create</Button>
          </DialogFooter>
          {mutation.isError && (
            <p className="mt-2 text-red-600">
              Error: {mutation.error.message || 'Failed to create workspace'}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

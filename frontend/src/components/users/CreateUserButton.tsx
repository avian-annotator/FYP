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
import { useCreateNewUser, CreateUserRequestBodyDTO } from '../../../generated'

export function CreateUserButton() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUserRequestBodyDTO: CreateUserRequestBodyDTO = {
    username: username,
    password: password,
  }

  const mutation = useCreateNewUser(createUserRequestBodyDTO)

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
          className="mt-4 text-green-600 bg-green-100 hover:bg-green-200"
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
          <input
            style={{ border: '2px solid black', borderRadius: '5px' }}
            name="username"
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            style={{ border: '2px solid black', borderRadius: '5px' }}
            name="password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
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
            <Button type="submit"> Create</Button>
          </DialogFooter>
          {mutation.isError && (
            <p className="mt-2 text-red-600">
              Error: {mutation.error.message || 'Failed to create user'}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

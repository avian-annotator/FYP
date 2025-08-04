import { useState } from 'react'
import { useLogin } from './useLogin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Login = ({ location }: { location?: string }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useLogin({ location })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ username, password })
  }

  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader>
        <CardTitle>Enter username and password to log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <label htmlFor="username">Username: </label>
              <input
                className="border-1 rounded"
                type="text"
                id="username"
                onChange={e => {
                  setUsername(e.target.value)
                }}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">Password: </label>
              <input
                className="border-1 rounded"
                type="password"
                id="password"
                onChange={e => {
                  setPassword(e.target.value)
                }}
              />
            </div>
            <div className="grid gap-2">
              <Button type="submit" className="p-2 mt-5">
                Sign In
                {mutation.isPending && <p>Logging in...</p>}
                {mutation.isError && <p className="text-red-500">{mutation.error.message}</p>}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login

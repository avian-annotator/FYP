import { useState } from 'react'
import { useLogin } from './useLogin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

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
                {mutation.isPending ? 'Logging in...' : 'Sign in'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      {mutation.isError && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}

export default Login

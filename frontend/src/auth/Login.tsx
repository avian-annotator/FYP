import { useState } from 'react'
import { useLogin } from './useLogin'

const Login = ({ location }: { location?: string }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useLogin({ location })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ username, password })
  }

  return (
    <form className="flex flex-col" onSubmit={ handleSubmit }>
      <div className="flex flex-row">
        <label htmlFor="username">Username: </label>
        <input
          className="border-1 rounded"
          type="text"
          id="username"
          onChange={ e => {
            setUsername(e.target.value)
          } }
        />
      </div>
      <div className="flex flex-row">
        <label htmlFor="password">Password: </label>
        <input
          className="border-1 rounded"
          type="password"
          id="fpassword"
          onChange={ e => {
            setPassword(e.target.value)
          } }
        />
      </div>
      <input className="px-4 py-2 bg-blue-500 text-white rounded" type="submit" value="Login" />
      { mutation.isPending && <p>Logging in...</p> }
      { mutation.isError && <p className="text-red-500">{ mutation.error.message }</p> }
    </form>
  )
}

export default Login

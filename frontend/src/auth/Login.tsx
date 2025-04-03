import { useState } from 'react'

/**
 * Feel free to change this - this is just a placeholder for the login form to get something working
 */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log({ username, password })
  }

  return (
    <form className="grid grid-cols-2" onSubmit={handleSubmit}>
      <div className="grid grid-rows-2 gap-2">
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="grid grid-rows-2 gap-2">
        <label htmlFor="password">Password:  </label>
        <input type="password" id="fpassword" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <input type="submit" value="Login" className="col-span-2" />
    </form>
  )
}

export default Login
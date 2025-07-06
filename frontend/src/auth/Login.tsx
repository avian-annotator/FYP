import { useState } from 'react';
import { useLogin } from './useLogin';

const Login = ({ location }: { location?: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useLogin(location);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

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
      {
        mutation.isPending && <p>Logging in...</p>
      }
      {
        mutation.isError && <p className="text-red-500">{mutation.error.message}</p>
      }
      {
        mutation.data && mutation.isSuccess && <p className="text-green-500">Login successful!</p>
      }

      {
        mutation.data && !mutation.isSuccess && <p className="text-red-500">Login failed!</p>
      }
    </form>
  );
};

export default Login;

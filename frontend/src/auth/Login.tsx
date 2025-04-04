import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useLogin } from './useLoginMutation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); // Get login function
  const { mutate: login, data, error, isPending } = useLogin(setUser);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ username, password });
    console.log("RUNS")

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
    </form>
  );
};

export default Login;

function useLoginMutation(setUser: (user: string | null) => void): { mutate: any; data: any; error: any; isPending: any; } {
  throw new Error('Function not implemented.');
}

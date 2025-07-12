import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/local/register' : '/auth/local/login';
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, { username, password }, { withCredentials: true });
      if (data.user) {
        dispatch(setUser(data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="card w-96 bg-white border border-neutral p-6 rounded">
        <h2 className="text-xl font-bold mb-4 text-header">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-secondary">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered w-full" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-secondary">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full"> {isRegister ? 'Register' : 'Login'}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-primary hover:underline mt-2 block mx-auto">
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
}

export default Login;
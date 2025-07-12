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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {isRegister ? 'Create Account' : 'Sign In'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="input input-bordered w-full" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="input input-bordered w-full" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered" required />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered" required />
              </div>
              <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary">{isRegister ? 'Register' : 'Login'}</button>
              </div>
            </form>
            <button onClick={() => setIsRegister(!isRegister)} className="btn btn-link">
              {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
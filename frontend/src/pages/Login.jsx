import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleOAuth = (provider) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`;
  };

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center">Login</h1>
            <button onClick={() => handleOAuth('google')} className="btn btn-primary">Google</button>
            <button onClick={() => { handleOAuth('twitter'); }} className="btn btn-secondary">Twitter (X)</button>
            <button onClick={() => handleOAuth('facebook')} className="btn btn-accent">Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
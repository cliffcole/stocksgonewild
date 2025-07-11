import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, initiateLogin } from '../features/auth/authSlice';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, authUrl } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  }, [authUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">Please login with your Schwab account to continue</p>
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(initiateLogin())}
          >
            Login with Schwab
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Add useSelector here
import { Routes, Route, Navigate } from 'react-router-dom';
import { setUser, setLoading } from './redux/slices/authSlice';
import { getUser } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await getUser();
        if (data) dispatch(setUser(data));
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);  // Now defined

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default App;
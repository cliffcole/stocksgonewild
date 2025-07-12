import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate, } from 'react-router-dom';
import { setUser } from './redux/slices/authSlice';
import { getUser } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        if (data) dispatch(setUser(data));
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute> } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// Simple private route (expand with auth check)
function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default App;
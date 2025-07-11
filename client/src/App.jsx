import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import Stocks from './pages/Stocks';
import Scans from './pages/Scans';
import Watchlist from './pages/Watchlist';
import AuthSuccess from './pages/AuthSuccess';
import AuthError from './pages/AuthError';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/auth-error" element={<AuthError />} />
        <Route path="/" element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }>
          <Route index element={<Home />} />
          <Route path="stocks" element={<Stocks />} />
          <Route path="scans" element={<Scans />} />
          <Route path="watchlist" element={<Watchlist />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
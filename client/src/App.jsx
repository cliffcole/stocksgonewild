import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stocks from './pages/Stocks';
import Scans from './pages/Scans';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
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
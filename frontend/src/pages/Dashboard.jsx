import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { setStockData, toggleScan } from '../redux/slices/stockSlice';
import { getHistory, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
// Removed chart imports

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data, scans } = useSelector((state) => state.stock);

  // Fetch example stock data on mount (e.g., AAPL history for reporting)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hist = await getHistory('AAPL', { periodType: 'month', period: 1, frequencyType: 'daily', frequency: 1 });
        // TODO: Process hist.candles for scans (e.g., apply MA/RSI if toggled)
        dispatch(setStockData({ symbol: 'AAPL', data: hist }));
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      }
    };
    if (isAuthenticated) fetchData();
  }, [dispatch, isAuthenticated]);

  // Logout handler: API call first, then Redux, then redirect
  const handleLogout = async () => {
    try {
      await logout();  // Clear server session
      dispatch(logoutUser());  // Clear Redux state
      navigate('/');  // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Example report (table with toggleable scans)
  const reportData = data?.AAPL?.candles?.slice(-5) || [];  // Last 5 for demo

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {user?.displayName || 'User'}</h1>
      <button onClick={handleLogout} className="btn btn-outline mt-2">Logout</button>

      {/* Scan Toggles (DaisyUI switches) */}
      <div className="mt-4">
        <h2 className="text-xl">Scan Options</h2>
        <label className="label cursor-pointer">
          <span className="label-text">Moving Average (MA)</span>
          <input
            type="checkbox"
            className="toggle"
            checked={scans.ma}
            onChange={(e) => dispatch(toggleScan({ scanName: 'ma', enabled: e.target.checked }))}
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">RSI</span>
          <input
            type="checkbox"
            className="toggle"
            checked={scans.rsi}
            onChange={(e) => dispatch(toggleScan({ scanName: 'rsi', enabled: e.target.checked }))}
          />
        </label>
        {/* TODO: Re-run scans/backtesting on toggle change */}
      </div>

      {/* Report Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              {/* TODO: Add columns for scan results (e.g., MA value, RSI) if toggled */}
            </tr>
          </thead>
          <tbody>
            {reportData.map((candle, idx) => (
              <tr key={idx}>
                <td>{new Date(candle.datetime).toLocaleDateString()}</td>
                <td>{candle.open}</td>
                <td>{candle.high}</td>
                <td>{candle.low}</td>
                <td>{candle.close}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
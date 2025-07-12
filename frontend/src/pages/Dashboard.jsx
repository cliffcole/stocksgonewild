import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { setStockData, toggleScan } from '../redux/slices/stockSlice';
import { getHistory, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { calculateATR } from '../utils/indicators';  // Add import (include others if keeping MA/RSI)

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { data, scans } = useSelector((state) => state.stock);
    const [symbol, setSymbol] = useState('AAPL');
    const [loadingData, setLoadingData] = useState(false);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            // Fetch 2 years daily data
            const response = await getHistory(symbol, { periodType: 'year', period: 2, frequencyType: 'daily', frequency: 1 });
            const rawCandles = response.data.candles || [];
            dispatch(setStockData({ symbol, data: { rawCandles, scans: {} } }));
        } catch (error) {
            console.error('Failed to fetch stock data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [dispatch, isAuthenticated]);

    // Re-compute scans on toggle or data change
    useEffect(() => {
        const currentData = data[symbol];
        if (!currentData || !currentData.rawCandles.length) return;

        const newScanResults = {};
        if (scans.atr) newScanResults.atr = calculateATR(currentData.rawCandles, 10);

        // Check if new results differ (simple string compare to avoid deep equality issues)
        if (JSON.stringify(newScanResults) !== JSON.stringify(currentData.scans || {})) {
            dispatch(setStockData({ symbol, data: { ...currentData, scans: newScanResults } }));
        }
    }, [scans, data, dispatch, symbol]);  // Keep deps; check prevents loop

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(logoutUser());
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const rawCandles = data?.[symbol]?.rawCandles || [];
    const reportData = rawCandles.slice(-20);  
    const scanResults = data?.[symbol]?.scans || {};

    return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-header">Stock Scanner Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline mb-4">Logout</button>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar for Filters/Toggles */}
          <div className="md:w-1/4">
            <div className="bg-white border border-neutral rounded p-4">
              <h2 className="text-lg font-bold mb-2 text-header">Symbol Search</h2>
              <div className="input-group">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchData(); }}
                  className="input input-bordered w-full"
                  placeholder="e.g., AAPL"
                />
              </div>
              <button onClick={fetchData} className="btn btn-primary w-full mt-2" disabled={loadingData}>
                {loadingData ? <span className="loading loading-spinner"></span> : 'Fetch'}
              </button>

              <h2 className="text-lg font-bold mt-4 mb-2 text-header">Scan Options</h2>
              <label className="flex items-center cursor-pointer mb-2">
                <span className="text-sm mr-2 text-secondary">ATR (10-day)</span>
                <input type="checkbox" className="toggle" checked={scans.atr} onChange={(e) => dispatch(toggleScan({ scanName: 'atr', enabled: e.target.checked }))} />
              </label>
              {/* Add more toggles */}
            </div>
          </div>

          {/* Main Table */}
          <div className="md:w-3/4 overflow-x-auto">
            <div className="bg-white border border-neutral rounded">
              <table className="table table-zebra w-full">
                <thead><tr><th>Date</th><th>Prior Close</th><th>Open</th><th>High</th><th>Low</th><th>Close</th><th>Change %</th>{scans.atr && <th>ATR (10)</th>}</tr></thead>
                <tbody>
                  {reportData.map((candle, idx) => {
                    const globalIdx = rawCandles.length - reportData.length + idx;
                    const priorClose = globalIdx > 0 ? rawCandles[globalIdx - 1].close : null;
                    const changePct = priorClose ? ((candle.close - priorClose) / priorClose * 100).toFixed(2) : '-';
                    const changeColor = changePct > 0 ? 'text-positive' : (changePct < 0 ? 'text-negative' : '');
                    const priorCloseStr = priorClose ? priorClose.toFixed(2) : '-';
                    const atrIdx = scanResults.atr?.length ? scanResults.atr.length - (reportData.length - idx) : null;
                    return (<tr key={idx}><td>{new Date(candle.datetime).toLocaleDateString()}</td><td>{priorCloseStr}</td><td>{candle.open.toFixed(2)}</td><td>{candle.high.toFixed(2)}</td><td>{candle.low.toFixed(2)}</td><td>{candle.close.toFixed(2)}</td><td className={changeColor}>{changePct}%</td>{scans.atr && <td>{(atrIdx !== null && atrIdx >= 0 && atrIdx < (scanResults.atr?.length || 0)) ? scanResults.atr[atrIdx].toFixed(2) : '-'}</td>}</tr>);
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
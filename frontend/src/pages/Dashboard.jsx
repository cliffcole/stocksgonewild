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
    const reportData = rawCandles.slice(-20);  // Last 20 for 2-year data (scrollable table)
    const scanResults = data?.[symbol]?.scans || {};

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome, {user?.username || 'User'}</h1>
            <button onClick={handleLogout} className="btn btn-outline mt-2">Logout</button>

            {/* Symbol Input */}
            <div className="mt-4 form-control">
                <label className="label">
                    <span className="label-text">Stock Symbol</span>
                </label>
                <div className="input-group">
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === 'Enter') fetchData(); }}
                        className="input input-bordered w-full max-w-xs"
                        placeholder="e.g., AAPL"
                    />
                    <button onClick={fetchData} className="btn btn-primary" disabled={loadingData}>
                        {loadingData ? <span className="loading loading-spinner"></span> : 'Fetch'}
                    </button>
                </div>
            </div>

            {/* Scan Toggles */}
            <div className="mt-4">
                <h2 className="text-xl">Scan Options</h2>
                <label className="label cursor-pointer">
                    <span className="label-text">ATR (10-day)</span>
                    <input type="checkbox" className="toggle" checked={scans.atr} onChange={(e) => dispatch(toggleScan({ scanName: 'atr', enabled: e.target.checked }))} />
                </label>
                {/* Add back MA/RSI if wanted */}
            </div>

            {/* Report Table with Dynamic Scan Columns */}
            <div className="mt-4 overflow-x-auto">
                <table className="table table-zebra">
                    <thead><tr><th>Date</th><th>Prior Close</th><th>Open</th><th>High</th><th>Low</th><th>Close</th>{scans.atr && <th>ATR (10)</th>}</tr></thead>
                    <tbody>
                        {reportData.map((candle, idx) => {
                            const globalIdx = rawCandles.length - reportData.length + idx;
                            const priorClose = globalIdx > 0 ? rawCandles[globalIdx - 1].close.toFixed(2) : '-';  // Changed to .close
                            const atrIdx = scanResults.atr?.length ? scanResults.atr.length - (reportData.length - idx) : null;
                            return (<tr key={idx}><td>{new Date(candle.datetime).toLocaleDateString()}</td><td>{priorClose}</td><td>{candle.open.toFixed(2)}</td><td>{candle.high.toFixed(2)}</td><td>{candle.low.toFixed(2)}</td><td>{candle.close.toFixed(2)}</td>{scans.atr && <td>{(atrIdx !== null && atrIdx >= 0 && atrIdx < (scanResults.atr?.length || 0)) ? scanResults.atr[atrIdx].toFixed(2) : '-'}</td>}</tr>);
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { setStockData, toggleScan } from '../redux/slices/stockSlice';
import { getHistory, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { calculateATR } from '../utils/indicators';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faDownload, faColumns, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data, scans } = useSelector((state) => state.stock);
  const [symbol, setSymbol] = useState('AAPL');
  const [loadingData, setLoadingData] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

    // Sort data if needed
  const sortedData = [...reportData];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? a.datetime - b.datetime 
          : b.datetime - a.datetime;
      }
      // Add more sort logic as needed
    });
  }

    return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Main container with padding for fixed navbar */}
      <div className="pt-12">
        <div className="flex h-screen">
          {/* Filter Panel */}
          {filterPanelOpen && (
            <div className="filter-panel w-64 p-4">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Filters
                </h3>
                
                {/* Symbol Search */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-1 block">Symbol</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchData(); }}
                    className="input input-sm w-full"
                    placeholder="Enter symbol..."
                  />
                  <button 
                    onClick={fetchData} 
                    className="btn btn-primary btn-sm w-full mt-2" 
                    disabled={loadingData}
                  >
                    {loadingData ? 'Loading...' : 'Search'}
                  </button>
                </div>

                {/* Scan Options */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Technical Indicators</h4>
                  
                  <label className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm mr-2" 
                      checked={scans.atr} 
                      onChange={(e) => dispatch(toggleScan({ scanName: 'atr', enabled: e.target.checked }))} 
                    />
                    <span className="text-sm">ATR (10)</span>
                  </label>
                  
                  {/* Add more indicators */}
                </div>

                {/* Quick Filters */}
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick Filters</h4>
                  <div className="space-y-1">
                    <button className="btn btn-ghost btn-sm w-full justify-start">Top Gainers</button>
                    <button className="btn btn-ghost btn-sm w-full justify-start">Top Losers</button>
                    <button className="btn btn-ghost btn-sm w-full justify-start">Most Active</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-4 main-content">
            {/* Toolbar */}
            <div className="data-card p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                  className="btn btn-ghost btn-sm"
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Filters
                </button>
                
                <span className="text-sm text-gray-600">
                  Showing {reportData.length} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="btn btn-ghost btn-sm">
                  <FontAwesomeIcon icon={faColumns} className="mr-2" />
                  Columns
                </button>
                <button className="btn btn-ghost btn-sm">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="data-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="screener-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('date')}>
                        Date
                        {sortConfig.key === 'date' && (
                          <FontAwesomeIcon 
                            icon={sortConfig.direction === 'asc' ? faChevronUp : faChevronDown} 
                            className="ml-1 text-xs"
                          />
                        )}
                      </th>
                      <th>Prior Close</th>
                      <th>Open</th>
                      <th>High</th>
                      <th>Low</th>
                      <th>Close</th>
                      <th>Change %</th>
                      {scans.atr && <th>ATR (10)</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingData ? (
                      // Loading skeleton
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="8"><div className="skeleton-row"></div></td>
                        </tr>
                      ))
                    ) : (
                      sortedData.map((candle, idx) => {
                        const globalIdx = rawCandles.length - reportData.length + idx;
                        const priorClose = globalIdx > 0 ? rawCandles[globalIdx - 1].close : null;
                        const changePct = priorClose ? ((candle.close - priorClose) / priorClose * 100).toFixed(2) : '-';
                        const changeColor = changePct > 0 ? 'text-positive' : (changePct < 0 ? 'text-negative' : '');
                        const priorCloseStr = priorClose ? priorClose.toFixed(2) : '-';
                        const atrIdx = scanResults.atr?.length ? scanResults.atr.length - (reportData.length - idx) : null;
                        
                        return (
                          <tr key={idx}>
                            <td className="font-medium">{new Date(candle.datetime).toLocaleDateString()}</td>
                            <td>{priorCloseStr}</td>
                            <td>{candle.open.toFixed(2)}</td>
                            <td>{candle.high.toFixed(2)}</td>
                            <td>{candle.low.toFixed(2)}</td>
                            <td className="font-medium">{candle.close.toFixed(2)}</td>
                            <td className={`font-medium ${changeColor}`}>
                              {changePct !== '-' && changePct > 0 ? '+' : ''}{changePct}%
                            </td>
                            {scans.atr && (
                              <td>
                                {(atrIdx !== null && atrIdx >= 0 && atrIdx < (scanResults.atr?.length || 0)) 
                                  ? scanResults.atr[atrIdx].toFixed(2) 
                                  : '-'}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
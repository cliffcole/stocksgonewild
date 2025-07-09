import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchStockQuote, addToWatchlist } from '../features/stocks/stocksSlice';
import { fetchStockQuote, addToWatchlist} from '../features/stocks/stocksSlice';
const Stocks = () => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch();
  const { quotes, loading, error } = useSelector((state) => state.stocks);

  const handleSearch = (e) => {
    e.preventDefault();
    if (symbol) {
      dispatch(fetchStockQuote(symbol.toUpperCase()));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Stock Quotes</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter stock symbol..."
              className="input input-bordered w-full max-w-xs"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {loading && <div className="loading loading-spinner loading-lg"></div>}
      
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(quotes).map(([sym, data]) => (
          <div key={sym} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{sym}</h2>
              <p>Price: ${data.price || 'N/A'}</p>
              <p>Change: {data.change || 'N/A'}</p>
              <div className="card-actions justify-end">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => dispatch(addToWatchlist(sym))}
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stocks;
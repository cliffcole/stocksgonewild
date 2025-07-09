import { useSelector, useDispatch } from 'react-redux';
import { removeFromWatchlist } from '../features/stocks/stocksSlice'

const Watchlist = () => {
  const { watchlist, quotes } = useSelector((state) => state.stocks);
  const dispatch = useDispatch();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="alert alert-info">
          <span>Your watchlist is empty. Add some stocks to get started!</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((symbol) => (
                <tr key={symbol}>
                  <td className="font-bold">{symbol}</td>
                  <td>${quotes[symbol]?.price || 'N/A'}</td>
                  <td>{quotes[symbol]?.change || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => dispatch(removeFromWatchlist(symbol))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
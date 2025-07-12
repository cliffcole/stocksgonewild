import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { setStockData } from '../redux/slices/stockSlice';
import { getHistory } from '../services/api';

function Navbar() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && search) {
      try {
        const response = await getHistory(search.toUpperCase(), { periodType: 'year', period: 2, frequencyType: 'daily', frequency: 1 });
        dispatch(setStockData({ symbol: search.toUpperCase(), data: { rawCandles: response.data.candles || [], scans: {} } }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="navbar bg-base-100 text-gray-800 shadow-md">  
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-gray-800">StockScreener</a>  
      </div>
      <div className="flex-none hidden md:block">
        <input
          type="text"
          placeholder="Search symbols..."
          className="input input-bordered w-64 bg-base-200 border-neutral focus:border-primary text-gray-800"  
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li><a className="hover:text-primary text-gray-800">Screener</a></li>
          <li><a className="hover:text-primary text-gray-800">Charts</a></li>
          <li><a className="hover:text-primary text-gray-800">Markets</a></li>
        </ul>
        <button className="btn btn-ghost text-gray-800">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="btn btn-ghost text-gray-800">
          <FontAwesomeIcon icon={faGear} />
        </button>
        <button className="btn btn-ghost text-gray-800">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost text-gray-800" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </label>
          {menuOpen && (
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-gray-800">
              <li><a>Screener</a></li>
              <li><a>Charts</a></li>
              <li><a>Markets</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
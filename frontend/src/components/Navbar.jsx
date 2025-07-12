import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faUser, faBars, faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { setStockData } from '../redux/slices/stockSlice';
import { getHistory } from '../services/api';

function Navbar() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && search) {
      try {
        const response = await getHistory(search.toUpperCase(), { 
          periodType: 'year', 
          period: 2, 
          frequencyType: 'daily', 
          frequency: 1 
        });
        dispatch(setStockData({ 
          symbol: search.toUpperCase(), 
          data: { rawCandles: response.data.candles || [], scans: {} } 
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="navbar bg-white px-4 fixed top-0 w-full z-50">
      <div className="flex-1 flex items-center">
        <FontAwesomeIcon icon={faChartLine} className="text-blue-600 mr-2" />
        <span className="text-xl font-semibold">StocksGoneWild</span>
      </div>
      
      <div className="flex-none flex items-center space-x-4">
        {/* Search Box */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search ticker..."
            className="input input-sm w-64 pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Screener</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Markets</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Analysis</a>
        </nav>

        {/* Icon Buttons */}
        <div className="flex items-center space-x-2">
          <button className="btn btn-ghost btn-sm btn-circle">
            <FontAwesomeIcon icon={faBell} className="text-gray-600" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle">
            <FontAwesomeIcon icon={faGear} className="text-gray-600" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle">
            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </label>
          {menuOpen && (
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-52">
              <li><a>Screener</a></li>
              <li><a>Markets</a></li>
              <li><a>Analysis</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
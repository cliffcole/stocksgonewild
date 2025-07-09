import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">Stock Scanner</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/stocks">Stocks</Link></li>
            <li><Link to="/scans">Scans</Link></li>
            <li><Link to="/watchlist">Watchlist</Link></li>
          </ul>
        </div>
      </div>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
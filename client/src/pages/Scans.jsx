const Scans = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Stock Scans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Volume Breakout</h2>
            <p>Find stocks with unusual volume</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Run Scan</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Price Movers</h2>
            <p>Top gainers and losers</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Run Scan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scans;
const Home = () => {
  return (
    <div className="hero min-h-[calc(100vh-4rem)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Stock Scanner</h1>
          <p className="py-6">
            Real-time stock data and powerful scanning tools powered by Schwab API
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
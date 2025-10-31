export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your Car Into Income
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect drivers with brands for car wrap advertising. Earn money
            while you drive, or promote your business on wheels.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </a>
            <a href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {/* For Drivers */}
          <div className="card hover:shadow-xl transition-shadow flex flex-col">
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-4">For Drivers</h2>
            <ul className="space-y-3 text-gray-700 flex-grow mb-6">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Earn passive income while you drive</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Choose campaigns that match your route</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Get paid per day or per mile</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Track your earnings in real-time</span>
              </li>
            </ul>
            <a
              href="/register"
              className="btn-primary w-full text-center block"
            >
              Join as Driver
            </a>
          </div>

          {/* For Advertisers */}
          <div className="card hover:shadow-xl transition-shadow flex flex-col">
            <div className="text-5xl mb-4">📢</div>
            <h2 className="text-2xl font-bold mb-4">For Advertisers</h2>
            <ul className="space-y-3 text-gray-700 flex-grow mb-6">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Reach thousands with mobile advertising</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Target specific locations and routes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Track campaign performance metrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span>Manage multiple campaigns easily</span>
              </li>
            </ul>
            <a
              href="/register"
              className="btn-primary w-full text-center block"
            >
              Join as Advertiser
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Active Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
            <div className="text-gray-600">Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              $500K+
            </div>
            <div className="text-gray-600">Earned by Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Cities</div>
          </div>
        </div>
      </div>
    </div>
  );
}

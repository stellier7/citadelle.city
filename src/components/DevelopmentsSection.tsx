import { Link } from 'react-router-dom';

export const DevelopmentsSection = () => {
  return (
    <div className="relative overflow-hidden bg-black border-t border-b border-[#ff4444]/20 py-20">
      {/* Animated background elements - matching main page style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-[#ff4444]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-[#ff4444]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 font-display pt-8">
            Build <span className="text-[#ff4444]">Citadel</span> Together
          </h2>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Fund real estate developments. Own tokenized shares. 
            Earn returns as we build the future of startup cities.
          </p>

          {/* CTA Button */}
          <Link
            to="/developments"
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-[#ff4444] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff4444]/50"
          >
            <span className="relative z-10 flex items-center gap-3">
              View Developments
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4444] via-[#ff3333] to-[#ff4444] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#ff4444] mb-2">$500</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Min Investment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#ff4444] mb-2">15%+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Target Return</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#ff4444] mb-2">3</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Active Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

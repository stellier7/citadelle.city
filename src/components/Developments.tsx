import { useState } from 'react';
import { Link } from 'react-router-dom';
import { developmentProjects, getFundingProgress, formatCurrency } from '../developmentData';

export const Developments = () => {
  const [filter, setFilter] = useState<'all' | 'funding' | 'construction' | 'completed'>('all');

  const filteredProjects = filter === 'all' 
    ? developmentProjects 
    : developmentProjects.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      funding: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      construction: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    return badges[status as keyof typeof badges];
  };

  const getRiskBadge = (risk: string) => {
    const badges = {
      low: 'bg-green-500/20 text-green-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-red-500/20 text-red-300'
    };
    return badges[risk as keyof typeof badges];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-serif mb-4">
              Active Development <span className="text-[#ff4444]">Opportunities</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Invest in institutional-grade real estate projects. Earn returns during construction. 
              Own your share of the future.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            {['all', 'funding', 'construction', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filter === status
                    ? 'bg-[#ff4444] text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const progress = getFundingProgress(project);
              const raised = project.tokensSold * project.tokenPrice;

              return (
                <Link
                  key={project.id}
                  to={`/developments/${project.id}`}
                  className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ff4444] hover:shadow-xl hover:shadow-[#ff4444]/10 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-zinc-800 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
                      }}
                    />
                    
                    {/* Status badges */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(project.riskLevel)}`}>
                        {project.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>

                    {/* Location */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{project.cityName}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#ff4444] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.shortDescription}
                    </p>

                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Token Price</div>
                        <div className="text-white font-bold">${project.tokenPrice}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Return</div>
                        <div className="text-[#ff4444] font-bold">{project.targetAnnualReturn}% APY</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Duration</div>
                        <div className="text-white font-bold">{project.constructionDuration} months</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Min. Investment</div>
                        <div className="text-white font-bold">${project.tokenPrice}</div>
                      </div>
                    </div>

                    {/* Funding progress */}
                    {project.status === 'funding' && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Funding Progress</span>
                          <span className="text-[#ff4444] font-bold">{progress}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#ff4444] to-[#ff3333] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{formatCurrency(raised)} raised</span>
                          <span>{formatCurrency(project.tokenizedRaise)} goal</span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <span className="text-sm text-gray-400">
                        {project.tokensSold.toLocaleString()} / {project.totalTokens.toLocaleString()} tokens
                      </span>
                      <span className="text-[#ff4444] font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to List Your Development?
            </h3>
            <p className="text-gray-400 mb-8">
              Join Citadel as a developer and access global capital for your real estate projects.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-[#ff4444] to-[#ff3333] text-black font-semibold rounded-lg hover:shadow-xl hover:shadow-[#ff4444]/30 transition-all duration-300">
              Apply to List a Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

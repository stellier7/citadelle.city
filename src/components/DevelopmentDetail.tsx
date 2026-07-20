import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { developmentProjects, getFundingProgress, formatCurrency, getInvestorTier } from '../developmentData';

export const DevelopmentDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = developmentProjects.find(p => p.id === projectId);
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'timeline' | 'documents'>('overview');

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <Link to="/developments" className="text-[#ff4444] hover:underline">
            ← Back to all developments
          </Link>
        </div>
      </div>
    );
  }

  const progress = getFundingProgress(project);
  const raised = project.tokensSold * project.tokenPrice;
  const tokensFromInvestment = Math.floor(investmentAmount / project.tokenPrice);
  const ownershipPercentage = ((tokensFromInvestment / project.totalTokens) * 100).toFixed(3);
  const estimatedAnnualYield = (investmentAmount * project.targetAnnualReturn) / 100;
  const tier = getInvestorTier(tokensFromInvestment, project);

  const getTierInfo = (tierName: string) => {
    const tiers = {
      builder: {
        name: 'Builder Tier',
        color: 'text-gray-400',
        bg: 'bg-gray-500/20',
        benefits: ['Real-time construction dashboard', 'Quarterly email updates', 'Investor community access', 'Secondary market trading rights']
      },
      developer: {
        name: 'Developer Tier',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        benefits: ['All Builder benefits', 'Quarterly video calls', 'Detailed financial reports', 'Early access to new projects (48hr head start)', 'Exclusive Telegram channel']
      },
      founder: {
        name: 'Founder Tier',
        color: 'text-[#ff4444]',
        bg: 'bg-[#ff4444]/20',
        benefits: ['All Developer benefits', 'In-person site visit (expenses covered)', 'Name on building plaque', 'First-look at luxury units', 'Direct line to leadership', 'Lifetime priority allocation']
      }
    };
    return tiers[tierName as keyof typeof tiers];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative h-96 bg-zinc-900">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/developments" className="text-gray-300 hover:text-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Developments
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
              project.status === 'funding' ? 'bg-yellow-500/20 text-yellow-300' :
              project.status === 'construction' ? 'bg-blue-500/20 text-blue-300' :
              'bg-green-500/20 text-green-300'
            }`}>
              {project.status.toUpperCase()}
            </span>
            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-[#ff4444]/20 text-[#ff4444]">
              {project.type.toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white font-serif mb-2">{project.name}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">{project.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Token Price</div>
                <div className="text-2xl font-bold text-white">${project.tokenPrice}</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Target Return</div>
                <div className="text-2xl font-bold text-[#ff4444]">{project.targetAnnualReturn}%</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Timeline</div>
                <div className="text-2xl font-bold text-white">{project.constructionDuration}mo</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Total Raise</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(project.tokenizedRaise).replace('$', '$').slice(0, -3)}M</div>
              </div>
            </div>

            {/* Funding Progress (if funding) */}
            {project.status === 'funding' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Funding Progress</h3>
                  <span className="text-2xl font-bold text-[#ff4444]">{progress}%</span>
                </div>
                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff4444] to-[#ff3333] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Raised</div>
                    <div className="text-white font-bold">{formatCurrency(raised)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Tokens Sold</div>
                    <div className="text-white font-bold">{project.tokensSold.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Days Left</div>
                    <div className="text-white font-bold">
                      {Math.max(0, Math.ceil((project.fundingDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-8">
              <div className="flex gap-8">
                {['overview', 'financials', 'timeline', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 font-semibold transition-colors relative ${
                      activeTab === tab ? 'text-[#ff4444]' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4444]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Project Overview</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Amenities & Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {project.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                          <svg className="w-5 h-5 text-[#ff4444] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Project Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Total Units</div>
                        <div className="text-white font-bold text-lg">{project.units}</div>
                      </div>
                      <div className="bg-black/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Square Footage</div>
                        <div className="text-white font-bold text-lg">{project.squareFeet.toLocaleString()} sq ft</div>
                      </div>
                      <div className="bg-black/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Risk Level</div>
                        <div className="text-white font-bold text-lg capitalize">{project.riskLevel}</div>
                      </div>
                      <div className="bg-black/50 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Legal Entity</div>
                        <div className="text-white font-bold text-sm">{project.legalEntity}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Capital Structure</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                        <span className="text-gray-400">Total Project Cost</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(project.totalCost)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                        <span className="text-gray-400">Tokenized Raise (Equity)</span>
                        <span className="text-[#ff4444] font-bold text-lg">{formatCurrency(project.tokenizedRaise)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                        <span className="text-gray-400">Construction Loan (Debt)</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(project.loanAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                        <span className="text-gray-400">Citadel Equity</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(project.citadelEquity)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Expected Returns</h3>
                    <div className="bg-black/50 rounded-lg p-6">
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-[#ff4444] mb-2">{project.targetAnnualReturn}%</div>
                        <div className="text-gray-400">Target Annual Return</div>
                      </div>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">During Construction:</strong> {project.estimatedYield.split(',')[0]}</p>
                        <p><strong className="text-white">Upon Completion:</strong> {project.estimatedYield.split(',')[1] || 'Share in sale proceeds or rental income'}</p>
                        <p><strong className="text-white">Distribution Type:</strong> {project.distributionType === 'hybrid' ? 'Partial sale + ongoing rental income' : project.distributionType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="text-yellow-300 font-semibold mb-1">Risk Disclosure</div>
                        <p className="text-sm text-gray-300">Returns are estimated and not guaranteed. Real estate development involves construction risk, market risk, and regulatory risk. See full risk disclosure in documents.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Construction Milestones</h3>
                  <div className="space-y-6">
                    {project.milestones?.map((milestone, index) => (
                      <div key={index} className="relative pl-8">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-green-500 border-green-500' :
                          milestone.status === 'in-progress' ? 'bg-blue-500 border-blue-500 animate-pulse' :
                          'bg-zinc-800 border-zinc-700'
                        }`}>
                          {milestone.status === 'completed' && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {index < (project.milestones?.length || 0) - 1 && (
                          <div className="absolute left-3 top-8 w-0.5 h-full bg-zinc-800" />
                        )}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-bold">{milestone.title}</h4>
                            <span className="text-sm text-gray-400">{milestone.percentage}%</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {milestone.status === 'completed' ? 'Completed' :
                             milestone.status === 'in-progress' ? 'In Progress' :
                             'Upcoming'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Legal Documents & Insurance</h3>
                  <div className="space-y-4">
                    <div className="bg-black/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-[#ff4444]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-white font-semibold">Offering Memorandum</div>
                          <div className="text-sm text-gray-400">Complete project details & terms</div>
                        </div>
                      </div>
                      <button className="text-[#ff4444] hover:text-[#ff3333] font-semibold">Download</button>
                    </div>

                    <div className="bg-black/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-[#ff4444]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-white font-semibold">Risk Disclosure</div>
                          <div className="text-sm text-gray-400">Important investor information</div>
                        </div>
                      </div>
                      <button className="text-[#ff4444] hover:text-[#ff3333] font-semibold">Download</button>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-white font-bold mb-3">Insurance Coverage</h4>
                      <div className="space-y-2">
                        {project.insurance.map((ins, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-300">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{ins}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Investment Calculator */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">Investment Calculator</h3>
              
              {/* Investment input */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Math.max(project.tokenPrice, Number(e.target.value)))}
                    min={project.tokenPrice}
                    step={project.tokenPrice}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-4 pl-8 py-3 text-white text-lg focus:outline-none focus:border-[#ff4444]"
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <span>Min: ${project.tokenPrice}</span>
                  <span>Max: {formatCurrency((project.totalTokens - project.tokensSold) * project.tokenPrice)}</span>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 mb-6 pb-6 border-b border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokens</span>
                  <span className="text-white font-bold">{tokensFromInvestment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ownership</span>
                  <span className="text-white font-bold">{ownershipPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Annual Yield</span>
                  <span className="text-[#ff4444] font-bold">{formatCurrency(estimatedAnnualYield)}</span>
                </div>
              </div>

              {/* Tier Badge */}
              {tier && (
                <div className={`mb-6 ${getTierInfo(tier)?.bg} border border-${tier === 'founder' ? '[#ff4444]' : 'current'} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className={`w-5 h-5 ${getTierInfo(tier)?.color}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`font-bold ${getTierInfo(tier)?.color}`}>{getTierInfo(tier)?.name}</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {getTierInfo(tier)?.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#ff4444]">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-[#ff4444] to-[#ff3333] text-black font-bold rounded-lg hover:shadow-xl hover:shadow-[#ff4444]/50 transition-all duration-300 mb-4">
                Reserve Your Tokens
              </button>

              <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our Terms of Service and acknowledge the Risk Disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

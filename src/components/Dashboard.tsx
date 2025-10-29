import { useState } from 'react';
import { Property } from '../types';
import { cities } from '../data';
import { Link } from 'react-router-dom';

// Mock user portfolio data - matching main page properties exactly
const userPortfolio = {
  totalValue: 2845000,
  floorPrice: 2678000,
  monthlyRevenue: 12500,
  properties: [
    { 
      id: 'p1', 
      name: '1111 Pearl Court', 
      city: 'Prospera', 
      value: 750000, 
      monthlyRent: 3500, 
      status: 'owned', 
      isRented: true, 
      tenant: 'John Smith',
      imageUrl: '/images/PB_1111.png',
      description: 'Pristine Bay, Roatan',
      squareMeters: 350,
      amenities: ['2 Bedrooms', '2.5 Baths', 'Pool & Spa', 'Air Conditioning', 'Washer & Dryer', 'Dishwasher', 'Wireless Internet']
    },
    { 
      id: 'p2', 
      name: '1208 Coconut Drive', 
      city: 'Prospera', 
      value: 500000, 
      monthlyRent: 2800, 
      status: 'owned', 
      isRented: false,
      imageUrl: '/images/PB_1208.png',
      description: 'Pristine Bay, Roatan',
      squareMeters: 420,
      amenities: ['3 Bedrooms', '2 Bathrooms', 'Private Pool', 'Ocean View', 'Near Golf Course']
    },
    { 
      id: 'p3', 
      name: 'Apt 1204', 
      city: 'Prospera', 
      value: 189000, 
      monthlyRent: 1200, 
      status: 'owned', 
      isRented: true, 
      tenant: 'Maria Garcia',
      imageUrl: '/images/DIAMOND_APT_1204.png',
      description: 'Diamond Apartments, Roatan',
      squareMeters: 180,
      amenities: ['2 Bedrooms', '2 Bathrooms', 'City View']
    },
    { 
      id: 'i1', 
      name: 'Rua Dos Mandis', 
      city: 'Ipé', 
      value: 2506000, 
      monthlyRent: 8500, 
      status: 'owned', 
      isRented: true, 
      tenant: 'Luxury Rentals Inc',
      imageUrl: '/images/321_RUA_DOS_MANDIS.png',
      description: 'House with 6 suites, in a gated community in Jurerê Internacional, designed by renowned architect Robson Nascimento.',
      squareMeters: 1034,
      amenities: ['6 Beds', '8 Baths', 'Pool']
    },
    { 
      id: 'n2', 
      name: 'El Boom Residence', 
      city: 'Aposentillo', 
      value: 320000, 
      monthlyRent: 1800, 
      status: 'staked', 
      isRented: true, 
      tenant: 'Surf Paradise LLC',
      imageUrl: '/images/EL_BOOM_RESIDENCE.png',
      description: 'Spacious residence with stunning views...',
      squareMeters: 250,
      amenities: ['4 Bedrooms', '3 Bathrooms', 'Ocean View']
    },
    { 
      id: 'n4', 
      name: 'Casa Amarilla', 
      city: 'Aposentillo', 
      value: 100000, 
      monthlyRent: 800, 
      status: 'staked', 
      isRented: false,
      imageUrl: '/images/CASA_AMARILLA.png',
      description: 'A beautiful yellow house by the sea.',
      squareMeters: 180,
      amenities: ['3 Bedrooms', '2 Bathrooms', 'Beach Access']
    },
  ]
};

// Mock chart data
const chartData = {
  monthlyRent: [15800, 16200, 16800],
  propertyValue: [2800000, 2820000, 2845000],
  months: ['Jan', 'Feb', 'Mar']
};

// Portfolio performance data
const portfolioPerformance = {
  totalReturn: 12.5,
  monthlyGrowth: 2.3,
  annualizedReturn: 15.8,
  volatility: 8.2,
  sharpeRatio: 1.85,
  maxDrawdown: -3.2,
  performanceHistory: [
    { month: 'Jan', value: 2800000, rent: 15800, return: 0 },
    { month: 'Feb', value: 2820000, rent: 16200, return: 0.7 },
    { month: 'Mar', value: 2845000, rent: 16800, return: 1.6 },
    { month: 'Apr', value: 2872000, rent: 17200, return: 2.6 },
    { month: 'May', value: 2898000, rent: 17500, return: 3.5 },
    { month: 'Jun', value: 2925000, rent: 17800, return: 4.5 },
    { month: 'Jul', value: 2952000, rent: 18100, return: 5.4 },
    { month: 'Aug', value: 2978000, rent: 18400, return: 6.4 },
    { month: 'Sep', value: 3005000, rent: 18700, return: 7.3 },
    { month: 'Oct', value: 3032000, rent: 19000, return: 8.3 },
    { month: 'Nov', value: 3058000, rent: 19300, return: 9.2 },
    { month: 'Dec', value: 3085000, rent: 19600, return: 10.2 }
  ]
};

type ViewMode = 'cities' | 'staked';

export const Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cities');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const ownedProperties = userPortfolio.properties.filter(p => p.status === 'owned');
  const stakedProperties = userPortfolio.properties.filter(p => p.status === 'staked');
  
  const citiesWithAssets = [...new Set(userPortfolio.properties.map(p => p.city))];
  
  const filteredProperties = viewMode === 'cities' 
    ? (selectedCity ? ownedProperties.filter(p => p.city === selectedCity) : ownedProperties)
    : stakedProperties;

  const totalMonthlyRevenue = userPortfolio.properties
    .filter(p => p.isRented)
    .reduce((sum, p) => sum + p.monthlyRent, 0);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-zinc-900/80 backdrop-blur-sm border-r border-zinc-800/50 p-6">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
        
        {/* Navigation Menu */}
        <nav className="space-y-2">
          <button
            onClick={() => setViewMode('cities')}
            className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              viewMode === 'cities'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Cities ({ownedProperties.length})
          </button>
          <button
            onClick={() => setViewMode('staked')}
            className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              viewMode === 'staked'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Staked Assets ({stakedProperties.length})
          </button>
        </nav>

        {/* City Filter (only for cities view) */}
        {viewMode === 'cities' && (
          <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Filter by City</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCity(null)}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedCity === null
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                All Cities
              </button>
              {citiesWithAssets.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                    selectedCity === city
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-white">${userPortfolio.totalValue.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-1">+12.5% this month</p>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Floor Price</h3>
            <p className="text-3xl font-bold text-white">${userPortfolio.floorPrice.toLocaleString()}</p>
            <p className="text-blue-400 text-sm mt-1">Conservative estimate</p>
          </div>
          
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-white">${totalMonthlyRevenue.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-1">+8.2% vs last month</p>
          </div>
        </div>

        {/* Portfolio Performance Section */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Portfolio Performance</h2>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h4 className="text-gray-400 text-sm font-medium mb-1">Total Return</h4>
              <p className="text-2xl font-bold text-green-400">{portfolioPerformance.totalReturn}%</p>
              <p className="text-gray-500 text-xs">YTD</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h4 className="text-gray-400 text-sm font-medium mb-1">Monthly Growth</h4>
              <p className="text-2xl font-bold text-blue-400">{portfolioPerformance.monthlyGrowth}%</p>
              <p className="text-gray-500 text-xs">This Month</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h4 className="text-gray-400 text-sm font-medium mb-1">Sharpe Ratio</h4>
              <p className="text-2xl font-bold text-purple-400">{portfolioPerformance.sharpeRatio}</p>
              <p className="text-gray-500 text-xs">Risk-Adjusted</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <h4 className="text-gray-400 text-sm font-medium mb-1">Max Drawdown</h4>
              <p className="text-2xl font-bold text-red-400">{portfolioPerformance.maxDrawdown}%</p>
              <p className="text-gray-500 text-xs">Peak to Trough</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="space-y-6">
            {/* Return Performance Line Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cumulative Returns</h3>
              <div className="relative h-32 bg-zinc-800/30 rounded-lg p-4">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="returnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.2"/>
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${100 - portfolioPerformance.performanceHistory[0].return * 8} ${portfolioPerformance.performanceHistory.map((data, index) => 
                      `L ${(index + 1) * (400 / (portfolioPerformance.performanceHistory.length - 1))} ${100 - data.return * 8}`
                    ).join(' ')}`}
                    stroke="#10B981"
                    strokeWidth="2"
                    fill="none"
                    className="transition-all duration-300"
                  />
                  <path
                    d={`M 0 ${100 - portfolioPerformance.performanceHistory[0].return * 8} ${portfolioPerformance.performanceHistory.map((data, index) => 
                      `L ${(index + 1) * (400 / (portfolioPerformance.performanceHistory.length - 1))} ${100 - data.return * 8}`
                    ).join(' ')} L ${400} 100 L 0 100 Z`}
                    fill="url(#returnGradient)"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                  {portfolioPerformance.totalReturn}% Total Return
                </div>
              </div>
            </div>

            {/* Combined Value and Revenue Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio Value Growth Chart */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300 font-medium">Portfolio Value</span>
                </div>
                <div className="flex items-end justify-between h-24">
                  {portfolioPerformance.performanceHistory.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-6 transition-all duration-300 hover:bg-blue-400 hover:scale-110"
                        style={{ height: `${(data.value / Math.max(...portfolioPerformance.performanceHistory.map(d => d.value))) * 100}%` }}
                      ></div>
                      <span className="text-gray-400 text-xs mt-1">${(data.value / 1000000).toFixed(1)}M</span>
                      <span className="text-gray-500 text-xs">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Revenue Trend */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300 font-medium">Monthly Revenue</span>
                </div>
                <div className="flex items-end justify-between h-24">
                  {portfolioPerformance.performanceHistory.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-green-500 to-green-400 rounded-t w-6 transition-all duration-300 hover:bg-green-400 hover:scale-110"
                        style={{ height: `${(data.rent / Math.max(...portfolioPerformance.performanceHistory.map(d => d.rent))) * 100}%` }}
                      ></div>
                      <span className="text-gray-400 text-xs mt-1">${data.rent.toLocaleString()}</span>
                      <span className="text-gray-500 text-xs">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Portfolio Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Rent Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue Trend</h3>
              <div className="flex items-end justify-between h-32">
                {chartData.monthlyRent.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-red-500 rounded-t w-12 transition-all duration-300 hover:bg-red-400"
                      style={{ height: `${(value / Math.max(...chartData.monthlyRent)) * 100}%` }}
                    ></div>
                    <span className="text-gray-400 text-sm mt-2">${value.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs">{chartData.months[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Value Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Value Trend</h3>
              <div className="flex items-end justify-between h-32">
                {chartData.propertyValue.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-12 transition-all duration-300 hover:bg-blue-400"
                      style={{ height: `${(value / Math.max(...chartData.propertyValue)) * 100}%` }}
                    ></div>
                    <span className="text-gray-400 text-sm mt-2">${(value / 1000000).toFixed(1)}M</span>
                    <span className="text-gray-500 text-xs">{chartData.months[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 h-80">
              {/* Property Image as Background */}
              <div className="absolute inset-0">
                <img 
                  src={property.imageUrl} 
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-property.jpg';
                  }}
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
              </div>

              {/* Property Details */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Status Labels - only show on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2 mb-4">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      property.status === 'owned' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {property.status === 'owned' ? 'Owned' : 'Staked'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      property.isRented 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {property.isRented ? 'Rented' : 'Available'}
                    </span>
                  </div>

                  {/* Action Buttons - only show on hover */}
                  <div className="flex gap-2 mb-4">
                    <Link to={`/property/${property.id}`} className="flex-1">
                      <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200">
                        View Details
                      </button>
                    </Link>
                    <button className="flex-1 bg-zinc-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors duration-200">
                      Manage
                    </button>
                  </div>
                </div>

                {/* Property Info - pushed to bottom */}
                <div className="mt-auto">
                  <h3 className="text-xl font-bold text-white font-display mb-2">{property.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Value</span>
                      <span className="text-white font-semibold">${property.value.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Monthly Rent</span>
                      <span className="text-green-400 font-semibold">${property.monthlyRent.toLocaleString()}</span>
                    </div>
                    
                    {property.isRented && property.tenant && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Tenant</span>
                        <span className="text-white text-sm">{property.tenant}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
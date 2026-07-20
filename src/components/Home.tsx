import { useState, useEffect } from 'react';
import { City, Property } from '../types';
import { CityCard } from './CityCard';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailModal } from './PropertyDetailModal';
import { useResponsiveSlice } from '../hooks/useResponsiveSlice';
import { DevelopmentsSection } from './DevelopmentsSection';
import { Link } from 'react-router-dom';

interface HomeProps {
  cities: City[];
}

export const Home = ({ cities }: HomeProps) => {
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [globalActiveIndex, setGlobalActiveIndex] = useState(0);
  const sliceCount = useResponsiveSlice();

  const displayedCities = showAllCities ? cities : cities.slice(0, sliceCount);

  // Global sequential animation - cycles through all images across all cities
  useEffect(() => {
    const totalImages = displayedCities.length * 4; // 4 images per city
    const interval = setInterval(() => {
      setGlobalActiveIndex((prev) => (prev + 1) % totalImages);
    }, 1200); // Each animation lasts 1.2 seconds

    return () => clearInterval(interval);
  }, [displayedCities.length]);

  const hotProperties = cities.flatMap(city => 
    city.properties.slice(0, 2).map(property => ({
      ...property,
      cityName: city.name,
      cityLocation: city.location
    }))
  );

  const handleOpenModal = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 main-content">
        {/* Hero Section */}
        <div className="py-16 animate-fade-in">
          <div className="text-center">
            <h1 className="font-display tracking-tight font-extrabold">
              <span className="block text-4xl sm:text-5xl md:text-6xl text-white">Citadelle</span>
              <span className="block text-xl sm:text-2xl md:text-3xl text-[#ff4444] opacity-90 mt-2">
                Crowdfund Cities. Tokenize Reality.
              </span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              SEZs. Startup Cities. Powered by Web3.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="https://infinitacity.modelme3d.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    3D Map View
                </span>
              </a>
              <Link to="/get-in-early" className="btn btn-primary group relative overflow-hidden">
                <span className="relative z-10 flex items-center">🚀 Get in Early</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Developments Section */}
      <DevelopmentsSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 main-content">
        {/* Cities Grid */}
        <div className="py-12">
          <h2 className="text-2xl font-bold text-white mb-6 font-display">Cities</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedCities.map((city, index) => (
              <CityCard 
                key={city.id} 
                city={city} 
                index={index} 
                globalActiveIndex={globalActiveIndex}
                onAnimationComplete={() => {}}
              />
            ))}
          </div>
          {cities.length > sliceCount && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAllCities(!showAllCities)} className="btn btn-secondary group relative overflow-hidden">
                <span className="relative z-10">{showAllCities ? 'Show less' : 'Show more'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Hot Properties Section */}
        <div className="py-16">
          <h2 className="text-2xl font-bold text-white mb-8 font-display">Hot Properties</h2>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-gallery">
              {[...hotProperties, ...hotProperties].map((property, index) => (
                <div key={index} className="flex-shrink-0 w-80 mx-4">
                  <PropertyCard property={property} onCardClick={handleOpenModal} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PropertyDetailModal property={selectedProperty} isOpen={!!selectedProperty} onClose={handleCloseModal} />
    </>
  );
}; 
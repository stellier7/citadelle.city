import { useState, useEffect } from 'react';
import { City, Property } from '../types';
import { CityCard } from './CityCard';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailModal } from './PropertyDetailModal';
import { useResponsiveSlice } from '../hooks/useResponsiveSlice';
import { DevelopmentHero } from './DevelopmentHero';
import { HowItWorks } from './HowItWorks';

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
      {/* New Development-Focused Hero */}
      <DevelopmentHero />

      {/* How It Works Section */}
      <HowItWorks />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 main-content py-16">

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
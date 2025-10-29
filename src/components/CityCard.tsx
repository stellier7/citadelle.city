import { City } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface CityCardProps {
  city: City;
  index: number;
  globalActiveIndex: number;
  onAnimationComplete: () => void;
}

export const CityCard = ({ city, index, globalActiveIndex, onAnimationComplete }: CityCardProps) => {
  const previewProperties = city.properties.slice(0, 4);
  const [changedImages, setChangedImages] = useState<Set<number>>(new Set());
  
  // Calculate which image should be active for this city
  const cityActiveImage = Math.floor(globalActiveIndex / 4) === index ? globalActiveIndex % 4 : -1;
  
  // Handle image changes - toggle between original and _1 versions
  useEffect(() => {
    if (cityActiveImage >= 0) {
      setChangedImages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cityActiveImage)) {
          newSet.delete(cityActiveImage); // Toggle back to original
        } else {
          newSet.add(cityActiveImage); // Toggle to _1 version
        }
        return newSet;
      });
    }
  }, [cityActiveImage]);

  return (
    <Link 
      to={`/city/${city.id}`} 
      className="block group"
      style={{ 
        animationDelay: `${index * 0.2}s`,
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out forwards'
      }}
    >
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-blue-500/20 border border-zinc-800/50 group-hover:border-zinc-700/70">
        <div className="grid grid-cols-2">
          {previewProperties.map((prop, imageIndex) => {
            const isCurrentlyAnimating = cityActiveImage === imageIndex;
            const hasBeenChanged = changedImages.has(imageIndex);
            const shouldShowSecondImage = hasBeenChanged || isCurrentlyAnimating;
            
            return (
              <div 
                key={prop.id} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  isCurrentlyAnimating
                    ? 'scale-105 shadow-lg shadow-blue-500/30 z-10 rounded-sm' 
                    : 'scale-100'
                }`}
                style={{
                  animation: isCurrentlyAnimating
                    ? 'pianoBounce 0.8s ease-in-out' 
                    : 'none'
                }}
              >
                {/* Subtle border - only on outer edges */}
                <div className={`absolute inset-0 pointer-events-none ${
                  imageIndex === 0 ? 'border-l border-t border-white/10' : ''
                } ${
                  imageIndex === 1 ? 'border-r border-t border-white/10' : ''
                } ${
                  imageIndex === 2 ? 'border-l border-b border-white/10' : ''
                } ${
                  imageIndex === 3 ? 'border-r border-b border-white/10' : ''
                }`} />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Primary Image */}
                <img 
                  src={prop.imageUrl} 
                  alt={prop.name} 
                  className={`w-full h-32 object-cover transition-all duration-500 ${
                    shouldShowSecondImage ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                {/* Second Image (shown when changed or during animation) */}
                {shouldShowSecondImage && (
                  <img 
                    src={prop.galleryImages && prop.galleryImages.length > 0 ? prop.galleryImages[0] : prop.imageUrl} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-32 object-cover transition-all duration-500 opacity-100"
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mx-4" />
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white font-display mb-2">
            {city.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {city.location}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">
              {city.properties.length} Properties
            </span>
            <span className="text-white group-hover:text-gray-300 transition-colors duration-300 flex items-center gap-2">
              View City 
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}; 
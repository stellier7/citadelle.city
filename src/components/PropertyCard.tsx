import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaCar } from 'react-icons/fa';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onCardClick: (property: Property) => void;
}

export const PropertyCard = ({ property, onCardClick }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = property.imageUrl || '/images/placeholder-property.jpg';
  const hoverImage = property.galleryImages?.[0] || primaryImage.replace(/(\.[^.]+)$/, '_1$1');
  
  return (
    <div 
      className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1 border border-zinc-800"
      onClick={() => onCardClick(property)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={isHovered ? hoverImage : primaryImage}
        alt={property.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-4 pt-4">
          <h3 className="text-md font-semibold text-white truncate">{property.name}</h3>
        </div>
        <div className="relative h-12 mt-1 overflow-hidden group-hover:bg-[#ff4444] transition-colors duration-300">
          <div className="absolute inset-0 flex justify-between items-center px-4 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:-translate-y-full">
            <p className="text-sm text-gray-300 truncate">{property.description}</p>
            <p className="text-sm font-bold text-white">${property.price.toLocaleString()}</p>
          </div>
          <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 translate-y-full transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
            <p className="font-bold text-white">Buy</p>
            <p className="font-bold text-white">${property.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 
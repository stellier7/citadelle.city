import { useParams } from 'react-router-dom';
import { Property } from '../types';
import { useRWAContract } from '../engine/RWAContract';

export const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { getProperty } = useRWAContract();

  // Placeholder data - replace with actual data from your contract
  const property: Property = {
    id: propertyId || '',
    name: 'Beach Club Villa 101',
    description: 'Luxurious beachfront villa with stunning ocean views',
    price: 500000,
    squareMeters: 200,
    status: 'available',
    imageUrl: '/images/beach-club-villa.jpg'
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{property.name}</h1>
              <p className="mt-2 text-lg text-gray-400">{property.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <span className="text-gray-400">Price</span>
                <p className="text-xl font-bold text-white">${property.price.toLocaleString()}</p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <span className="text-gray-400">Size</span>
                <p className="text-xl font-bold text-white">{property.squareMeters} m²</p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <span className="text-gray-400">Status</span>
              <p className={`text-xl font-bold ${
                property.status === 'available' ? 'text-[#ff4444]' : 'text-white'
              }`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </p>
            </div>

            {property.status === 'available' && (
              <button className="w-full btn btn-primary py-3">
                Contact Agent
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
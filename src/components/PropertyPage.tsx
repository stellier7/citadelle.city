import { useParams, Link } from 'react-router-dom';
import { Property, City } from '../types';
import { useState, useEffect } from 'react';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

interface PropertyPageProps {
  cities: City[];
}

export const PropertyPage = ({ cities }: PropertyPageProps) => {
  const { propertyId } = useParams<{ propertyId: string }>();
  
  // Find the property and its city
  let property: Property | undefined;
  const city = cities.find(c => {
    property = c.properties.find(p => p.id === propertyId);
    return !!property;
  });

  // Image gallery state
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    if (property) {
      let imageSources: string[] = [];
      if (property.galleryImages && property.galleryImages.length > 0) {
        imageSources = property.galleryImages;
      } else if (property.imageUrl) {
        imageSources = [property.imageUrl];
      }

      setImages(imageSources.length > 0 ? imageSources : ['/images/placeholder-property.jpg']);
    }
  }, [property]);

  if (!property || !city) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Property Not Found</h2>
          <p className="text-gray-400">We couldn't find the property you're looking for.</p>
          <Link to="/" className="mt-6 btn btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/city/${city.id}`} className="hover:text-red-400 transition-colors">{city.name}</Link>
          <span>/</span>
          <span className="text-white font-medium">{property.name}</span>
        </nav>

        {/* Image Gallery */}
        <div className="mb-8 overflow-hidden">
            <div className="flex animate-scroll-gallery space-x-4">
              {[...images, ...images].map((src, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 aspect-video">
                    <img src={src} alt={`${property?.name} gallery image ${index + 1}`} className="w-full h-full object-cover rounded-lg"/>
                </div>
              ))}
            </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">{property.name}</h1>
            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <FaMapMarkerAlt />
              <span>{property.description.includes('Roatan') || property.description.includes('Jurere') ? property.description : `${city.location}`}</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-gray-300 mb-8">
              <p>{property.description}</p>
            </div>

            <h2 className="text-2xl font-bold font-display mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="bg-zinc-900 p-4 rounded-lg flex items-center gap-3">
                  <span className="text-red-400">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            {property.detailedDescription && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold font-display mb-4">About this Property</h2>
                <div className="prose prose-invert max-w-none text-gray-300">
                  {property.detailedDescription.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Price & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-2xl p-6 sticky top-24">
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-4xl font-bold text-white mb-6">${property.price.toLocaleString()}</p>
              
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                 <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xl font-bold">{property.squareMeters}</div>
                    <div className="text-xs text-gray-400">m²</div>
                 </div>
                 <div className="bg-black/20 p-3 rounded-lg">
                    <div className="text-xl font-bold">{property.amenities?.[0]?.split(' ')[0] || 'N/A'}</div>
                    <div className="text-xs text-gray-400">{property.amenities?.[0]?.split(' ')[1] || 'Beds'}</div>
                 </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button className="w-full btn btn-primary text-lg">Purchase</button>
                <button className="w-full btn btn-secondary text-lg">Make an Offer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
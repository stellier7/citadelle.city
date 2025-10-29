import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { City, EscrowProject, Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailModal } from './PropertyDetailModal';
import { EscrowCard } from './EscrowCard';

interface CityViewProps {
  cities: City[];
  escrowProjects: EscrowProject[];
}

type SortOption = 'price-desc' | 'price-asc' | 'recent';

export const CityView = ({ cities, escrowProjects }: CityViewProps) => {
  const { cityId } = useParams();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('price-desc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const city = cities.find(c => c.id === cityId);
  const cityProjects = escrowProjects.filter(p => p.city === city?.name || (p.city === 'Bitcoin City' && city?.name === 'Bitcoin City'));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.classList.remove('animate-scroll-gallery');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add('animate-scroll-gallery');
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.classList.add('animate-scroll-gallery');
      }
    }
  };

  const sortedProperties = city?.properties.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        // A simple default sort for 'recent' or other cases
        return (a.id < b.id) ? 1 : -1;
    }
  });

  const handleOpenModal = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">City Not Found</h2>
          <p className="text-gray-400">The city you're looking for doesn't exist.</p>
          <Link to="/" className="mt-6 btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Bar */}
        <div className="fixed top-20 left-4 right-4 z-40 flex justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>

          {/* Sort Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {sortBy === 'price-desc' ? 'Price: High to Low' :
               sortBy === 'price-asc' ? 'Price: Low to High' :
               'Recently Added'}
            </button>
            
            <div className={`absolute right-0 mt-2 w-48 rounded-lg bg-zinc-900/90 backdrop-blur-sm shadow-lg transition-all duration-200 ${
              isSortOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
              <div className="py-1">
                <button onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }} className={`w-full px-4 py-2 text-left text-sm ${sortBy === 'price-desc' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>Price: High to Low</button>
                <button onClick={() => { setSortBy('price-asc'); setIsSortOpen(false); }} className={`w-full px-4 py-2 text-left text-sm ${sortBy === 'price-asc' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>Price: Low to High</button>
                <button onClick={() => { setSortBy('recent'); setIsSortOpen(false); }} className={`w-full px-4 py-2 text-left text-sm ${sortBy === 'recent' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>Recently Added</button>
              </div>
            </div>
          </div>
        </div>

        {/* City Header */}
        <div className="mb-12 text-center mt-16">
          <h1 className="text-4xl font-bold text-white mb-4 font-display">{city.name}</h1>
          <p className="text-xl text-gray-400">{city.description}</p>
        </div>

        {/* Escrow Projects Section */}
        {cityProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 font-display">Investment Opportunities</h2>
            <div className="relative overflow-hidden">
              <div 
                ref={scrollContainerRef}
                className={`flex gap-8 ${cityProjects.length > 1 ? 'animate-scroll-gallery' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {cityProjects.map(project => (
                  <div key={`p1-${project.id}`} className="flex-shrink-0 w-[90vw] max-w-lg">
                    <EscrowCard project={project} />
                  </div>
                ))}
                {cityProjects.length > 1 && cityProjects.map(project => (
                   <div key={`p2-${project.id}`} className="flex-shrink-0 w-[90vw] max-w-lg">
                     <EscrowCard project={project} />
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white font-display">Available Properties</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties?.map(property => (
            <PropertyCard key={property.id} property={property} onCardClick={handleOpenModal} />
          ))}
        </div>
      </div>
      
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}; 
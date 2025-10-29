import { Property } from '../types';
import { FaTimes, FaWallet, FaExpand, FaCompress } from 'react-icons/fa';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const AccordionSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="border-t border-zinc-700">
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between items-center py-4 text-left text-lg font-medium text-white focus:outline-none">
                        <span>{title}</span>
                        <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-400 transition-transform`}
                        />
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel className="pb-4 text-sm text-gray-400">
                            {children}
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    </div>
);

export const PropertyDetailModal = ({ property, isOpen, onClose }: PropertyDetailModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !property) {
    return null;
  }

  return (
    <>
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={property.imageUrl} 
              alt={property.name} 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 p-2"
            >
              <FaCompress className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-6xl mx-4 shadow-2xl h-[90vh] flex overflow-hidden">
          {/* Left Column: Image Gallery */}
          <div className="w-1/2 h-full relative">
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-contain bg-zinc-800" 
              />
              <button 
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <FaExpand className="w-5 h-5" />
              </button>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-1/2 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                  <h2 className="text-2xl font-bold text-white">{property.name}</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200 p-1">
                      <FaTimes className="w-6 h-6" />
                  </button>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                  {/* Actions */}
                  <div className="p-6">
                      <div className="bg-zinc-800 p-4 rounded-lg">
                          <p className="text-gray-400 mb-2">Current price</p>
                          <p className="text-3xl font-bold text-white mb-4">${property.price.toLocaleString()}</p>
                          <div className="flex gap-4">
                              <button className="flex-1 bg-[#ff4444] hover:bg-[#ff6666] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                                  <FaWallet />
                                  Buy Now
                              </button>
                              <button className="flex-1 border border-zinc-600 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg">
                                  Make Offer
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Accordion Sections */}
                  <div className="px-6">
                      <AccordionSection title="Amenities">
                          {property.amenities && property.amenities.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {property.amenities.map(amenity => (
                                      <div key={amenity} className="bg-zinc-800 p-3 rounded-lg text-center">
                                          <p className="font-semibold text-white text-sm">{amenity}</p>
                                      </div>
                                  ))}
                              </div>
                          ) : <p>No amenities listed.</p>}
                      </AccordionSection>

                      <AccordionSection title="About">
                          <p>{property.description}</p>
                      </AccordionSection>

                      <AccordionSection title="Price History">
                          <div className="bg-zinc-800 p-4 rounded-lg text-center">
                              <p className="text-gray-400">Coming soon...</p>
                          </div>
                      </AccordionSection>

                      <AccordionSection title="More from this city">
                          <p>Coming soon...</p>
                      </AccordionSection>
                  </div>

                  {/* More Info Button */}
                  <div className="p-6 border-t border-zinc-700">
                      <Link
                          to={`/property/${property.id}`}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                      >
                          View Full Details
                      </Link>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}; 
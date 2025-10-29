import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, formatDistance } from 'viem';
import { useRWAContract } from '../engine/RWAContract';
import { useRevenueContract } from '../engine/RevenueContract';

interface PropertyCard {
  id: number;
  name: string;
  location: string;
  price: string;
  isStaked: boolean;
  stakingEndTime?: number;
  rentalRate: string;
  nextPaymentDate: number;
  lastPaymentAmount: string;
  autoRestake: boolean;
  stakingRewards: string;
}

export const PropertyDashboard: React.FC = () => {
  const { address } = useAccount();
  const { allSubmissions, isOwner, isVerifier } = useRWAContract();
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      if (!allSubmissions) return;

      const propertyData = await Promise.all(
        allSubmissions.map(async (submission) => {
          const revenue = await getPropertyRevenue(submission.tokenId);
          return {
            id: submission.tokenId,
            name: submission.name,
            location: submission.location,
            price: formatEther(submission.price),
            isStaked: revenue.isStaked,
            stakingEndTime: revenue.stakingEndTime,
            rentalRate: formatEther(revenue.rentalRate),
            nextPaymentDate: revenue.nextPaymentDate,
            lastPaymentAmount: formatEther(revenue.lastPaymentAmount),
            autoRestake: revenue.autoRestake,
            stakingRewards: formatEther(revenue.stakingRewards)
          };
        })
      );

      setProperties(propertyData);
      setIsLoading(false);
    };

    loadProperties();
  }, [allSubmissions]);

  const handleStake = async (propertyId: number, duration: number) => {
    try {
      await stakeProperty(propertyId, duration);
      // Refresh property data
      loadProperties();
    } catch (error) {
      console.error('Error staking property:', error);
    }
  };

  const handleUnstake = async (propertyId: number) => {
    try {
      await unstakeProperty(propertyId);
      // Refresh property data
      loadProperties();
    } catch (error) {
      console.error('Error unstaking property:', error);
    }
  };

  const handleToggleAutoRestake = async (propertyId: number) => {
    try {
      await toggleAutoRestake(propertyId);
      // Refresh property data
      loadProperties();
    } catch (error) {
      console.error('Error toggling auto-restake:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
              <p className="text-gray-600 mb-4">{property.location}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">{property.price} ETH</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${property.isStaked ? 'text-green-600' : 'text-blue-600'}`}>
                    {property.isStaked ? 'Staked' : 'Available'}
                  </span>
                </div>

                {property.isStaked && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staking Ends:</span>
                      <span className="font-semibold">
                        {formatDistance(property.stakingEndTime, new Date(), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="font-semibold">
                        {formatDistance(property.nextPaymentDate, new Date(), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-semibold">{property.lastPaymentAmount} ETH</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Staking Rewards:</span>
                      <span className="font-semibold">{property.stakingRewards} ETH</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto-Restake:</span>
                      <button
                        onClick={() => handleToggleAutoRestake(property.id)}
                        className={`px-4 py-2 rounded ${
                          property.autoRestake
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        } text-white transition-colors duration-200`}
                      >
                        {property.autoRestake ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 space-x-4">
                {!property.isStaked ? (
                  <button
                    onClick={() => handleStake(property.id, 30 * 24 * 60 * 60)} // 30 days
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors duration-200"
                  >
                    Stake Property
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnstake(property.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors duration-200"
                  >
                    Unstake Property
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
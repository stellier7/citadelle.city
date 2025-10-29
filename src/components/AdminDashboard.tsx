import { useRWAContract, PropertySubmission } from '../engine/RWAContract';
import { useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';

export const Dashboard = () => {
    const { 
        isOwner, 
        isVerifier,
        getAllSubmissions, 
        getUserSubmissions,
        verifySubmittedProperty,
        mintSubmittedProperty, 
        isMinting 
    } = useRWAContract();

    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'my-properties' | 'revenue'>('all');
    const address = useAddress();

    const allSubmissions = getAllSubmissions();
    const userSubmissions = getUserSubmissions();

    // Mock revenue data (replace with actual data from your contract)
    const mockRevenue = {
        totalRevenue: "1.5 ETH",
        properties: [
            { id: "1", address: "123 Main St", monthlyRevenue: "0.5 ETH", lastPaid: "2024-03-01" },
            { id: "2", address: "456 Oak Ave", monthlyRevenue: "1.0 ETH", lastPaid: "2024-03-05" },
        ]
    };

    const handleVerify = async (submission: PropertySubmission) => {
        try {
            setVerifyingId(submission.legalIdentifier);
            const result = await verifySubmittedProperty(submission);
            console.log('Verification result:', result);
            
            if (result.explorerUrl) {
                window.open(result.explorerUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to verify property:', error);
            alert(error instanceof Error ? error.message : 'Failed to verify property');
        } finally {
            setVerifyingId(null);
        }
    };

    const handleMint = async (submission: PropertySubmission) => {
        try {
            const result = await mintSubmittedProperty(submission);
            console.log('Mint result:', result);
            if (result.explorerUrl) {
                window.open(result.explorerUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to mint property:', error);
            alert(error instanceof Error ? error.message : 'Failed to mint property');
        }
    };

    return (
        <div className="mt-8">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {isOwner ? 'Admin Dashboard' : isVerifier ? 'Verifier Dashboard' : 'Property Dashboard'}
                </h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'all' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All Properties
                    </button>
                    <button
                        onClick={() => setActiveTab('my-properties')}
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'my-properties' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        My Properties
                    </button>
                    {address && (
                        <button
                            onClick={() => setActiveTab('revenue')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'revenue' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Revenue
                        </button>
                    )}
                </div>
            </div>

            {/* Revenue View */}
            {activeTab === 'revenue' && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
                    <div className="mb-6">
                        <p className="text-2xl font-bold text-blue-600">{mockRevenue.totalRevenue}</p>
                        <p className="text-gray-500">Total Revenue</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {mockRevenue.properties.map((property) => (
                            <div key={property.id} className="py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{property.address}</p>
                                        <p className="text-sm text-gray-500">Last paid: {property.lastPaid}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-blue-600">{property.monthlyRevenue}</p>
                                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Properties List */}
            {(activeTab === 'all' || activeTab === 'my-properties') && (
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    {(activeTab === 'all' ? allSubmissions : userSubmissions).length === 0 ? (
                        <div className="p-4 text-gray-500">No properties found.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {(activeTab === 'all' ? allSubmissions : userSubmissions).map((submission, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="truncate text-sm font-medium text-blue-600">
                                                {submission.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {submission.address}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center space-x-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                submission.status === 'minted' ? 'bg-green-100 text-green-800' :
                                                submission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                            </span>
                                            {submission.status === 'pending' && isVerifier && (
                                                <button
                                                    onClick={() => handleVerify(submission)}
                                                    disabled={verifyingId === submission.legalIdentifier}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {verifyingId === submission.legalIdentifier ? 'Verifying...' : 'Verify'}
                                                </button>
                                            )}
                                            {submission.status === 'approved' && isOwner && (
                                                <button
                                                    onClick={() => handleMint(submission)}
                                                    disabled={isMinting}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isMinting ? 'Minting...' : 'Mint NFT'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {submission.price} Wei | {submission.squareMeters} m² | {submission.city}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Submitted by: {submission.submitterAddress.slice(0, 6)}...{submission.submitterAddress.slice(-4)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Submitted on {new Date(submission.submissionDate).toLocaleDateString()}
                                    </div>
                                    {submission.tokenId && (
                                        <div className="mt-2 text-sm">
                                            <span className="font-medium">Token ID:</span> {submission.tokenId}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}; 
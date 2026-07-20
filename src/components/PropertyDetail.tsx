import { useParams } from 'react-router-dom';

export const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
          <h1 className="text-3xl font-bold mb-4">Property Details</h1>
          <p className="text-zinc-400">Property ID: {propertyId}</p>
          <p className="text-zinc-400 mt-2">Property details are currently unavailable.</p>
        </div>
      </div>
    </div>
  );
};

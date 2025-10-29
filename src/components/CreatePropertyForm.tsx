import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { useRWAContract, PropertySubmission } from '../engine/RWAContract';
import { uploadToIPFS } from '../lib/ipfs';
import { useAccount } from 'wagmi';

export function CreatePropertyForm() {
  const { submitProperty } = useRWAContract();
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    price: '',
    squareMeters: '',
    legalIdentifier: '',
    city: '',
    amenities: '',
    coordinates: '',
    imageUrl: '',
    documentUrl: '',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error('Please select a valid image file');
      return;
    }

    try {
      setIsUploading(true);
      const file = acceptedFiles[0];
      const ipfsUrl = await uploadToIPFS(file);
      setFormData(prev => ({ ...prev, imageUrl: ipfsUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const propertySubmission: PropertySubmission = {
        ...formData,
        submitterAddress: address,
        submissionDate: Date.now(),
        status: 'pending',
        squareMeters: parseInt(formData.squareMeters)
      };
      
      await submitProperty(propertySubmission);
      toast.success('Property submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        price: '',
        squareMeters: '',
        legalIdentifier: '',
        city: '',
        amenities: '',
        coordinates: '',
        imageUrl: '',
        documentUrl: '',
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit property');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Property Image</label>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-gray-400 transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
            }`}
          >
            <div className="space-y-1 text-center">
              <input {...getInputProps()} />
              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="Property preview"
                    className="mx-auto h-32 w-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    />
                  </svg>
                  <div className="text-sm text-gray-400">
                    {isUploading ? (
                      'Uploading...'
                    ) : (
                      <>
                        <span className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Other form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Legal Identifier</label>
            <input
              type="text"
              value={formData.legalIdentifier}
              onChange={(e) => setFormData(prev => ({ ...prev, legalIdentifier: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Price (ETH)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Square Meters</label>
            <input
              type="number"
              value={formData.squareMeters}
              onChange={(e) => setFormData(prev => ({ ...prev, squareMeters: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Coordinates</label>
            <input
              type="text"
              value={formData.coordinates}
              onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="lat,long"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Amenities</label>
            <textarea
              value={formData.amenities}
              onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Comma-separated list of amenities"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">Document URL</label>
            <input
              type="url"
              value={formData.documentUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, documentUrl: e.target.value }))}
              className="mt-1 block w-full rounded-md bg-zinc-800 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isUploading}
          className={`px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Submit Property'}
        </button>
      </div>
    </form>
  );
} 
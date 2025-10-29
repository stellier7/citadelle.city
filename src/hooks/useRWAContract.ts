import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { type Abi } from 'viem';
import config from '../config';

// Import only the ABI array from the JSON file
const RWAContractABI = (await import('../abi/RWAContract.json')).abi as Abi;

export function useRWAContract() {
  const { address: walletAddress, isConnected } = useAccount();
  const contractAddress = config.contract.address as `0x${string}`;

  // Read contract data
  const { data: owner, error: ownerError, isPending: isLoadingOwner } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'owner',
  });

  const { data: assetName, error: assetError, isPending: isLoadingAsset } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'assetName',
  });

  const { data: details, error: detailsError, isPending: isLoadingDetails } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'getDetails',
  });

  // Write contract functions
  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  // Transaction receipt tracking
  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Submit property function
  const submitProperty = async (propertyData: any) => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet');
      }

      const result = await writeContract({
        address: contractAddress,
        abi: RWAContractABI,
        functionName: 'submitProperty',
        args: [propertyData],
      });

      toast.success('Transaction submitted!');
      return result;
    } catch (error: any) {
      console.error('Error submitting property:', error);
      toast.error(error.message || 'Failed to submit property');
      throw error;
    }
  };

  // Aggregate loading and error states
  const isLoading = isLoadingOwner || isLoadingAsset || isLoadingDetails || isWritePending || isConfirming;
  const error = ownerError || assetError || detailsError || writeError || confirmError;

  return {
    // Read data
    owner,
    assetName,
    details,
    isOwner: owner === walletAddress,
    
    // Write functions
    submitProperty,
    
    // Status
    isLoading,
    isConfirming,
    isConfirmed,
    error: error?.message,
    
    // Wallet
    walletAddress,
    isConnected,
  };
} 
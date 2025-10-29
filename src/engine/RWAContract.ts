import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import type { Hash, Abi } from 'viem';
import config from '../config';

export type PropertySubmission = {
  name: string;
  address: string;
  city: string;
  price: string;
  squareMeters: number;
  legalIdentifier: string;
  submitterAddress: string;
  submissionDate: number;
  status: 'pending' | 'approved' | 'rejected' | 'minted';
  tokenId?: string;
};

export type TransactionResult = {
  hash: Hash;
  explorerUrl?: string;
};

// Import only the ABI array from the JSON file
const RWAContractABI = (await import('../abi/RWAContract.json')).abi as Abi;

export function useRWAContract() {
  const { address: walletAddress, isConnected } = useAccount();
  const contractAddress = config.contract.address as `0x${string}`;

  // Read contract data
  const { data: allSubmissions, error: submissionsError, isPending: isLoadingSubmissions } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'getAllSubmissions',
  }) as { data: PropertySubmission[], error: Error | null, isPending: boolean };

  // Read user role data
  const { data: isOwner } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'isOwner',
    args: [walletAddress],
  }) as { data: boolean };

  const { data: isVerifier } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'isVerifier',
    args: [walletAddress],
  }) as { data: boolean };

  // Write contract functions
  const { writeContractAsync, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  // Transaction receipt tracking
  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Submit property function
  const submitProperty = async (propertyData: PropertySubmission): Promise<TransactionResult> => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet');
      }

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: RWAContractABI,
        functionName: 'submitProperty',
        args: [propertyData],
      });

      toast.success('Transaction submitted!');
      return {
        hash,
        explorerUrl: `${config.network.blockExplorer}/tx/${hash}`
      };
    } catch (error: any) {
      console.error('Error submitting property:', error);
      toast.error(error.message || 'Failed to submit property');
      throw error;
    }
  };

  // Get user submissions
  const { data: userSubmissions } = useReadContract({
    address: contractAddress,
    abi: RWAContractABI,
    functionName: 'getUserSubmissions',
    args: [walletAddress],
  }) as { data: PropertySubmission[] };

  // Verify property function
  const verifySubmittedProperty = async (submission: PropertySubmission): Promise<TransactionResult> => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: RWAContractABI,
        functionName: 'verifyProperty',
        args: [submission.legalIdentifier],
      });
      return {
        hash,
        explorerUrl: `${config.network.blockExplorer}/tx/${hash}`
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify property');
      throw error;
    }
  };

  // Mint property function
  const mintSubmittedProperty = async (submission: PropertySubmission): Promise<TransactionResult> => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: RWAContractABI,
        functionName: 'mintProperty',
        args: [submission.legalIdentifier],
      });
      return {
        hash,
        explorerUrl: `${config.network.blockExplorer}/tx/${hash}`
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to mint property');
      throw error;
    }
  };

  // Aggregate loading and error states
  const isLoading = isLoadingSubmissions || isWritePending || isConfirming;
  const error = submissionsError || writeError || confirmError;

  return {
    // Read data
    allSubmissions,
    userSubmissions,
    isOwner,
    isVerifier,
    
    // Write functions
    submitProperty,
    verifySubmittedProperty,
    mintSubmittedProperty,
    
    // Status
    isLoading,
    isConfirming,
    isConfirmed,
    isMinting: isWritePending,
    error: error?.message,
    
    // Wallet
    walletAddress,
    isConnected,
  };
} 
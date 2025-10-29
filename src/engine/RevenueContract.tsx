import { useAccount } from 'wagmi';
import { useReadContract, usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { useQuery } from "@tanstack/react-query";
import { useContractRead, useContractWrite } from 'wagmi';
import { revenueContractABI, revenueContractAddress } from '../contracts/revenueContract';

// Import the ABI
const RevenueContractABI = [
  {
    "inputs": [],
    "name": "getTotalPlatformRevenue",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "propertyId", "type": "string" }],
    "name": "getPropertyRevenue",
    "outputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserRevenue",
    "outputs": [
      { "internalType": "uint256", "name": "total", "type": "uint256" },
      { "internalType": "string[]", "name": "propertyIds", "type": "string[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "timestamps", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export interface PropertyRevenue {
  propertyId: string;
  amount: string;
  timestamp: number;
}

export interface UserRevenue {
  total: string;
  properties: PropertyRevenue[];
}

export function useRevenueContract() {
  const { address: walletAddress, isConnected } = useAccount();
  const contractAddress = import.meta.env.VITE_REVENUE_CONTRACT_ADDRESS as `0x${string}`;
  const publicClient = usePublicClient();

  // Read total platform revenue
  const { 
    data: totalRevenue,
    error: revenueError,
    isPending: isLoading
  } = useReadContract({
    address: contractAddress,
    abi: RevenueContractABI,
    functionName: 'getTotalPlatformRevenue',
    account: walletAddress,
  });

  // Contract write hooks
  const { write: stakeProperty } = useContractWrite({
    address: contractAddress,
    abi: RevenueContractABI,
    functionName: 'stakeProperty',
  });

  const { write: unstakeProperty } = useContractWrite({
    address: contractAddress,
    abi: RevenueContractABI,
    functionName: 'unstakeProperty',
  });

  const { write: toggleAutoRestake } = useContractWrite({
    address: contractAddress,
    abi: RevenueContractABI,
    functionName: 'toggleAutoRestake',
  });

  const { write: claimStakingRewards } = useContractWrite({
    address: contractAddress,
    abi: RevenueContractABI,
    functionName: 'claimStakingRewards',
  });

  // Get property revenue
  const getPropertyRevenue = async (propertyId: string): Promise<PropertyRevenue | null> => {
    if (!publicClient) return null;
    
    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: RevenueContractABI,
        functionName: 'getPropertyRevenue',
        args: [propertyId],
        account: walletAddress,
      });

      if (!result) return null;

      const [amount, timestamp] = result as [bigint, bigint];
      
      return {
        propertyId,
        amount: formatEther(amount),
        timestamp: Number(timestamp),
      };
    } catch (error) {
      console.error('Error fetching property revenue:', error);
      return null;
    }
  };

  // Get user revenue hook
  const useUserRevenue = (userAddress: string = walletAddress || '') => {
    return useQuery({
      queryKey: ['userRevenue', userAddress],
      queryFn: async (): Promise<UserRevenue> => {
        if (!publicClient) throw new Error('Public client not available');

        const result = await publicClient.readContract({
          address: contractAddress,
          abi: RevenueContractABI,
          functionName: 'getUserRevenue',
          args: [userAddress as `0x${string}`],
          account: walletAddress,
        });

        if (!result) {
          throw new Error('Failed to fetch user revenue');
        }

        const [total, propertyIds, amounts, timestamps] = result as [bigint, string[], bigint[], bigint[]];

        const properties = propertyIds.map((id, index) => ({
          propertyId: id,
          amount: formatEther(amounts[index]),
          timestamp: Number(timestamps[index]),
        }));

        return {
          total: formatEther(total),
          properties,
        };
      },
      enabled: isConnected && !!userAddress,
    });
  };

  return {
    totalRevenue: totalRevenue ? formatEther(totalRevenue as bigint) : '0',
    isLoading,
    error: revenueError?.message,
    getPropertyRevenue,
    useUserRevenue,
    stakeProperty,
    unstakeProperty,
    toggleAutoRestake,
    claimStakingRewards,
  };
} 
import { useCallback, useState } from 'react';
import { useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// This is a placeholder ABI - replace with actual contract ABI
const LEAF_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "purchaseToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Replace with actual contract address on Base Sepolia
const LEAF_CONTRACT_ADDRESS = '0x...';

export const useLeafContract = () => {
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [error, setError] = useState<string | null>(null);

    const { 
        writeContract,
        data: hash,
        isPending: isWritePending,
        error: writeError
    } = useWriteContract();

    const { 
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmError
    } = useWaitForTransactionReceipt({
        hash,
    });

    const handlePurchase = useCallback(async (tokenQuantity: number) => {
        try {
            setError(null);

            // Check if we're on the correct network
            if (chainId !== baseSepolia.id) {
                // Try to switch to Base Sepolia
                try {
                    await switchChain({ chainId: baseSepolia.id });
                } catch (switchError) {
                    setError('Please switch to Base Sepolia network to continue');
                    return;
                }
            }

            // Initiate the purchase transaction
            writeContract({
                address: LEAF_CONTRACT_ADDRESS,
                abi: LEAF_ABI,
                functionName: 'purchaseToken',
                args: [tokenQuantity],
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to purchase token');
        }
    }, [chainId, switchChain, writeContract]);

    return {
        handlePurchase,
        isTransactionLoading: isWritePending,
        isTransactionStarted: Boolean(hash),
        isConfirming,
        isConfirmed,
        transactionHash: hash,
        error: error || writeError?.message || confirmError?.message,
    };
}; 
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { rwaContractABI, rwaContractAddress } from '../contracts/rwaContract';

export const useRWAContract = () => {
  const { address } = useAccount();

  const { data: allSubmissions } = useContractRead({
    address: rwaContractAddress,
    abi: rwaContractABI,
    functionName: 'getAllSubmissions',
  });

  const { data: isOwner } = useContractRead({
    address: rwaContractAddress,
    abi: rwaContractABI,
    functionName: 'isOwner',
    args: [address],
  });

  const { data: isVerifier } = useContractRead({
    address: rwaContractAddress,
    abi: rwaContractABI,
    functionName: 'isVerifier',
    args: [address],
  });

  const { write: submitProperty } = useContractWrite({
    address: rwaContractAddress,
    abi: rwaContractABI,
    functionName: 'submitProperty',
  });

  const { write: verifyProperty } = useContractWrite({
    address: rwaContractAddress,
    abi: rwaContractABI,
    functionName: 'verifyProperty',
  });

  return {
    allSubmissions,
    isOwner,
    isVerifier,
    submitProperty,
    verifyProperty,
  };
}; 
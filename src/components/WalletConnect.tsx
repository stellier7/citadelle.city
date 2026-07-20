import { useAuth } from '../contexts/AuthContext';
import { FaUser } from 'react-icons/fa';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  className = ''
}) => {
  const { user } = useAuth();

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {user && (
        <div className="flex items-center gap-2 bg-[#222] rounded-lg px-4 py-2 border border-zinc-800">
          <FaUser className="text-[#ff4444]" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">User Account</span>
            <span className="text-sm">
              {user.displayName || user.email || 'Anonymous'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 
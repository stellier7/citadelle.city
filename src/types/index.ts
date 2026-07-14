// Using generic type instead of BigNumber to avoid import issues
type BigNumber = any;

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  squareMeters: number;
  status: 'available' | 'pending' | 'sold';
  imageUrl: string;
  isExample?: boolean;
  amenities?: string[];
  detailedDescription?: string;
}

export interface City {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  properties: Property[];
}

export interface EscrowProject {
  id: string;
  name: string;
  city: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  description: string;
  status: 'active' | 'completed' | 'failed';
  tokenization: {
    type: 'citadel' | 'fracta';
    totalTokens: number;
    tokenRepresentation: string;
    platform: string;
    features: string[];
  };
  imageUrl?: string; // Added for GetInEarly component
}

export interface WalletInfo {
  address: string;
  balance: BigNumber;
  isAdmin: boolean;
} 
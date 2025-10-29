export interface Property {
    id: string;
    name: string;
    description: string;
    address?: string;
    price: number;
    squareMeters: number;
    status: 'available' | 'sold' | 'pending';
    imageUrl?: string;
    galleryImages?: string[];
    isExample?: boolean;
    amenities?: string[];
    detailedDescription?: string;
    features?: {
        title: string;
        description: string;
        icon?: string;
    }[];
}

export interface City {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    properties: Property[];
}

export interface TokenizationDetails {
    type: 'citadelle' | 'fracta';
    totalTokens: number;
    tokenRepresentation: string;
    platform: string;
    features: string[];
}

export interface EscrowProject {
    id: string;
    name: string;
    city: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    description?: string;
    status: 'active' | 'completed' | 'cancelled';
    imageUrl: string;
    tokenization: {
        type: 'citadelle' | 'fracta' | 'leaf';
        totalTokens: number;
        tokenRepresentation: string;
        platform: string;
        features: string[];
    };
} 
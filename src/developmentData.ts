export interface DevelopmentProject {
  id: string;
  name: string;
  location: string;
  cityName: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  status: 'funding' | 'construction' | 'completed';
  
  // Financial details
  totalCost: number;
  tokenizedRaise: number;
  loanAmount: number;
  citadelEquity: number;
  
  // Tokenomics
  totalTokens: number;
  tokenPrice: number;
  tokensSold: number;
  
  // Timeline
  fundingDeadline: Date;
  constructionStart?: Date;
  estimatedCompletion?: Date;
  constructionDuration: number; // in months
  
  // Returns
  targetAnnualReturn: number; // percentage
  estimatedYield: string;
  distributionType: 'rental' | 'sale' | 'hybrid';
  
  // Project details
  type: 'residential' | 'commercial' | 'mixed-use';
  units: number;
  squareFeet: number;
  amenities: string[];
  
  // Tier thresholds
  builderTier: number; // min tokens
  developerTier: number; // min tokens
  founderTier: number; // min tokens
  
  // Risk & compliance
  riskLevel: 'low' | 'medium' | 'high';
  insurance: string[];
  legalEntity: string;
  
  // Additional info
  gallery?: string[];
  documents?: { name: string; url: string }[];
  team?: { name: string; role: string; bio?: string }[];
  milestones?: { title: string; percentage: number; status: 'pending' | 'in-progress' | 'completed' }[];
}

export const developmentProjects: DevelopmentProject[] = [
  {
    id: 'tower-x',
    name: 'Tower X',
    location: 'Pristine Bay, Próspera, Roatán',
    cityName: 'Próspera',
    description: `Tower X represents the future of luxury living in Central America's most progressive jurisdiction. This mixed-use development combines high-end residential units with premium commercial spaces, all situated in the heart of Próspera's Pristine Bay community.

The project features 48 luxury residences ranging from 1,200 to 3,500 square feet, each designed with floor-to-ceiling windows offering panoramic ocean and golf course views. The commercial component includes 6 premium retail and office spaces totaling 12,000 square feet, positioned to serve the growing expatriate and digital nomad community.

Built to the highest international standards, Tower X will feature smart home technology throughout, resort-style amenities, and sustainable design principles. The property benefits from Próspera's unique legal framework, offering investors unprecedented flexibility in ownership structures and regulatory compliance.`,
    shortDescription: 'Luxury mixed-use tower in Próspera\'s premier location. 48 residences + 6 commercial spaces. Ocean views, world-class amenities.',
    imageUrl: '/images/tower-x-render.jpg',
    status: 'funding',
    
    // Financial structure
    totalCost: 12000000,
    tokenizedRaise: 5000000,
    loanAmount: 5000000,
    citadelEquity: 2000000,
    
    // Tokenomics
    totalTokens: 10000,
    tokenPrice: 500,
    tokensSold: 0,
    
    // Timeline
    fundingDeadline: new Date('2026-12-31'),
    constructionDuration: 24,
    
    // Returns
    targetAnnualReturn: 15,
    estimatedYield: '5-8% during construction, 15-20% upon completion',
    distributionType: 'hybrid',
    
    // Project details
    type: 'mixed-use',
    units: 54, // 48 residential + 6 commercial
    squareFeet: 85000,
    amenities: [
      'Rooftop Infinity Pool',
      'State-of-the-art Fitness Center',
      'Co-working Spaces',
      'Private Beach Access',
      'Concierge Service',
      'Smart Home Technology',
      'Secured Parking',
      'Ocean & Golf Course Views',
      '24/7 Security',
      'Residents Lounge'
    ],
    
    // Tiers
    builderTier: 1,
    developerTier: 20,
    founderTier: 100,
    
    // Risk & compliance
    riskLevel: 'medium',
    insurance: ['Title Insurance', 'Construction Liability', 'Property Insurance'],
    legalEntity: 'Tower X Development LLC (Próspera ZEDE)',
    
    // Milestones
    milestones: [
      { title: 'Funding Complete', percentage: 0, status: 'pending' },
      { title: 'Land Acquisition & Permits', percentage: 10, status: 'pending' },
      { title: 'Foundation Complete', percentage: 30, status: 'pending' },
      { title: 'Structure Complete', percentage: 60, status: 'pending' },
      { title: 'Interior Finishing', percentage: 85, status: 'pending' },
      { title: 'Certificate of Occupancy', percentage: 100, status: 'pending' }
    ],
    
    gallery: [
      '/images/tower-x-render.jpg',
      '/images/tower-x-pool.jpg',
      '/images/tower-x-interior.jpg',
      '/images/tower-x-location.jpg'
    ]
  },
  {
    id: 'villa-collective',
    name: 'Villa Collective',
    location: 'Aposentillo, Nicaragua',
    cityName: 'Aposentillo',
    description: `A boutique collection of 12 luxury beachfront villas designed for the discerning traveler and remote professional. Each villa features private pools, ocean views, and direct beach access to one of Nicaragua's premier surf destinations.`,
    shortDescription: '12 luxury beachfront villas in Nicaragua\'s premier surf destination. Private pools, ocean views, strong rental demand.',
    imageUrl: '/images/villa-collective-render.jpg',
    status: 'funding',
    
    totalCost: 4800000,
    tokenizedRaise: 2000000,
    loanAmount: 2000000,
    citadelEquity: 800000,
    
    totalTokens: 4000,
    tokenPrice: 500,
    tokensSold: 450,
    
    fundingDeadline: new Date('2026-11-30'),
    constructionDuration: 18,
    
    targetAnnualReturn: 18,
    estimatedYield: '6-9% during construction, 18-22% upon completion',
    distributionType: 'rental',
    
    type: 'residential',
    units: 12,
    squareFeet: 42000,
    amenities: [
      'Private Infinity Pools',
      'Ocean Views',
      'Direct Beach Access',
      'High-Speed Internet',
      'Fully Furnished',
      'Property Management',
      'Concierge Service',
      'Surf Equipment Storage'
    ],
    
    builderTier: 1,
    developerTier: 15,
    founderTier: 75,
    
    riskLevel: 'medium',
    insurance: ['Title Insurance', 'Construction Liability', 'Rental Income Protection'],
    legalEntity: 'Villa Collective SA (Nicaragua)',
    
    milestones: [
      { title: 'Funding Complete', percentage: 11, status: 'in-progress' },
      { title: 'Site Preparation', percentage: 25, status: 'pending' },
      { title: 'Villa Shells Complete', percentage: 50, status: 'pending' },
      { title: 'Finishes & Pools', percentage: 80, status: 'pending' },
      { title: 'Furnishing Complete', percentage: 100, status: 'pending' }
    ]
  },
  {
    id: 'bitcoin-plaza',
    name: 'Bitcoin Plaza',
    location: 'Bitcoin City, El Salvador',
    cityName: 'Bitcoin City',
    description: `The flagship commercial development in El Salvador's revolutionary Bitcoin City. This Grade-A office and retail complex will serve as the business hub for companies relocating to the world's most crypto-friendly jurisdiction.`,
    shortDescription: 'Premier commercial complex in Bitcoin City. Grade-A office spaces, retail, and co-working facilities. Zero capital gains tax.',
    imageUrl: '/images/bitcoin-plaza-render.jpg',
    status: 'funding',
    
    totalCost: 18000000,
    tokenizedRaise: 8000000,
    loanAmount: 7000000,
    citadelEquity: 3000000,
    
    totalTokens: 16000,
    tokenPrice: 500,
    tokensSold: 0,
    
    fundingDeadline: new Date('2027-03-31'),
    constructionDuration: 30,
    
    targetAnnualReturn: 12,
    estimatedYield: '4-6% during construction, 12-16% upon completion',
    distributionType: 'rental',
    
    type: 'commercial',
    units: 24, // office suites + retail spaces
    squareFeet: 120000,
    amenities: [
      'Grade-A Office Spaces',
      'Premium Retail',
      'Co-working Facilities',
      'Conference Centers',
      'Bitcoin ATMs',
      'Fiber Optic Internet',
      'Backup Power Generation',
      'Secured Parking',
      'Helipad Access'
    ],
    
    builderTier: 1,
    developerTier: 25,
    founderTier: 125,
    
    riskLevel: 'medium',
    insurance: ['Title Insurance', 'Construction All-Risk', 'Business Interruption'],
    legalEntity: 'Bitcoin Plaza Inc (El Salvador)',
    
    milestones: [
      { title: 'Funding Complete', percentage: 0, status: 'pending' },
      { title: 'Land & Permits', percentage: 15, status: 'pending' },
      { title: 'Foundation & Structure', percentage: 45, status: 'pending' },
      { title: 'MEP Systems', percentage: 70, status: 'pending' },
      { title: 'Tenant Improvements', percentage: 90, status: 'pending' },
      { title: 'Grand Opening', percentage: 100, status: 'pending' }
    ]
  }
];

// Helper function to calculate funding progress
export const getFundingProgress = (project: DevelopmentProject): number => {
  return Math.round((project.tokensSold / project.totalTokens) * 100);
};

// Helper function to get investor tier
export const getInvestorTier = (tokenCount: number, project: DevelopmentProject): 'builder' | 'developer' | 'founder' | null => {
  if (tokenCount >= project.founderTier) return 'founder';
  if (tokenCount >= project.developerTier) return 'developer';
  if (tokenCount >= project.builderTier) return 'builder';
  return null;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

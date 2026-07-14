import { Property, City, EscrowProject } from './types';

const prosperaProperties: Property[] = [
    { 
      id: 'p1', 
      name: '1111 Pearl Court', 
      description: 'Pristine Bay, Roatan', 
      price: 750000, 
      imageUrl: '/images/PB_1111.png', 
      squareMeters: 350, 
      amenities: ['2 Bedrooms', '2.5 Baths', 'Pool & Spa', 'Air Conditioning', 'Washer & Dryer', 'Dishwasher', 'Wireless Internet'], 
      status: 'available',
      galleryImages: ['/images/PB_1111_1.png'],
      detailedDescription: `Beautiful, luxury Villa at in prestigious Pristine Bay, home of the Black Pearl Golf Course, Roatan's only 18 hole golf course.
This two bedroom, 2.5 baths villa has 2 patios, 2 balconies, large patio surrounding a vanishing edge pool and spa. The open floor plan on the lower level containing the living and dining areas is bright and airy and has a warm feeling and invites relaxation. The stylish kitchen with dark hardwood cabinets, stainless steel appliances and granite counter tops is a chef's dream. The 2nd level has two bedrooms each with it's own bath, king sized beds, walk in closet and balcony. Off the living room is a patio with a vanishing edge pool and spa with views of the golf course and ocean.`
    },
    { 
      id: 'p2', 
      name: '1208 Coconut Drive', 
      description: 'Pristine Bay, Roatan', 
      price: 500000, 
      imageUrl: '/images/PB_1208.png', 
      squareMeters: 420, 
      amenities: ['3 Bedrooms', '2 Bathrooms', 'Private Pool', 'Ocean View', 'Near Golf Course'], 
      status: 'available',
      detailedDescription: `Stunning views and your own private pool! At Pristine Bay, French Harbour, Roatan.
Wake up watching the ocean! This home, where tranquility is in the air, has everything you need to relax with the whole family or friends.
Just through the door you will find the first room, then you enter the fully equipped kitchen with breakfast bar and an open concept dining room and living room with sliding glass doors that connect to the panoramic ocean-view and a beautiful terrace with your very own private pool. The second bedroom is located on the hallway with amazing views and access to the pool, a very spacious and full bathroom is across the hall. At the end of the house is the master bedroom, where you can enjoy amazing views from the comfort of your bed, it also has access to the pool and its own ensuite bathroom and a small walking closet.
A truly unique experience, Pristine Bay Roatan is located on a stunning oceanfront property in French Harbour, Roatan Bay Islands, Honduras.`
    },
    { 
      id: 'p3', 
      name: 'Apt 1204', 
      description: 'Diamond Apartments, Roatan', 
      price: 189000, 
      imageUrl: '/images/DIAMOND_APT_1204.png', 
      squareMeters: 180, 
      amenities: ['2 Bedrooms', '2 Bathrooms', 'City View'], 
      status: 'available',
      galleryImages: ['/images/DIAMOND_APT_1204_1.png']
    },
    { 
      id: 'p4', 
      name: 'Apt 703', 
      description: 'Duna Residences, Roatan', 
      price: 178000, 
      imageUrl: '/images/DUNA_RESIDENCE_703.png', 
      squareMeters: 200, 
      amenities: ['3 Bedrooms', '3 Bathrooms', 'Gym'], 
      status: 'available',
      galleryImages: ['/images/DUNA_RESIDENCE_703_1.png']
    },
];

const ipeProperties: Property[] = [
    { 
      id: 'i1', 
      name: 'Rua Dos Mandis', 
      description: 'House with 6 suites, in a gated community in Jurerê Internacional, designed by renowned architect Robson Nascimento.', 
      price: 2506000, 
      imageUrl: '/images/321_RUA_DOS_MANDIS.png', 
      squareMeters: 1034, 
      amenities: ['6 Beds', '8 Baths', 'Pool'], 
      status: 'available',
      galleryImages: ['/images/RUA_DOS_MANDIS_1.png'],
      detailedDescription: `House designed by renowned architect Robson Nascimento, with 6 suites, swimming pool with waterfall, solarium, deck, office, living room, dining room, kitchen, laundry area, balcony, sauna, garage for 8 cars.
Condominium with security and 24-hour patrol, electric fence, synthetic grass football court, tennis court, beach tennis court, children's playground, meditation square, vegetable garden, heated and covered pool with 25m lane, outdoor pool, gym, lounge games room with pool table, card game room and party room for up to 120 people.
Excellent location on one of the most popular beaches on the island.`
    },
    { 
      id: 'i2', 
      name: 'Genova Residenza, Apt 304', 
      description: 'A fully furnished, high-end residence in the heart of Jurere with 3 luxurious suites.', 
      price: 852558, 
      imageUrl: '/images/432_RUA_JORNALISTA.png', 
      squareMeters: 146, 
      amenities: ['3 Suites', 'Heated Flooring', '2 Parking Spaces'], 
      status: 'available',
      detailedDescription: `Discover an exclusive lifestyle in Jurere, Florianopolis Brazils premier beach destination renowned for its pristine coastline, upscale atmosphere, vibrant nightlife, and family-friendly vibe. Jurere is a sophisticated neighbourhood where luxurious living meets natural beauty, offering world-class amenities, gourmet dining, and a relaxed coastal lifestyle. 
This exquisite home combines modern design with ultimate comfort, featuring spacious living and dining areas, a gourmet balcony with BBQ, a modern kitchen, and three luxurious suites with heated flooring. This sophisticated unit provides a seamless blend of style, practicality, and relaxation, making it an ideal primary residence, vacation home, or investment opportunity.`
    },
    { 
      id: 'i3', 
      name: 'Rua Dos Carapanas', 
      description: 'Spectacular 4-suite residence in Bosque Amoraeville, Jurere, with a lush garden and pool.', 
      price: 2537721, 
      imageUrl: '/images/RUA_DOS_CARAPANAS.png', 
      squareMeters: 564, 
      amenities: ['4 en-suite bedrooms', '5 bathrooms', 'Cinema Room'], 
      status: 'available',
      detailedDescription: `Located in one of the most exclusive and desirable areas of Jurere Internacional, it features a unique design that prioritizes cozy and integrated spaces to better welcome friends and family. 
In the social area, there are spacious and integrated living rooms, a gourmet space, and a beautiful garden with a pool, all facing north with a spectacular view of the green area of the forest. 
On the second floor is the intimate area with 4 suites. The master suite has a walk-in closet, a cozy bathtub, and 2 showers, as well as a private balcony with a view of the forest's green area. The other suites also have bathtubs and balconies. On this same floor, for tranquility, there is a home office space and a cinema room. One of the most luxurious and welcoming properties in Jurere Internacional.`,
      galleryImages: [
        '/images/RUA_DOS_CARAPANAS_1.png',
        '/images/RUA_DOS_CARAPANAS_2.png',
        '/images/RUA_DOS_CARAPANAS_3.png',
        '/images/RUA_DOS_CARAPANAS_4.png',
        '/images/RUA_DOS_CARAPANAS_5.png',
        '/images/RUA_DOS_CARAPANAS_6.png',
        '/images/RUA_DOS_CARAPANAS_7.png',
      ]
    },
    { id: 'i4', name: 'Founder Haus', description: 'A modern space for entrepreneurs.', price: 2000000, imageUrl: '/images/FOUNDER_HAUS.png', squareMeters: 250, amenities: ['5 Co-living Pods', 'Communal Kitchen', 'Workspace'], status: 'available' },
];

const elSalvadorProperties: Property[] = [
    { id: 'es2', name: 'Bitcoin Mining Hub', description: 'State-of-the-art bitcoin mining facility...', price: 1500000, imageUrl: '/images/BITCOIN_MINING_HUB.png', squareMeters: 5000, amenities: ['Low Energy Costs', 'High Hash Rate', 'Secure'], status: 'available'  },
    { id: 'es3', name: 'Digital Oasis', description: 'A retreat for the modern tech professional.', price: 750000, imageUrl: '/images/DIGITAL_OASIS.jpg', squareMeters: 300, amenities: ['Fiber Optic Internet', 'Yoga Deck', 'Meditation Garden'], status: 'available' },
    { id: 'es4', name: 'Volcano Residence', description: 'Live on the edge of innovation.', price: 850000, imageUrl: '/images/VOLCANO_RESIDENCE.jpg', squareMeters: 500, amenities: ['Geothermal Heating', 'Obsidian Floors', 'Crater View'], status: 'available' },
    { id: 'es5', name: 'Lake View', description: 'Stunning property with a panoramic view of the lake.', price: 1200000, imageUrl: '/images/BTC_LAKE_VIEW.jpg', squareMeters: 600, amenities: ['Lake Access', 'Private Dock', 'Modern Design'], status: 'available' },
];

const nicaraguaProperties: Property[] = [
    { id: 'n1', name: 'Casitas Aposentillo', description: 'Quaint casitas perfect for a surf getaway...', price: 55000, imageUrl: '/images/CASITAS_APOSENTILLO.png', squareMeters: 60, amenities: ['1 Bedroom', '1 Bathroom', 'Surf Spot'], status: 'available'  },
    { id: 'n2', name: 'El Boom Residence', description: 'Spacious residence with stunning views...', price: 320000, imageUrl: '/images/EL_BOOM_RESIDENCE.png', squareMeters: 250, amenities: ['4 Bedrooms', '3 Bathrooms', 'Ocean View'], status: 'available'  },
    { id: 'n3', name: 'Nomad Homes', description: 'Modern, modular homes for the digital nomad...', price: 35000, imageUrl: '/images/NOMAD_HOMES.png', squareMeters: 100, amenities: ['2 Bedrooms', '2 Bathrooms', 'Coworking Space'], status: 'available'  },
    { id: 'n4', name: 'Casa Amarilla', description: 'A beautiful yellow house by the sea.', price: 100000, imageUrl: '/images/CASA_AMARILLA.png', squareMeters: 180, amenities: ['3 Bedrooms', '2 Bathrooms', 'Beach Access'], status: 'available' },
];

export const cities: City[] = [
    { id: 'prospera', name: 'Prospera', location: 'Roatan, Honduras', imageUrl: '/images/duna-residence.jpg', description: 'A hub for sustainable development and technological innovation.', properties: prosperaProperties },
    { id: 'ipe', name: 'Ipé', location: 'Maceió, Brazil', imageUrl: '/images/ipe-founder-haus.jpg', description: 'A new city for founders and creators on the coast of Brazil.', properties: ipeProperties },
    { id: 'el-salvador', name: 'Bitcoin City', location: 'La Unión, El Salvador', imageUrl: '/images/VOLCANO_RESIDENCE.jpg', description: "The world's first city built on bitcoin, powered by a volcano.", properties: elSalvadorProperties },
    { id: 'nicaragua', name: 'Aposentillo', location: 'Aposentillo, Nicaragua', imageUrl: '/images/ipe-ocean-view.jpg', description: "A surfer's paradise with a growing community of entrepreneurs.", properties: nicaraguaProperties },
];

export const escrowProjects: EscrowProject[] = [
    { id: 'beyabu', name: 'Beyabu', city: 'Prospera', targetAmount: 7500000, currentAmount: 1234567, deadline: new Date('2024-12-31'), status: 'active', imageUrl: '/images/beyabu.avif', description: 'A pioneering project to build a charter city from the ground up, focused on sustainable living and web3 integration.', tokenization: { type: 'fracta', totalTokens: 1000, tokenRepresentation: 'Equity Share', platform: 'Fracta', features: ['DAO Governance', 'Yield Farming'] } },
    { id: 'leaf', name: 'LEAF', city: 'Prospera', targetAmount: 3000000, currentAmount: 500000, deadline: new Date('2025-03-01'), status: 'active', imageUrl: '/images/LEAF.png', description: 'Legal Engineering, Automation, and Forecasting. A project to build the legal and digital infrastructure for next-generation governance.', tokenization: { type: 'citadel', totalTokens: 500, tokenRepresentation: 'Revenue Share', platform: 'Citadel', features: ['Automated Payouts', 'Staking Rewards'] } },
    { id: 'founder-haus', name: 'Founder Haus', city: 'Ipé', targetAmount: 900000, currentAmount: 450000, deadline: new Date('2025-04-20'), status: 'active', imageUrl: '/images/FOUNDER_HAUS.png', description: 'The first co-living and co-working space in the heart of Ipé, designed for founders and builders.', tokenization: { type: 'leaf', totalTokens: 900, tokenRepresentation: 'Community Token', platform: 'Leaf', features: ['Incubator Access', 'Networking Events'] } },
    { id: 'volcano-bonds', name: 'Bitcoin City Volcano Bonds', city: 'Bitcoin City', targetAmount: 1000000000, currentAmount: 250000000, deadline: new Date('2025-12-31'), status: 'active', imageUrl: '/images/BITCOIN_CITY.png', description: 'The official Volcano Bond for funding Bitcoin City. A landmark investment in the future of finance and energy.', tokenization: { type: 'fracta', totalTokens: 10000, tokenRepresentation: 'Bond Certificate', platform: 'Bitfinex Securities', features: ['6.5% APY', 'Backed by Geothermal Power'] } },
]; 
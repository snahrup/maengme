import { Product } from '../types/product';

export const products: Product[] = [
  // OPMS Silver Line Products
  {
    id: 'opms-red-sumatra',
    manufacturer: 'OPMS',
    name: 'Red Sumatra',
    vein: 'red',
    strain: 'Sumatra',
    ingestion: 'capsule',
    image: '/products/OPMSRedSumatraCapsules-All__13491.jpg',
    mitragynine: 1.3,
    expectedOnset: 15,
    expectedPeak: 45,
    expectedDuration: 120,
    commonDoses: {
      threshold: 2,
      light: 4,
      moderate: 6,
      strong: 8
    },
    description: 'Premium red vein from Sumatra highlands. Known for deep relaxation and evening use.',
    effects: ['Relaxation', 'Pain Relief', 'Mood Boost', 'Sedation'],
    warnings: ['May cause drowsiness', 'Start with lower dose']
  },
  {
    id: 'opms-green-borneo',
    manufacturer: 'OPMS',
    name: 'Super Green Borneo',
    vein: 'green',
    strain: 'Borneo',
    ingestion: 'capsule',
    image: '/products/OPMS-Super-Green-Borneo-Capsules-in-3-sizes-by-My-Kratom-Club.jpg',
    mitragynine: 1.5,
    expectedOnset: 10,
    expectedPeak: 35,
    expectedDuration: 90,
    commonDoses: {
      threshold: 2,
      light: 3,
      moderate: 5,
      strong: 7
    },
    description: 'Balanced green vein offering both energy and relaxation. Perfect for daytime use.',
    effects: ['Energy', 'Focus', 'Mood Lift', 'Mild Pain Relief'],
    warnings: ['May increase heart rate', 'Avoid late in day']
  },
  {
    id: 'opms-white-indo',
    manufacturer: 'OPMS',
    name: 'Silver White Indo',
    vein: 'white',
    strain: 'Indo',
    ingestion: 'capsule',
    image: '/products/OPMS-Silver-White-Vein-Indo-Kratom-Capsules__78351.jpg',
    mitragynine: 1.4,
    expectedOnset: 8,
    expectedPeak: 30,
    expectedDuration: 75,
    commonDoses: {
      threshold: 1.5,
      light: 3,
      moderate: 4.5,
      strong: 6
    },
    description: 'Energizing white vein from Indonesia. Excellent for morning productivity.',
    effects: ['Energy', 'Euphoria', 'Focus', 'Productivity'],
    warnings: ['Strong stimulant', 'Start with half dose']
  },
  {
    id: 'opms-green-thai',
    manufacturer: 'OPMS',
    name: 'Silver Green Thai',
    vein: 'green',
    strain: 'Thai',
    ingestion: 'capsule',
    image: '/products/OPMS-Silver-Green-Vein-Thai-Kratom-Capsules__87557.jpg',
    mitragynine: 1.6,
    expectedOnset: 10,
    expectedPeak: 40,
    expectedDuration: 100,
    commonDoses: {
      threshold: 2,
      light: 3.5,
      moderate: 5.5,
      strong: 7.5
    },
    description: 'Classic Thai green vein with long-lasting effects. Great for sustained energy.',
    effects: ['Energy', 'Endurance', 'Mood Enhancement', 'Mental Clarity'],
    warnings: ['Long duration', 'Stay hydrated']
  },
  {
    id: 'opms-green-malay',
    manufacturer: 'OPMS',
    name: 'Silver Green Malay',
    vein: 'green',
    strain: 'Malay',
    ingestion: 'capsule',
    image: '/products/OPMS-Silver-Malay-Kratom-Capsules-Green-Vein__54586.jpg',
    mitragynine: 1.45,
    expectedOnset: 12,
    expectedPeak: 50,
    expectedDuration: 110,
    commonDoses: {
      threshold: 2,
      light: 4,
      moderate: 6,
      strong: 8
    },
    description: 'Super Green Malaysian known for its smooth, long-lasting effects.',
    effects: ['Smooth Energy', 'Focus', 'Mood Stability', 'Social Enhancement'],
    warnings: ['Gradual onset', 'Effects build slowly']
  },
  
  // Mit Therapy Regular Products
  {
    id: 'mit-mixed-maeng-da',
    manufacturer: 'Mit Therapy',
    name: 'Mixed Maeng Da Extract',
    vein: 'mixed',
    strain: 'Maeng Da',
    ingestion: 'capsule',
    image: '/products/Mit-Therapy-Kratom-Extract-Capsules-Mixed-Maeng-Da__39045.jpg',
    mitragynine: 2.1,
    hydroxymitragynine: 0.04,
    expectedOnset: 5,
    expectedPeak: 25,
    expectedDuration: 60,
    commonDoses: {
      threshold: 1,
      light: 2,
      moderate: 3,
      strong: 4
    },
    description: 'Potent extract blend combining red, green, and white Maeng Da strains.',
    effects: ['Strong Relief', 'Euphoria', 'Energy', 'Focus'],
    warnings: ['Very potent', 'Tolerance builds quickly', 'Not for beginners']
  },
  {
    id: 'mit-red-bali-white-elephant',
    manufacturer: 'Mit Therapy',
    name: 'Red Bali & White Elephant Extract',
    vein: 'mixed',
    strain: 'Bali/Elephant',
    ingestion: 'powder',
    image: '/products/Mit-Therapy-Kratom-Extract-Powder-Red-Bali-_-White-Elephant__33988.jpg',
    mitragynine: 2.3,
    hydroxymitragynine: 0.05,
    expectedOnset: 7,
    expectedPeak: 30,
    expectedDuration: 70,
    commonDoses: {
      threshold: 0.5,
      light: 1,
      moderate: 1.5,
      strong: 2
    },
    description: 'Premium extract powder combining relaxing Red Bali with energizing White Elephant.',
    effects: ['Balanced Energy', 'Pain Relief', 'Euphoria', 'Relaxation'],
    warnings: ['Extract powder - very potent', 'Mix with liquid', 'Measure carefully']
  },
  
  // Mit Therapy Onyx Extra Strength Line
  {
    id: 'mit-onyx-white-banda-red-maluku',
    manufacturer: 'Mit Therapy',
    name: 'Onyx White Banda & Red Maluku',
    vein: 'mixed',
    strain: 'Banda/Maluku',
    ingestion: 'capsule',
    image: '/products/Mit-Therapy-Onyx-Kratom-Extra-Strength-Capsules-White-Banda-_-Red-Maluku-set__59162.jpg',
    mitragynine: 1.8,
    hydroxymitragynine: 0.02,
    expectedOnset: 8,
    expectedPeak: 35,
    expectedDuration: 85,
    commonDoses: {
      threshold: 1.5,
      light: 3,
      moderate: 4.5,
      strong: 6
    },
    description: 'Onyx extra strength formula blending rare Indonesian strains for unique effects.',
    effects: ['Unique Euphoria', 'Energy Waves', 'Mood Enhancement', 'Mental Clarity'],
    warnings: ['Extra strength formula', 'Unique alkaloid profile', 'Start low']
  },
  {
    id: 'mit-onyx-super-sumatra-white-mukomuko',
    manufacturer: 'Mit Therapy',
    name: 'Onyx Super Sumatra & White Mukomuko',
    vein: 'mixed',
    strain: 'Sumatra/Mukomuko',
    ingestion: 'capsule',
    image: '/products/Mit-Therapy-Onyx-Kratom-Extra-Strength-Capsules-Super-Sumatra-_-White-Mukomuko-set__84695.jpg',
    mitragynine: 1.9,
    hydroxymitragynine: 0.03,
    expectedOnset: 10,
    expectedPeak: 40,
    expectedDuration: 95,
    commonDoses: {
      threshold: 2,
      light: 3.5,
      moderate: 5,
      strong: 7
    },
    description: 'Onyx premium blend featuring rare Mukomuko white with Super Sumatra for powerful effects.',
    effects: ['Intense Focus', 'Strong Energy', 'Pain Management', 'Motivation'],
    warnings: ['Extra strength', 'May cause jitters', 'Hydrate well']
  }
];

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

// Helper function to filter products
export const filterProducts = (filters: {
  manufacturer?: string;
  vein?: string;
  ingestion?: string;
  search?: string;
}): Product[] => {
  return products.filter(product => {
    if (filters.manufacturer && product.manufacturer !== filters.manufacturer) return false;
    if (filters.vein && product.vein !== filters.vein) return false;
    if (filters.ingestion && product.ingestion !== filters.ingestion) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.manufacturer.toLowerCase().includes(searchLower) ||
        product.strain.toLowerCase().includes(searchLower) ||
        product.vein.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

// Get unique manufacturers
export const getManufacturers = (): string[] => {
  return [...new Set(products.map(p => p.manufacturer))];
};

// Get unique veins
export const getVeins = (): string[] => {
  return [...new Set(products.map(p => p.vein))].filter(Boolean);
};

// Get unique ingestion methods
export const getIngestionMethods = (): string[] => {
  return [...new Set(products.map(p => p.ingestion))];
};

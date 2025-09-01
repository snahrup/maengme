import { Product } from '../types/product';

export const products: Product[] = [
  // OPMS Products
  {
    id: 'opms-red-sumatra',
    manufacturer: 'OPMS',
    name: 'Red Sumatra',
    vein: 'red',
    strain: 'Sumatra',
    ingestion: 'capsule',
    image: '/products/images/OPMSRedSumatraCapsules-All__13491.jpg',
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
    description: 'Premium red vein from Sumatra highlands. Known for relaxation.',
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
    image: '/products/images/OPMS-Super-Green-Borneo-Capsules-in-3-sizes-by-My-Kratom-Club.jpg',
    mitragynine: 1.5,    expectedOnset: 10,
    expectedPeak: 35,
    expectedDuration: 90,
    commonDoses: {
      threshold: 2,
      light: 3,
      moderate: 5,
      strong: 7
    },
    description: 'Balanced green vein with energy and focus benefits.',
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
    image: '/products/images/OPMS-Silver-White-Vein-Indo-Kratom-Capsules__78351.jpg',
    mitragynine: 1.4,
    expectedOnset: 8,
    expectedPeak: 30,
    expectedDuration: 75,
    commonDoses: {
      threshold: 1.5,
      light: 3,
      moderate: 4.5,
      strong: 6
    },    description: 'Energizing white vein with stimulating properties.',
    effects: ['Energy', 'Euphoria', 'Focus', 'Productivity'],
    warnings: ['Strong stimulant', 'Start with half dose']
  },
  
  // Mit Therapy Products
  {
    id: 'mit-mixed-maeng-da',
    manufacturer: 'Mit Therapy',
    name: 'Mixed Maeng Da Extract',
    vein: 'mixed',
    strain: 'Maeng Da',
    ingestion: 'capsule',
    image: '/products/images/Mit-Therapy-Kratom-Extract-Capsules-Mixed-Maeng-Da__39045.jpg',
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
    description: 'Potent extract blend combining multiple Maeng Da strains.',
    effects: ['Strong Relief', 'Euphoria', 'Energy', 'Focus'],
    warnings: ['Very potent', 'Tolerance builds quickly', 'Not for beginners']
  }
];
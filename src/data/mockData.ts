/**
 * Local mock data for the Worker Connect prototype.
 * All names, phone numbers, and records below are FICTIONAL samples
 * for demonstration only — there is no backend in this prototype.
 */

export type IconLib = 'Ionicons' | 'MaterialCommunityIcons';

export type Skill = {
  id: string;
  label: string;
  icon: { lib: IconLib; name: string };
  color: string;
};

export type Worker = {
  id: string;
  name: string;
  skills: string[];
  yearsExperience: number;
  distanceKm: number;
  location: 'Deoghar';
  available: boolean;
  avatarColor: string;
  preferredWork: string;
  phone: string;
  profileComplete: boolean;
  availableToday: string;
};

export type Opportunity = {
  id: string;
  factory: string;
  role: string;
  skillId: string;
  distanceKm: number;
  hiring: boolean;
};

export const skills: Skill[] = [
  { id: 'sewing', label: 'Sewing', icon: { lib: 'MaterialCommunityIcons', name: 'needle' }, color: '#176B87' },
  { id: 'cutting', label: 'Cutting', icon: { lib: 'MaterialCommunityIcons', name: 'content-cut' }, color: '#D97745' },
  { id: 'dyeing', label: 'Dyeing', icon: { lib: 'MaterialCommunityIcons', name: 'palette' }, color: '#12344D' },
  { id: 'embroidery', label: 'Embroidery', icon: { lib: 'MaterialCommunityIcons', name: 'flower' }, color: '#C95757' },
  { id: 'machine', label: 'Machine Operator', icon: { lib: 'MaterialCommunityIcons', name: 'cog' }, color: '#124F63' },
  { id: 'packing', label: 'Packing', icon: { lib: 'MaterialCommunityIcons', name: 'package-variant-closed' }, color: '#2F8F5B' },
  { id: 'quality', label: 'Quality Check', icon: { lib: 'MaterialCommunityIcons', name: 'check-decagram' }, color: '#D89A35' },
  { id: 'ironing', label: 'Ironing', icon: { lib: 'MaterialCommunityIcons', name: 'iron' }, color: '#176B87' },
  { id: 'finishing', label: 'Finishing', icon: { lib: 'Ionicons', name: 'sparkles' }, color: '#D97745' },
];

export const workers: Worker[] = [
  {
    id: 'w1',
    name: 'Ravi Kumar',
    skills: ['sewing', 'machine'],
    yearsExperience: 5,
    distanceKm: 2.4,
    location: 'Deoghar',
    available: true,
    avatarColor: '#176B87',
    preferredWork: 'Full time',
    phone: '+91 98765 43210',
    profileComplete: true,
    availableToday: 'Today',
  },
  {
    id: 'w2',
    name: 'Suresh Yadav',
    skills: ['cutting', 'finishing'],
    yearsExperience: 8,
    distanceKm: 3.1,
    location: 'Deoghar',
    available: false,
    avatarColor: '#D97745',
    preferredWork: 'Day shift',
    phone: '+91 98765 43211',
    profileComplete: true,
    availableToday: 'From Monday',
  },
  {
    id: 'w3',
    name: 'Pooja Devi',
    skills: ['embroidery', 'quality'],
    yearsExperience: 4,
    distanceKm: 1.8,
    location: 'Deoghar',
    available: true,
    avatarColor: '#2F8F5B',
    preferredWork: 'Part time',
    phone: '+91 98765 43212',
    profileComplete: false,
    availableToday: 'Today',
  },
  {
    id: 'w4',
    name: 'Mohan Das',
    skills: ['dyeing', 'machine'],
    yearsExperience: 12,
    distanceKm: 5.2,
    location: 'Deoghar',
    available: false,
    avatarColor: '#12344D',
    preferredWork: 'Full time',
    phone: '+91 98765 43213',
    profileComplete: true,
    availableToday: 'Next week',
  },
  {
    id: 'w5',
    name: 'Sunita Kumari',
    skills: ['sewing', 'packing'],
    yearsExperience: 3,
    distanceKm: 2.9,
    location: 'Deoghar',
    available: true,
    avatarColor: '#D89A35',
    preferredWork: 'Day shift',
    phone: '+91 98765 43214',
    profileComplete: true,
    availableToday: 'Today',
  },
  {
    id: 'w6',
    name: 'Arjun Kumar',
    skills: ['packing', 'ironing'],
    yearsExperience: 6,
    distanceKm: 4.1,
    location: 'Deoghar',
    available: true,
    avatarColor: '#124F63',
    preferredWork: 'Night shift',
    phone: '+91 98765 43215',
    profileComplete: false,
    availableToday: 'Tomorrow',
  },
];

export const opportunities: Opportunity[] = [
  { id: 'o1', factory: 'Sapphire Textiles', role: 'Sewing Operator', skillId: 'sewing', distanceKm: 2.4, hiring: true },
  { id: 'o2', factory: 'Nirman Garments', role: 'Cutting Operator', skillId: 'cutting', distanceKm: 4.1, hiring: true },
  { id: 'o3', factory: 'Shakti Fabrics', role: 'Quality Check', skillId: 'quality', distanceKm: 3.6, hiring: false },
];

export const languages = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'kn', label: 'ಕನ್ನಡ' },
] as const;

export const SAMPLE_DATA_NOTE = 'Sample data for demonstration.';

export const skillById = (id: string): Skill | undefined => skills.find((s) => s.id === id);

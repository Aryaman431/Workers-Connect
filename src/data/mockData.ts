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
  location: string;
  skillIds: string[];
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'month' | 'day';
  employmentType: string;
  experience: string;
  workingHours: string;
  shift: string;
  shiftName: string;
  vacancies: number;
  postedAgo: string;
  description: string;
  responsibilities: string[];
  contact: { name: string; role: string; phone: string };
};

export const skills: Skill[] = [
  { id: 'sewing', label: 'Sewing', icon: { lib: 'MaterialCommunityIcons', name: 'needle' }, color: '#1A6478' },
  { id: 'cutting', label: 'Cutting', icon: { lib: 'MaterialCommunityIcons', name: 'content-cut' }, color: '#C06B3E' },
  { id: 'dyeing', label: 'Dyeing', icon: { lib: 'MaterialCommunityIcons', name: 'palette' }, color: '#1D3547' },
  { id: 'embroidery', label: 'Embroidery', icon: { lib: 'MaterialCommunityIcons', name: 'flower' }, color: '#B04A42' },
  { id: 'machine', label: 'Machine Operator', icon: { lib: 'MaterialCommunityIcons', name: 'cog' }, color: '#11495A' },
  { id: 'packing', label: 'Packing', icon: { lib: 'MaterialCommunityIcons', name: 'package-variant-closed' }, color: '#3E7C57' },
  { id: 'quality', label: 'Quality Check', icon: { lib: 'MaterialCommunityIcons', name: 'check-decagram' }, color: '#B9862F' },
  { id: 'ironing', label: 'Ironing', icon: { lib: 'MaterialCommunityIcons', name: 'iron' }, color: '#1A6478' },
  { id: 'finishing', label: 'Finishing', icon: { lib: 'Ionicons', name: 'sparkles' }, color: '#C06B3E' },
  { id: 'fabric', label: 'Fabric Handling', icon: { lib: 'MaterialCommunityIcons', name: 'tshirt' }, color: '#55808F' },
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
    avatarColor: '#1A6478',
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
    avatarColor: '#C06B3E',
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
    avatarColor: '#3E7C57',
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
    avatarColor: '#1D3547',
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
    avatarColor: '#B9862F',
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
    avatarColor: '#11495A',
    preferredWork: 'Night shift',
    phone: '+91 98765 43215',
    profileComplete: false,
    availableToday: 'Tomorrow',
  },
];

export const opportunities: Opportunity[] = [
  {
    id: 'o1',
    factory: 'Sapphire Textiles',
    role: 'Sewing Operator',
    skillId: 'sewing',
    distanceKm: 2.4,
    hiring: true,
    location: 'Deoghar, Jharkhand',
    skillIds: ['sewing', 'machine', 'quality'],
    salaryMin: 13000,
    salaryMax: 17000,
    salaryPeriod: 'month',
    employmentType: 'Full time',
    experience: '1+ year',
    workingHours: '8 hours a day',
    shift: '9:00 AM – 6:00 PM',
    shiftName: 'Day shift',
    vacancies: 12,
    postedAgo: '1 day ago',
    description:
      'Sapphire Textiles runs three stitching lines for cotton kurtis and is adding a fourth line this season. Work is steady, paid monthly, with overtime available on Saturdays.',
    responsibilities: [
      'Operate a single-needle lockstitch machine on assigned panels',
      'Check seam quality against the sample before passing pieces on',
      'Meet a daily target of 140 pieces while keeping wastage low',
      'Report machine faults to the line supervisor immediately',
    ],
    contact: { name: 'Rajesh Kumar', role: 'Production Supervisor', phone: '+91 98765 43210' },
  },
  {
    id: 'o2',
    factory: 'Nirman Garments',
    role: 'Cutting Operator',
    skillId: 'cutting',
    distanceKm: 4.1,
    hiring: true,
    location: 'Deoghar, Jharkhand',
    skillIds: ['cutting', 'finishing', 'fabric'],
    salaryMin: 15000,
    salaryMax: 19000,
    salaryPeriod: 'month',
    employmentType: 'Full time',
    experience: '2+ years',
    workingHours: '8 hours a day',
    shift: '8:00 AM – 5:00 PM',
    shiftName: 'Day shift',
    vacancies: 5,
    postedAgo: '3 days ago',
    description:
      'Nirman Garments cuts denim and twill orders for export. The cutting floor works in pairs on automated spreaders, with a steady order book through the year.',
    responsibilities: [
      'Set up lays and mark patterns according to the cutting order',
      'Operate the straight-knife and band-saw cutting machines',
      'Verify ply count and shade grouping before every bundle',
      'Bundle, tag, and move cut pieces to the stitching floor',
    ],
    contact: { name: 'Vikram Singh', role: 'Cutting Floor In-charge', phone: '+91 98765 43217' },
  },
  {
    id: 'o3',
    factory: 'Shakti Fabrics',
    role: 'Quality Check',
    skillId: 'quality',
    distanceKm: 3.6,
    hiring: false,
    location: 'Deoghar, Jharkhand',
    skillIds: ['quality', 'finishing'],
    salaryMin: 12000,
    salaryMax: 15000,
    salaryPeriod: 'month',
    employmentType: 'Part time',
    experience: '1+ year',
    workingHours: '6 hours a day',
    shift: '10:00 AM – 4:00 PM',
    shiftName: 'Day shift',
    vacancies: 3,
    postedAgo: '5 days ago',
    description:
      'Shakti Fabrics inspects finished garments before packing. Shifts are short and suited to candidates who want part-time work close to home.',
    responsibilities: [
      'Inspect finished garments for stitching, shade, and measurement defects',
      'Mark defects and route pieces back to the finishing team',
      'Record daily inspection counts on the quality sheet',
      'Flag recurring defects to the quality supervisor',
    ],
    contact: { name: 'Meena Devi', role: 'Quality Manager', phone: '+91 98765 43218' },
  },
  {
    id: 'o4',
    factory: 'Niranjan Textiles',
    role: 'Textile Machine Operator',
    skillId: 'machine',
    distanceKm: 2.4,
    hiring: true,
    location: 'Deoghar, Jharkhand',
    skillIds: ['machine', 'quality', 'fabric'],
    salaryMin: 14000,
    salaryMax: 18000,
    salaryPeriod: 'month',
    employmentType: 'Full time',
    experience: '1+ year',
    workingHours: '8 hours a day',
    shift: '8:00 AM – 5:00 PM',
    shiftName: 'Day shift',
    vacancies: 8,
    postedAgo: '2 days ago',
    description:
      'Niranjan Textiles is hiring machine operators for its ring-spinning and winding section. Training on the specific machine model is provided in the first week.',
    responsibilities: [
      'Start, monitor, and stop spinning and winding machines on schedule',
      'Join broken ends and clear yarn faults during rounds',
      'Complete the hourly production and downtime log',
      'Keep the machine bay clean and report unusual noise or vibration',
    ],
    contact: { name: 'Rajesh Kumar', role: 'Production Supervisor', phone: '+91 98765 43216' },
  },
];

export const languages = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'kn', label: 'ಕನ್ನಡ' },
] as const;

export const SAMPLE_DATA_NOTE = 'Sample data for demonstration.';

export const skillById = (id: string): Skill | undefined => skills.find((s) => s.id === id);

export const jobById = (id: string): Opportunity | undefined => opportunities.find((o) => o.id === id);

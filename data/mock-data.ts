export type CallerProfile = {
  phoneNumber: string;
  name: string;
  location: string;
  spam: boolean;
  confidence: number;
  spamScore: number;
  callerType: 'Business' | 'Personal' | 'Unknown';
  verified: boolean;
  matchStrategy: 'verified_profile' | 'known_profile' | 'crowd_consensus' | 'unknown';
  sources: string[];
  notes: string;
};

export const callerDirectory: CallerProfile[] = [
  {
    phoneNumber: '+2348030001111',
    name: 'Kora Logistics',
    location: 'Victoria Island, Lagos',
    spam: false,
    confidence: 92,
    spamScore: 18,
    callerType: 'Business',
    verified: true,
    matchStrategy: 'verified_profile',
    sources: ['Curated business profile', 'Verified business metadata', 'Past answered calls'],
    notes: 'Verified operations line for dispatch and parcel confirmations.',
  },
  {
    phoneNumber: '+2348091234567',
    name: 'Chiamaka Okafor',
    location: 'Gwarinpa, FCT',
    spam: false,
    confidence: 86,
    spamScore: 4,
    callerType: 'Personal',
    verified: false,
    matchStrategy: 'known_profile',
    sources: ['Contact consensus from 2 contributors', 'Regional hint from shared metadata'],
    notes: 'Crowdsourced personal identity with stable naming across uploads.',
  },
  {
    phoneNumber: '+2347011112222',
    name: 'QuickCash Loans',
    location: 'Ikeja, Lagos',
    spam: true,
    confidence: 79,
    spamScore: 72,
    callerType: 'Business',
    verified: false,
    matchStrategy: 'known_profile',
    sources: ['Caller profile', '2 spam reports', 'Repeat loan spam pattern'],
    notes: 'High spam pressure from repeated telemarketing and loan collection reports.',
  },
  {
    phoneNumber: '+2348112223334',
    name: 'Tolu Dental Clinic',
    location: 'Lagos',
    spam: false,
    confidence: 61,
    spamScore: 12,
    callerType: 'Business',
    verified: false,
    matchStrategy: 'crowd_consensus',
    sources: ['2 contact contributions', 'Location consensus at state level'],
    notes: 'Name chosen from community consensus because the city-level hint conflicts.',
  },
];

export const homeMetrics = [
  { label: 'Lookups today', value: '1,248' },
  { label: 'Spam blocked', value: '326' },
  { label: 'Avg response', value: '412ms' },
];

export const recentLookups = [
  callerDirectory[0],
  callerDirectory[2],
  callerDirectory[1],
  callerDirectory[3],
];

export const spamReasons = [
  { title: 'Scam or fraud', detail: 'For impersonation, urgent money requests, and deceptive links.' },
  { title: 'Loan spam', detail: 'For recovery threats, unsolicited offers, and repeat dial patterns.' },
  { title: 'Harassment', detail: 'For abusive language, intimidation, or repeated nuisance calls.' },
  { title: 'Telemarketing', detail: 'For promotion-heavy calls without prior consent.' },
];

export const privacyControls = [
  'Upload contacts only after explicit consent.',
  'Store names and phone numbers, never exact home addresses.',
  'Allow users to delete contributed data from their account.',
  'Expose city or state only when confidence is strong enough.',
];

export const settingsChecklist = [
  { label: 'Call overlay permission', value: 'Pending' },
  { label: 'Contacts contribution', value: 'Optional' },
  { label: 'Default lookup backend', value: 'FastAPI + Supabase' },
  { label: 'Region launch', value: 'Nigeria' },
];

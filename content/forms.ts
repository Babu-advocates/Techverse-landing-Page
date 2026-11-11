export type CurrencyCode = 'INR' | 'USD';

export type CountryCodeItem = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
};

export const countryCodes: CountryCodeItem[] = [
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', minLength: 10, maxLength: 11 },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10 },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9 },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', minLength: 8, maxLength: 8 },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', minLength: 9, maxLength: 9 },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', minLength: 8, maxLength: 8 },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', minLength: 8, maxLength: 8 },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', minLength: 8, maxLength: 8 },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', minLength: 8, maxLength: 8 },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', minLength: 9, maxLength: 10 },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', minLength: 9, maxLength: 10 },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', minLength: 9, maxLength: 9 },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', minLength: 9, maxLength: 9 },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', minLength: 9, maxLength: 9 },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', minLength: 9, maxLength: 9 },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', minLength: 9, maxLength: 10 },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', minLength: 8, maxLength: 8 },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', minLength: 8, maxLength: 8 },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮', minLength: 9, maxLength: 10 },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', minLength: 9, maxLength: 10 },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', minLength: 9, maxLength: 12 },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', minLength: 10, maxLength: 10 },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', minLength: 9, maxLength: 9 },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', minLength: 9, maxLength: 10 },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', minLength: 10, maxLength: 10 },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', minLength: 9, maxLength: 9 },
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵', minLength: 10, maxLength: 10 },
];

export const serviceOptions = [
  {
    group: 'SOFTWARE & TECHNOLOGY',
    items: [
      'Custom Software Development',
      'ERP & Business Management Systems',
      'Mobile Application Development',
      'AI Development & Automation',
      'Other Software Requirements',
    ],
  },
  {
    group: 'AI DATA SERVICES',
    items: [
      'Data Annotation',
      'Data Labelling',
      'Image & Video Annotation',
      'AI Training Data',
      'Data Collection',
      'Data Entry & Processing',
      'Data Quality Assurance',
      'Other Data Services',
    ],
  },
] as const;

export const timelineOptions = [
  'As soon as possible',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Not sure yet',
];

export const budgetOptionsByCurrency: Record<CurrencyCode, string[]> = {
  INR: [
    'Prefer not to say',
    'Under ₹2,50,000',
    '₹2,50,000 – ₹5,00,000',
    '₹5,00,000 – ₹15,00,000',
    '₹15,00,000 – ₹30,00,000',
    '₹30,00,000+',
    'To be discussed',
  ],
  USD: [
    'Prefer not to say',
    'Under $5,000',
    '$5,000 – $15,000',
    '$15,000 – $30,000',
    '$30,000 – $50,000',
    '$50,000+',
    'To be discussed',
  ],
};

export const budgetOptions = budgetOptionsByCurrency.INR;

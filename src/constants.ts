import { CampaignConfig, SharedPost, ConferencePhoto, AttendeeProfile } from './types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEA_eMuvB2WCeYEuLMXihYhDP26WPeBNMQ8cCaBHIIZLiH-R5n2HsKICn5LE5WF9JpqqxL97cfTSAv25eBLm0bKh5SP3iFXgbyPrgdF4OgmIGOmoBUgAbbf9tUf6X2A1MgT3me70RieZEjV5lm0dOPDxwH57SVrRfpiWkTHra9Pt2-R6ymOvSeKEdnXDQPzCV-wgCAPTugr5nqyZiwtYQX7WtvxfBRrcqec1ULrxZv5thiTNuEzXE',
  elenaAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAngJV_7Fj2tzvInCCVNF8KIg3759_euPcCXoC9o8onxl4s7RNfyzC68FesSxXflsncxhIc7BSzfMb1ww7zLG_czGM2fsln5awLF-YljhKnlwLSFAYe5wMlUyPtYxdJkzqSM0IaUR_xaqxQVqLdLLaTJO1jVkLOmKm1Qr3NIrEG_gu9pMmI-nf-qMj43cfKcbIBiYdciWSxY0840QMJF-E5VyKe5kduUWCEuR26NhNj8ZWxHZDFfc',
  stagePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvcmgNlyfNHtdrhOuhdut-jdUkjrLDSwyhZvF-8MDYyH5S9HEUXDt0IAxGnpfVfIqpL30nHyl89tK7_uTaep-Y_IleqWF93bZnIltUDptnEeaFMiat7GbN5qwuDxb534VuO1kTVwYLkgIvoHBYJAA8mYHkEOEl-q-pCA8El1q8ruh7E_Vc9Ruk664a8jbpAGl45vDGF1AO-SWiLGqG2T9bc_x8c_q4xnQSp0BsYVp3S6VDxg3brPU',
};

export const DEFAULT_CAMPAIGN: CampaignConfig = {
  id: 'TN-2025-V2',
  name: 'TechNova Global Summit 2025',
  format: 'hybrid',
  dates: 'Oct 14-16, 2025',
  location: 'San Francisco, CA & Virtual',
  organizerName: 'TechNova Media & Ventures Group',
  isOrganizerVerified: true,
  hashtags: ['#TechNova2025', '#AIFuture', '#TechSummit'],
  socialLinks: {
    linkedin: 'linkedin.com/company/technova-global',
    twitter: '@TechNovaHQ',
    website: 'https://summit.technova.io',
  },
  generatorSlug: 'https://eventpulse.ai/p/technova-2025',
  isPublicAccess: true,
  bannerImage: ASSETS.stagePhoto,
  stats: {
    postsCreated: 1280,
    postsGrowth: '+24%',
    reachCount: '482.5K',
    reachNumeric: 482500,
    vipCount: '48 / 52',
    viralRate: '6.8%',
  },
};

export const DEFAULT_PROFILE: AttendeeProfile = {
  name: 'Elena Rostova',
  headline: 'Head of AI Strategy at Synapse Labs | Ex-Founding Engineer',
  avatarUrl: ASSETS.elenaAvatar,
  connectionDegree: '1st',
};

export const DEFAULT_PHOTOS: ConferencePhoto[] = [
  {
    id: 'stage-1',
    url: ASSETS.stagePhoto,
    label: 'Main Stage Keynote',
    caption: 'TechNova 2025 Main Stage • San Francisco',
    isDefault: true,
  },
  {
    id: 'workshop-1',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    label: 'AI Workshop Hall',
    caption: 'Agentic Infrastructure Deep-Dive • Room 304',
  },
  {
    id: 'networking-1',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    label: 'VIP Networking Lounge',
    caption: 'Executive Roundtable & Summit Mixer',
  },
];

export const INITIAL_POSTS: SharedPost[] = [
  {
    id: 'post-1',
    authorName: 'Sarah Lin',
    authorRole: 'Principal AI Architect',
    authorCompany: 'CloudScale',
    authorInitials: 'SL',
    timeAgo: '4m ago',
    timestamp: '2026-09-27T10:21:00Z',
    content: '“Excited to be speaking at #TechNova2025 this afternoon on Distributed Neural Pipelines. What a turnout! Looking forward to networking with fellow founders and engineers.”',
    reactions: 142,
    comments: 19,
    reposts: 5,
    postUrl: 'https://www.linkedin.com',
    tone: 'speaker',
  },
  {
    id: 'post-2',
    authorName: 'David Ross',
    authorRole: 'VP of Engineering',
    authorCompany: 'NextGen AI',
    authorInitials: 'DR',
    timeAgo: '12m ago',
    timestamp: '2026-09-27T10:13:00Z',
    content: '“Incredible keynote kick-off at #TechNova2025. Key takeaway: agentic workflows are maturing faster than projected. Kudos to the organizers for an exceptional agenda.”',
    reactions: 89,
    comments: 8,
    reposts: 3,
    postUrl: 'https://www.linkedin.com',
    tone: 'takeaways',
  },
  {
    id: 'post-3',
    authorName: 'Marcus Vance',
    authorRole: 'Director of Product',
    authorCompany: 'Aura Data',
    authorInitials: 'MV',
    timeAgo: '28m ago',
    timestamp: '2026-09-27T09:57:00Z',
    content: '“Day 2 of #TechNova2025 is already setting new standards. The enterprise focus on privacy-first LLM orchestrations is exactly what our industry needed.”',
    reactions: 114,
    comments: 14,
    reposts: 6,
    postUrl: 'https://www.linkedin.com',
    tone: 'professional',
  },
];

export const QUICK_ADD_OPTIONS = [
  {
    label: 'Speaker Quote',
    text: ' "The future belongs to agentic systems." - Keynote Quote',
  },
  {
    label: 'Networking',
    text: ' Great reconnecting with peers from San Francisco and beyond.',
  },
  {
    label: 'Future Outlook',
    text: ' Excited to implement these architecture patterns in Q3.',
  },
  {
    label: 'Grateful to Organizers',
    text: ' Immensely grateful to @TechNovaHQ for this stellar symposium.',
  },
];

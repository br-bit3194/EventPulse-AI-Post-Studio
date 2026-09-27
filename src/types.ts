export type TabType = 'organizer' | 'attendee' | 'analytics';

export type ToneType = 'professional' | 'grateful' | 'takeaways' | 'speaker';

export interface CampaignConfig {
  id: string;
  name: string;
  format: 'hybrid' | 'in-person' | 'virtual';
  dates: string;
  location: string;
  organizerName: string;
  isOrganizerVerified: boolean;
  hashtags: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    website: string;
  };
  generatorSlug: string;
  isPublicAccess: boolean;
  bannerImage: string;
  stats: {
    postsCreated: number;
    postsGrowth: string;
    reachCount: string;
    reachNumeric: number;
    vipCount: string;
    viralRate: string;
  };
}

export interface AttendeeProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  connectionDegree: string;
}

export interface SharedPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorInitials: string;
  authorAvatar?: string;
  timestamp: string;
  timeAgo: string;
  content: string;
  reactions: number;
  comments: number;
  reposts: number;
  postUrl?: string;
  tone?: string;
}

export interface ConferencePhoto {
  id: string;
  url: string;
  label: string;
  caption: string;
  isDefault?: boolean;
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  tone: ToneType;
  scheduledTime: string;
  scheduledSlotLabel: string;
  photoUrl?: string;
  photoCaption?: string;
  status: 'queued' | 'published';
  createdAt: string;
  notes?: string;
}

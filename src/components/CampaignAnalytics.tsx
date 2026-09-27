import React, { useState } from 'react';
import { CampaignConfig, SharedPost } from '../types';

interface HeatmapCellData {
  posts: number;
  engagementRate: number;
  reach: number;
  sessionTitle: string;
  tagline: string;
  recommendation: string;
  isKeynote?: boolean;
}

const HEATMAP_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const HEATMAP_DAYS = [
  { id: 'day1', name: 'Day 1 (Tue)', date: 'Oct 14' },
  { id: 'day2', name: 'Day 2 (Wed)', date: 'Oct 15' },
  { id: 'day3', name: 'Day 3 (Thu)', date: 'Oct 16' },
];

const HEATMAP_DATA: HeatmapCellData[][] = [
  // Day 1
  [
    { posts: 24, engagementRate: 4.2, reach: 9500, sessionTitle: 'Registration & Welcome Coffee', tagline: 'Early Arrivals Check-in', recommendation: 'Good for introductory logistics posts and badge selfies.' },
    { posts: 168, engagementRate: 8.8, reach: 64200, sessionTitle: 'Opening Keynote: The AI Frontier', tagline: 'Major Summit Kickoff', recommendation: 'High engagement! Quote the keynote speaker within 15 minutes of concluding.', isKeynote: true },
    { posts: 194, engagementRate: 9.2, reach: 72800, sessionTitle: 'Keynote Q&A & Architecture Spotlight', tagline: 'Prime Viral Window', recommendation: 'Peak feed traction. Share 3 concrete takeaways with #TechNova2025.', isKeynote: true },
    { posts: 88, engagementRate: 6.4, reach: 34000, sessionTitle: 'Track 1: Models into Production', tagline: 'Deep Technical Track', recommendation: 'Include technical code screenshots or diagram photos for highest developer shares.' },
    { posts: 142, engagementRate: 7.6, reach: 52400, sessionTitle: 'Executive Networking Luncheon', tagline: 'Midday Networking Spike', recommendation: 'Optimal time for selfie posts tagging table peers and new connections.' },
    { posts: 76, engagementRate: 5.8, reach: 28100, sessionTitle: 'Technical Hands-on Labs', tagline: 'Interactive Workshops', recommendation: 'Focus on tools and architecture takeaways.' },
    { posts: 95, engagementRate: 6.2, reach: 36500, sessionTitle: 'Panel: Enterprise Cloud Security', tagline: 'Executive Roundtable', recommendation: 'Summarize contradictory panel viewpoints to trigger LinkedIn discussion threads.' },
    { posts: 132, engagementRate: 7.4, reach: 49000, sessionTitle: 'Coffee Break & Partner Showcase', tagline: 'Afternoon Energy Boost', recommendation: 'Highlight sponsor demos and startup innovations.' },
    { posts: 110, engagementRate: 6.9, reach: 41200, sessionTitle: 'Fireside Chat: Future of Compute', tagline: 'Thought Leadership', recommendation: 'Tag speakers directly to earn quick reposts from verified profiles.' },
    { posts: 185, engagementRate: 8.4, reach: 68900, sessionTitle: 'Day 1 Wrap & Cocktail Mixer', tagline: 'Evening Celebration Spike', recommendation: 'Great timing for grateful attendee posts acknowledging host hospitality.' },
    { posts: 124, engagementRate: 7.1, reach: 46500, sessionTitle: 'VIP Dinner & Community Circles', tagline: 'Intimate Roundtables', recommendation: 'Evening reflections receive high European and Asian timezone reach overnight.' },
    { posts: 42, engagementRate: 5.0, reach: 16200, sessionTitle: 'Summit Evening Socials', tagline: 'Informal Networking', recommendation: 'Casual wrap-up posts.' },
  ],
  // Day 2
  [
    { posts: 36, engagementRate: 4.8, reach: 13800, sessionTitle: 'Morning Coffee & Meetups', tagline: 'Day 2 Gathering', recommendation: 'Share excitement for day 2 tracks.' },
    { posts: 218, engagementRate: 9.6, reach: 82400, sessionTitle: 'Keynote #2: Agentic Orchestration Systems', tagline: 'Flagship Event Milestone', recommendation: 'Absolute peak attention. Tag @DavidChen and key quotes for 3.4x algorithmic multiplier.', isKeynote: true },
    { posts: 242, engagementRate: 9.9, reach: 94500, sessionTitle: 'Agentic Demo & Live Code Showcase', tagline: 'Highest Viral Momentum of Summit', recommendation: 'Top viral window. Key Takeaways bulleted format yields 2.1x more comments.', isKeynote: true },
    { posts: 120, engagementRate: 7.0, reach: 45800, sessionTitle: 'Vector Database & Retrieval Track', tagline: 'Specialized Engineering', recommendation: 'Share benchmark results and enterprise latency stats.' },
    { posts: 165, engagementRate: 8.1, reach: 62000, sessionTitle: 'Founders & Investors Networking Mixer', tagline: 'Dealmaking & Connections', recommendation: 'Tag co-founders and ecosystem partners.' },
    { posts: 89, engagementRate: 6.1, reach: 33200, sessionTitle: 'Hands-on Labs: Distributed Pipelines', tagline: 'Workshop Hall', recommendation: 'Focus on developer tooling highlights.' },
    { posts: 114, engagementRate: 6.8, reach: 42600, sessionTitle: 'Panel: Scale-to-Zero Architectures', tagline: 'Infrastructure Leadership', recommendation: 'Highlight operational cost-saving takeaways.' },
    { posts: 146, engagementRate: 7.8, reach: 55400, sessionTitle: 'Innovation Pitch Fest & Demo Stage', tagline: 'High Energy Pitches', recommendation: 'Support startup founders with shoutouts and applause.' },
    { posts: 138, engagementRate: 7.5, reach: 51800, sessionTitle: 'AI Product Leaders Forum', tagline: 'Product Strategy Track', recommendation: 'Post strategic frameworks and adoption roadmaps.' },
    { posts: 204, engagementRate: 9.1, reach: 79200, sessionTitle: 'Hackathon Awards & Evening Summit Gala', tagline: 'Prime Celebration Peak', recommendation: 'Massive celebration spike. Photo of stage award ceremony drives wide viral shares.' },
    { posts: 152, engagementRate: 7.9, reach: 58100, sessionTitle: 'Summit Gala Mixer & Celebrations', tagline: 'Community Celebration', recommendation: 'High photo engagement on attendee feeds.' },
    { posts: 58, engagementRate: 5.4, reach: 21000, sessionTitle: 'Late Night Networking Lounge', tagline: 'Nightcap Connections', recommendation: 'Closing reflections.' },
  ],
  // Day 3
  [
    { posts: 28, engagementRate: 4.4, reach: 10500, sessionTitle: 'Day 3 Opening Coffee & Breakfast', tagline: 'Final Day Kickoff', recommendation: 'Reflect on summit relationships built so far.' },
    { posts: 186, engagementRate: 8.9, reach: 70200, sessionTitle: 'Keynote #3: Autonomous Future Roadmap', tagline: 'Visionary Closing Track', recommendation: 'Strong long-term outlook takeaways receive high save and repost rates.', isKeynote: true },
    { posts: 205, engagementRate: 9.4, reach: 78600, sessionTitle: 'Closing Keynote & Global Tech Awards', tagline: 'Summit Climax', recommendation: 'Post official gratitude to organizers and tag host company.', isKeynote: true },
    { posts: 145, engagementRate: 7.8, reach: 54900, sessionTitle: 'Best-of-Summit Showcase', tagline: 'Recap Highlights', recommendation: 'Summarize top 3 moments of the entire conference.' },
    { posts: 172, engagementRate: 8.3, reach: 65400, sessionTitle: 'Farewell Networking Brunch', tagline: 'Final Connections Mixer', recommendation: 'Encourage attendees to connect on LinkedIn via comments.' },
    { posts: 118, engagementRate: 7.2, reach: 44200, sessionTitle: 'Open Source Community Collaborations', tagline: 'Working Groups', recommendation: 'Link GitHub repos or community working group links.' },
    { posts: 98, engagementRate: 6.5, reach: 37100, sessionTitle: 'Summit Video Interviews & Debriefs', tagline: 'Media Lounge', recommendation: 'Share video clips and personal interview quotes.' },
    { posts: 84, engagementRate: 6.0, reach: 31500, sessionTitle: 'Expo Hall Final Hours', tagline: 'Closing Booths', recommendation: 'Thank exhibitors and sponsor booths.' },
    { posts: 126, engagementRate: 7.4, reach: 47800, sessionTitle: 'Organizers Thank-You Reception', tagline: 'Gratitude Wave', recommendation: 'Tag entire organizing committee and volunteer staff.' },
    { posts: 150, engagementRate: 8.2, reach: 57000, sessionTitle: 'Summit Departure & Trip Recaps', tagline: 'Post-Event Reflections', recommendation: 'Comprehensive "My Experience at TechNova 2025" roundup posts.' },
    { posts: 92, engagementRate: 6.7, reach: 35200, sessionTitle: 'Airport & Transit Networking', tagline: 'Travel Debriefs', recommendation: 'Keep the momentum going on the flight home.' },
    { posts: 38, engagementRate: 4.9, reach: 14200, sessionTitle: 'Post-Summit Digital Community', tagline: 'Online Channels', recommendation: 'Join alumni group.' },
  ],
];

interface CampaignAnalyticsProps {
  campaign: CampaignConfig;
  sharedPosts: SharedPost[];
  onExportCsv: () => void;
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  campaign,
  sharedPosts,
  onExportCsv,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '3d' | 'all'>('3d');
  const [heatmapMetric, setHeatmapMetric] = useState<'posts' | 'engagement' | 'reach'>('posts');
  const [selectedCell, setSelectedCell] = useState<{
    dayIndex: number;
    hourIndex: number;
    data: HeatmapCellData;
  } | null>({
    dayIndex: 1,
    hourIndex: 2,
    data: HEATMAP_DATA[1][2],
  });

  const getHeatmapCell = (dayIndex: number, hourIndex: number): HeatmapCellData => {
    return HEATMAP_DATA[dayIndex]?.[hourIndex] || {
      posts: 50,
      engagementRate: 6.0,
      reach: 20000,
      sessionTitle: 'Summit Session',
      tagline: 'Conference Program',
      recommendation: 'Good opportunity to post takeaways.',
    };
  };

  const getCellColor = (data: HeatmapCellData, metric: 'posts' | 'engagement' | 'reach'): string => {
    if (metric === 'posts') {
      if (data.posts >= 200) return 'bg-[#004e98] text-white shadow-xs';
      if (data.posts >= 150) return 'bg-[#0466c2] text-white';
      if (data.posts >= 100) return 'bg-[#60a5fa] text-white';
      if (data.posts >= 50) return 'bg-[#d5e3ff] text-[#001b3c]';
      return 'bg-[#f0eded] text-[#414752]';
    }

    if (metric === 'engagement') {
      if (data.engagementRate >= 9.0) return 'bg-[#006c49] text-white shadow-xs';
      if (data.engagementRate >= 8.0) return 'bg-[#10b981] text-white';
      if (data.engagementRate >= 7.0) return 'bg-[#6cf8bb] text-[#002113]';
      if (data.engagementRate >= 5.5) return 'bg-[#d5e3ff] text-[#001b3c]';
      return 'bg-[#f0eded] text-[#414752]';
    }

    // Reach
    if (data.reach >= 75000) return 'bg-[#004e98] text-white shadow-xs';
    if (data.reach >= 50000) return 'bg-[#0466c2] text-white';
    if (data.reach >= 35000) return 'bg-[#60a5fa] text-white';
    if (data.reach >= 20000) return 'bg-[#d5e3ff] text-[#001b3c]';
    return 'bg-[#f0eded] text-[#414752]';
  };

  // Velocity data points for chart
  const timelineData = [
    { time: 'Day 1 - 09:00', posts: 140, reach: 45000, label: 'Keynote Kickoff' },
    { time: 'Day 1 - 12:30', posts: 320, reach: 110000, label: 'Lunch Networking' },
    { time: 'Day 1 - 17:00', posts: 490, reach: 185000, label: 'Evening Reception' },
    { time: 'Day 2 - 10:00', posts: 780, reach: 290000, label: 'Agentic Track' },
    { time: 'Day 2 - 14:00', posts: 1040, reach: 395000, label: 'Deep Dives' },
    { time: 'Day 2 - 18:00', posts: 1280, reach: 482500, label: 'Current Peak' },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5e3ff] text-[#001b3c] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004e98]"></span>
                Live Intelligence
              </span>
              <span className="font-mono text-xs text-[#414752]">{campaign.name}</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl text-[#1c1b1b] font-bold tracking-tight">
              Campaign Analytics & Impact
            </h1>
            <p className="text-xs sm:text-sm text-[#414752] max-w-2xl">
              Track real-time social amplification, attendee post reach, tone distributions, and viral velocity across LinkedIn.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#f0eded] p-0.5 rounded-lg flex items-center shadow-inner">
              <button
                onClick={() => setSelectedTimeRange('24h')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTimeRange === '24h' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setSelectedTimeRange('3d')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTimeRange === '3d' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                }`}
              >
                3 Days
              </button>
              <button
                onClick={() => setSelectedTimeRange('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTimeRange === 'all' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                }`}
              >
                All Time
              </button>
            </div>
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#414752]">
              <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
              <span className="material-symbols-outlined text-[20px] text-[#004e98]">visibility</span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-3xl font-bold text-[#004e98]">
                {campaign.stats.reachCount}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#006c49] font-semibold mt-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+38.2% vs summit target</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#414752]">
              <span className="text-xs font-bold uppercase tracking-wider">Posts Generated</span>
              <span className="material-symbols-outlined text-[20px] text-[#006c49]">feed</span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-3xl font-bold text-[#1c1b1b]">
                {campaign.stats.postsCreated.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#006c49] font-semibold mt-1">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                <span>24% growth since morning keynote</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#414752]">
              <span className="text-xs font-bold uppercase tracking-wider">Viral Engagement Rate</span>
              <span className="material-symbols-outlined text-[20px] text-[#704500]">bolt</span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-3xl font-bold text-[#006c49]">
                {campaign.stats.viralRate}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#414752] mt-1">
                <span>Top 5% across tech conferences</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#414752]">
              <span className="text-xs font-bold uppercase tracking-wider">VIP & Speaker Adoption</span>
              <span className="material-symbols-outlined text-[20px] text-[#004e98] fill">stars</span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-3xl font-bold text-[#1c1b1b]">
                {campaign.stats.vipCount}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#006c49] font-semibold mt-1">
                <span>92.3% of stage speakers shared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Velocity Area Curve (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline text-base font-bold text-[#1c1b1b]">
                  LinkedIn Post Publication Velocity
                </h3>
                <p className="text-xs text-[#414752]">Cumulative posts published by attendees over summit timeline</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#f6f3f2] text-xs font-semibold text-[#004e98]">
                Real-time Sync
              </span>
            </div>

            {/* SVG Visual Timeline Chart */}
            <div className="w-full h-56 pt-4">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004e98" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#004e98" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="180" x2="600" y2="180" stroke="#f0eded" strokeWidth="1" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f0eded" strokeWidth="1" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#f0eded" strokeWidth="1" />
                
                {/* Area fill */}
                <polygon
                  points="0,180 0,165 100,140 220,110 340,75 460,45 600,20 600,180"
                  fill="url(#chartGradient)"
                />
                
                {/* Line */}
                <polyline
                  points="0,165 100,140 220,110 340,75 460,45 600,20"
                  fill="none"
                  stroke="#004e98"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="100" cy="140" r="4" fill="#004e98" />
                <circle cx="220" cy="110" r="4" fill="#004e98" />
                <circle cx="340" cy="75" r="4" fill="#004e98" />
                <circle cx="460" cy="45" r="4" fill="#004e98" />
                <circle cx="600" cy="20" r="5" fill="#006c49" />
              </svg>
            </div>

            {/* Timeline milestone points */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2 border-t border-gray-100">
              {timelineData.map((d) => (
                <div key={d.time} className="flex flex-col">
                  <span className="text-[10px] text-[#414752] truncate">{d.time.split(' - ')[1]}</span>
                  <span className="text-xs font-bold text-[#1c1b1b]">{d.posts} posts</span>
                  <span className="text-[9px] text-[#006c49] truncate">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tone & Persona Breakdown (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col gap-4">
            <h3 className="font-headline text-base font-bold text-[#1c1b1b]">
              Voice & Tone Distribution
            </h3>
            <p className="text-xs text-[#414752]">Which prompt styles attendees prefer</p>

            <div className="flex flex-col gap-3.5 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-[#1c1b1b]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#004e98]"></span>
                    Grateful Attendee
                  </span>
                  <span className="text-[#004e98]">42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#004e98] rounded-full w-[42%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-[#1c1b1b]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]"></span>
                    Key Takeaways
                  </span>
                  <span className="text-[#006c49]">31%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#006c49] rounded-full w-[31%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-[#1c1b1b]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0466c2]"></span>
                    Professional
                  </span>
                  <span className="text-[#0466c2]">19%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#0466c2] rounded-full w-[19%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-[#1c1b1b]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#704500]"></span>
                    Speaker / Panelist
                  </span>
                  <span className="text-[#704500]">8%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#704500] rounded-full w-[8%]"></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f6f3f2] rounded-lg mt-2 text-xs text-[#414752] leading-relaxed">
              💡 <strong>Pro Tip:</strong> Key Takeaways posts generate 2.1x more comments than standard recap posts.
            </div>
          </div>
        </div>

        {/* Heatmap Section: Peak Hours for Post Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#004e98]">local_fire_department</span>
                <h3 className="font-headline text-lg font-bold text-[#1c1b1b]">
                  Peak Attendee Activity & Viral Heatmap
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-[11px] font-bold">
                  High Engagement Spikes
                </span>
              </div>
              <p className="text-xs text-[#414752]">
                Hourly breakdown of attendee post generation, impression velocity, and feed traction across summit days.
              </p>
            </div>

            {/* Metric Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#414752] uppercase tracking-wider mr-1">Display:</span>
              <div className="bg-[#f0eded] p-0.5 rounded-lg flex items-center shadow-inner">
                <button
                  onClick={() => setHeatmapMetric('posts')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    heatmapMetric === 'posts' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                  }`}
                  type="button"
                >
                  Posts Shared
                </button>
                <button
                  onClick={() => setHeatmapMetric('engagement')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    heatmapMetric === 'engagement' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                  }`}
                  type="button"
                >
                  Engagement Rate %
                </button>
                <button
                  onClick={() => setHeatmapMetric('reach')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    heatmapMetric === 'reach' ? 'bg-white text-[#004e98] shadow-xs' : 'text-[#414752]'
                  }`}
                  type="button"
                >
                  Estimated Reach
                </button>
              </div>
            </div>
          </div>

          {/* Heatmap Grid & Inspection Pane */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* The Interactive Heatmap Matrix (8 cols on XL) */}
            <div className="xl:col-span-8 flex flex-col gap-3 overflow-x-auto pb-2">
              <div className="min-w-[620px]">
                {/* Hours Header Row */}
                <div className="grid grid-cols-12 gap-1.5 mb-2 pl-24 text-center">
                  {HEATMAP_HOURS.map((hr) => (
                    <span key={hr} className="text-[11px] font-semibold text-[#414752]">
                      {hr}
                    </span>
                  ))}
                </div>

                {/* Days Rows */}
                <div className="flex flex-col gap-2">
                  {HEATMAP_DAYS.map((day, dIdx) => (
                    <div key={day.id} className="flex items-center gap-2">
                      {/* Day Label */}
                      <div className="w-24 flex-shrink-0 flex flex-col">
                        <span className="text-xs font-bold text-[#1c1b1b] truncate">{day.name}</span>
                        <span className="text-[10px] text-[#414752] truncate">{day.date}</span>
                      </div>

                      {/* 11 Hour Cells */}
                      <div className="grid grid-cols-12 gap-1.5 flex-1">
                        {HEATMAP_HOURS.map((hr, hIdx) => {
                          const cellData = getHeatmapCell(dIdx, hIdx);
                          const isHovered =
                            selectedCell?.dayIndex === dIdx && selectedCell?.hourIndex === hIdx;
                          const intensityClass = getCellColor(cellData, heatmapMetric);

                          return (
                            <button
                              key={hr}
                              onClick={() => setSelectedCell({ dayIndex: dIdx, hourIndex: hIdx, data: cellData })}
                              onMouseEnter={() => setSelectedCell({ dayIndex: dIdx, hourIndex: hIdx, data: cellData })}
                              className={`h-11 rounded-lg flex flex-col items-center justify-center p-1 transition-all relative group cursor-pointer ${intensityClass} ${
                                isHovered ? 'ring-2 ring-[#004e98] scale-105 z-10 shadow-md' : 'hover:scale-102'
                              }`}
                              title={`${day.name} @ ${hr}: ${cellData.posts} posts (${cellData.engagementRate}% eng)`}
                              type="button"
                            >
                              <span className="text-xs font-bold leading-none">
                                {heatmapMetric === 'posts' && cellData.posts}
                                {heatmapMetric === 'engagement' && `${cellData.engagementRate}%`}
                                {heatmapMetric === 'reach' && `${Math.round(cellData.reach / 1000)}k`}
                              </span>
                              {cellData.isKeynote && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f59e0b] rounded-full ring-2 ring-white" title="Keynote session slot" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-2 text-xs text-[#414752]">
                  <span className="font-semibold text-[#1c1b1b]">Activity Intensity:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px]">Low</span>
                    <div className="w-5 h-4 rounded bg-[#f0eded] border border-gray-200"></div>
                    <div className="w-5 h-4 rounded bg-[#d5e3ff]"></div>
                    <div className="w-5 h-4 rounded bg-[#60a5fa] text-white"></div>
                    <div className="w-5 h-4 rounded bg-[#0466c2] text-white"></div>
                    <div className="w-5 h-4 rounded bg-[#004e98] text-white"></div>
                    <span className="text-[11px] font-bold text-[#004e98]">Peak Viral</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#414752]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                    <span>Keynote / Spotlight Session</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]"></span>
                    <span>3.4x Reach Window</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Cell Inspection Details Card (4 cols on XL) */}
            <div className="xl:col-span-4 bg-[#f6f3f2] p-5 rounded-xl border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#004e98]">explore</span>
                  Slot Inspection
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#004e98] shadow-2xs">
                  {selectedCell ? `${HEATMAP_DAYS[selectedCell.dayIndex].name} • ${HEATMAP_HOURS[selectedCell.hourIndex]}` : 'Click cell to inspect'}
                </span>
              </div>

              {selectedCell ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <h4 className="font-headline text-base font-bold text-[#1c1b1b] leading-tight">
                      {selectedCell.data.sessionTitle}
                    </h4>
                    <span className="text-[11px] text-[#006c49] font-bold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">stars</span>
                      {selectedCell.data.tagline}
                    </span>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col">
                      <span className="text-[10px] text-[#414752] uppercase font-semibold">Posts</span>
                      <span className="font-headline text-lg font-bold text-[#1c1b1b]">
                        {selectedCell.data.posts}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col">
                      <span className="text-[10px] text-[#414752] uppercase font-semibold">Engagement</span>
                      <span className="font-headline text-lg font-bold text-[#006c49]">
                        {selectedCell.data.engagementRate}%
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col">
                      <span className="text-[10px] text-[#414752] uppercase font-semibold">Reach</span>
                      <span className="font-headline text-lg font-bold text-[#004e98]">
                        {(selectedCell.data.reach / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>

                  {/* Strategic Takeaway for this slot */}
                  <div className="p-3 bg-white rounded-lg border border-gray-100 text-xs text-[#414752] flex flex-col gap-1">
                    <span className="font-bold text-[#1c1b1b] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#004e98]">insights</span>
                      Algorithm Recommendation:
                    </span>
                    <p className="leading-relaxed">
                      {selectedCell.data.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#414752]">
                  Hover over or click any time block in the heatmap above to view detailed session takeaways and viral engagement metrics.
                </div>
              )}

              {/* Best Practice Note */}
              <div className="p-3 rounded-lg bg-[#d5e3ff]/40 border border-[#d5e3ff] text-[11px] text-[#001b3c] leading-relaxed">
                🚀 <strong>Key Takeaway:</strong> Morning slots (09:00 - 11:00) during keynote presentations achieve <strong>+184%</strong> higher comment velocity than late-afternoon posts.
              </div>
            </div>
          </div>
        </div>

        {/* Top Viral Posts Leaderboard */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline text-base font-bold text-[#1c1b1b]">
                Top Amplification Leaderboard
              </h3>
              <p className="text-xs text-[#414752]">Highest performing attendee posts by organic impressions</p>
            </div>
            <span className="text-xs text-[#006c49] font-bold">Updated live</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[#414752] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">Attendee</th>
                  <th className="py-2.5 px-3">Role / Org</th>
                  <th className="py-2.5 px-3">Tone Format</th>
                  <th className="py-2.5 px-3">Reactions</th>
                  <th className="py-2.5 px-3">Comments</th>
                  <th className="py-2.5 px-3">Est. Reach</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sharedPosts.map((post, i) => (
                  <tr key={post.id} className="hover:bg-[#f6f3f2]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#1c1b1b] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#d5e3ff] text-[#001b3c] flex items-center justify-center text-[10px] font-bold">
                        {post.authorInitials}
                      </span>
                      <span>{post.authorName}</span>
                    </td>
                    <td className="py-3 px-3 text-[#414752]">{post.authorRole}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#f0eded] text-[10px] font-semibold text-[#004e98] capitalize">
                        {post.tone || 'grateful'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1c1b1b]">{post.reactions}</td>
                    <td className="py-3 px-3 text-[#414752]">{post.comments}</td>
                    <td className="py-3 px-3 font-bold text-[#006c49]">
                      {(post.reactions * 142).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={post.postUrl || 'https://www.linkedin.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#004e98] hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

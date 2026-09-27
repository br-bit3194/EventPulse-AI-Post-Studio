import React, { useState, useRef } from 'react';
import { CampaignConfig, ToneType, ConferencePhoto, AttendeeProfile, ScheduledPost } from '../types';
import { QUICK_ADD_OPTIONS, DEFAULT_PHOTOS } from '../constants';
import { ScheduleModal } from './ScheduleModal';
import { ScheduledQueueDrawer } from './ScheduledQueueDrawer';
import { ImagenStudioModal } from './ImagenStudioModal';

interface AttendeeViewProps {
  campaign: CampaignConfig;
  profile: AttendeeProfile;
  onPostPublished: (content: string, tone: ToneType) => void;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({
  campaign,
  profile,
  onPostPublished,
}) => {
  // Input form state
  const [highlights, setHighlights] = useState<string>(
    'Fascinating keynote on autonomous AI agents by @DavidChen! Met incredible founders and loved the workshop on enterprise vector databases. Key takeaway: agentic workflows are moving into production faster than expected.'
  );
  const [selectedTone, setSelectedTone] = useState<ToneType>('grateful');
  const [selectedPhoto, setSelectedPhoto] = useState<ConferencePhoto>(DEFAULT_PHOTOS[0]);
  const [photosList, setPhotosList] = useState<ConferencePhoto[]>(DEFAULT_PHOTOS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview format state
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(48);
  const [showComments, setShowComments] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);
  const [isImagenModalOpen, setIsImagenModalOpen] = useState(false);
  const [scheduleToast, setScheduleToast] = useState<string | null>(null);

  // Trending Hashtags State
  const [trendingHashtags, setTrendingHashtags] = useState<{
    tag: string;
    volume: string;
    reason: string;
    score: number;
  }[]>([
    { tag: '#AgenticAI', volume: '142K posts', reason: 'High feed velocity among builders', score: 98 },
    { tag: '#EnterpriseAI', volume: '210K posts', reason: 'Top hashtag for executive reach', score: 95 },
    { tag: '#GenerativeAI', volume: '890K posts', reason: 'Broad discovery & global reach', score: 92 },
    { tag: '#VectorSearch', volume: '68K posts', reason: 'Trending technical architecture tag', score: 89 },
    { tag: '#TechLeadership', volume: '340K posts', reason: 'High reaction rate from VPs & Directors', score: 88 },
    { tag: '#LLMOps', volume: '54K posts', reason: 'Popular with production engineers', score: 86 },
    { tag: '#FutureOfTech', volume: '410K posts', reason: 'Strong cross-industry readership', score: 84 },
  ]);
  const [isFetchingHashtags, setIsFetchingHashtags] = useState(false);

  // Scheduled Queue State
  const [scheduledQueue, setScheduledQueue] = useState<ScheduledPost[]>([
    {
      id: 'sched-1',
      content: 'Key takeaway from Day 2 opening: Enterprise agentic orchestration is consolidating into sub-50ms latency loops. What a showcase by @DavidChen at #TechNova2025!',
      tone: 'takeaways',
      scheduledTime: 'Day 2 (Oct 15) @ 10:15 AM',
      scheduledSlotLabel: 'Post-Keynote Peak Window',
      photoUrl: DEFAULT_PHOTOS[0].url,
      photoCaption: 'Keynote Stage Demo',
      status: 'queued',
      createdAt: new Date().toISOString(),
      notes: 'Snap quick selfie with speaker during Q&A',
    },
    {
      id: 'sched-2',
      content: 'Immensely grateful to TechNova Media & Ventures Group for such an inspiring summit gala tonight. The community energy in SF is unmatched! #TechNova2025 #AIInnovation',
      tone: 'grateful',
      scheduledTime: 'Day 2 (Oct 15) @ 6:00 PM',
      scheduledSlotLabel: 'Evening Gala & Mixer',
      photoUrl: DEFAULT_PHOTOS[2].url,
      photoCaption: 'VIP Networking Lounge',
      status: 'queued',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'David Chen',
      role: 'Keynote Speaker & AI Lead',
      text: 'Thanks for attending Elena! Glad the agentic pipeline architecture resonated with you.',
      time: '2m ago',
    },
  ]);
  const [newCommentInput, setNewCommentInput] = useState('');

  // Generated post content
  const [postContent, setPostContent] = useState<string>(`Unbelievable energy at #TechNova2025 today! 🚀

Huge thank you to the organizers at TechNova Media & Ventures Group for curating such a forward-thinking agenda. The discussions around agentic AI workflows and next-generation infra made one thing clear: enterprise AI adoption is accelerating exponentially.

Three big takeaways from Day 2:
1️⃣ Autonomous agents are graduating from prototypes to production rails
2️⃣ Vector retrieval latency dropped 10x year-over-year
3️⃣ The community here in SF is buzzing with builders

Special shoutout to @DavidChen for the thought-provoking keynote. Looking forward to tomorrow's panels!

#TechNova2025 #AIInnovation #TechSummit #ArtificialIntelligence #MachineLearning`);

  // Quick Add helper
  const handleQuickAdd = (text: string) => {
    setHighlights((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${text}` : text.trim();
    });
  };

  // Clear text
  const handleClear = () => {
    setHighlights('');
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newPhoto: ConferencePhoto = {
          id: `custom-${Date.now()}`,
          url,
          label: file.name.slice(0, 16),
          caption: `Summit photo captured by ${profile.name}`,
        };
        setPhotosList([newPhoto, ...photosList]);
        setSelectedPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate / Regenerate AI post
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          highlights,
          tone: selectedTone,
          eventName: campaign.name,
          organizer: campaign.organizerName,
          hashtags: Array.from(new Set([...campaign.hashtags, ...trendingHashtags.filter(t => postContent.includes(t.tag)).map(t => t.tag)])),
          authorName: profile.name,
          authorRole: profile.headline,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPostContent(data.post);
      }
    } catch (err) {
      console.warn('API error, falling back locally', err);
      // Fallback local variations
      if (selectedTone === 'takeaways') {
        setPostContent(`3 high-impact takeaways from ${campaign.name}: 💡\n\nAttending this week's summit in SF completely reframed our engineering roadmap. Here is what stood out:\n\n1️⃣ Production Readiness: ${highlights || 'Autonomous systems are entering live production environments.'}\n2️⃣ Latency Reduction: 10x drops in retrieval loops.\n3️⃣ Ecosystem Collaboration: Industry leaders uniting for secure standards.\n\nHuge shoutout to ${campaign.organizerName} for assembling such an elite cohort of builders!\n\n${campaign.hashtags.join(' ')} #EngineeringLeadership #FutureOfTech`);
      } else if (selectedTone === 'speaker') {
        setPostContent(`Honored to be on stage at ${campaign.name}! 🎤\n\nSharing insights on distributed AI systems with a packed auditorium of founders and engineers was an incredible privilege.\n\nKey discussion points:\n• ${highlights || 'Enterprise agent architectures and fault-tolerant orchestration.'}\n• Moving from prototypes to high-availability production rails\n• Community collaboration across modern stacks\n\nThank you to ${campaign.organizerName} for organizing such a monumental summit.\n\n${campaign.hashtags.join(' ')} #KeynoteSpeaker #TechNova2025`);
      } else if (selectedTone === 'professional') {
        setPostContent(`Reflecting on an insightful series of discussions at ${campaign.name}, hosted by ${campaign.organizerName}.\n\nAs enterprise architectures evolve, one clear truth remains: the intersection of scalable systems and developer tooling will dictate the next decade of technology.\n\nCore takeaway:\n"${highlights || 'Agentic workflows are maturing faster than projected.'}"\n\nLooking forward to implementing these strategic frameworks.\n\n${campaign.hashtags.join(' ')} #ExecutiveStrategy #EnterpriseTech`);
      } else {
        setPostContent(`Unbelievable energy at #${campaign.name.replace(/[^a-zA-Z0-9]/g, '')} today! 🚀\n\nHuge thank you to the organizers at ${campaign.organizerName} for curating such a forward-thinking agenda. The discussions around agentic AI workflows and next-generation infra made one thing clear: enterprise AI adoption is accelerating exponentially.\n\nThree big takeaways from Day 2:\n1️⃣ Autonomous agents are graduating from prototypes to production rails\n2️⃣ Vector retrieval latency dropped 10x year-over-year\n3️⃣ The community here in SF is buzzing with builders\n\nSpecial shoutout to @DavidChen for the thought-provoking keynote. Looking forward to tomorrow's panels!\n\n${campaign.hashtags.join(' ')} #ArtificialIntelligence #MachineLearning`);
      }
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 400);
    }
  };

  // Copy post text
  const handleCopyText = () => {
    navigator.clipboard.writeText(postContent);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2200);
  };

  // Open in LinkedIn and log post
  const handleOpenLinkedIn = () => {
    onPostPublished(postContent, selectedTone);
    const textEncoded = encodeURIComponent(postContent);
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${textEncoded}`;
    window.open(url, '_blank');
  };

  // Download assets
  const handleDownload = () => {
    const textBlob = new Blob([postContent], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const link = document.createElement('a');
    link.href = textUrl;
    link.download = `linkedin-post-${campaign.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(textUrl);
  };

  // Like reaction toggle
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setReactionsCount(isLiked ? reactionsCount - 1 : reactionsCount + 1);
  };

  // Add mock comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: `c-${Date.now()}`,
        author: profile.name,
        role: profile.headline.split('|')[0] || 'Attendee',
        text: newCommentInput.trim(),
        time: 'Just now',
      },
    ]);
    setNewCommentInput('');
  };

  // Schedule post handler
  const handleScheduleConfirm = (newPostData: Omit<ScheduledPost, 'id' | 'createdAt' | 'status'>) => {
    const newScheduledItem: ScheduledPost = {
      ...newPostData,
      id: `sched-${Date.now()}`,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    setScheduledQueue((prev) => [newScheduledItem, ...prev]);
    setScheduleToast(`Post queued for ${newPostData.scheduledTime} (${newPostData.scheduledSlotLabel})`);
    setTimeout(() => setScheduleToast(null), 3800);
  };

  const handlePublishNowFromQueue = (post: ScheduledPost) => {
    onPostPublished(post.content, post.tone);
    setScheduledQueue((prev) => prev.filter((p) => p.id !== post.id));
    const textEncoded = encodeURIComponent(post.content);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${textEncoded}`, '_blank');
  };

  const handleDeleteFromQueue = (id: string) => {
    setScheduledQueue((prev) => prev.filter((p) => p.id !== id));
    setScheduleToast('Removed draft from scheduled queue');
    setTimeout(() => setScheduleToast(null), 2500);
  };

  const handleSelectToEdit = (post: ScheduledPost) => {
    setPostContent(post.content);
    setSelectedTone(post.tone);
    setIsQueueDrawerOpen(false);
    setScheduleToast(`Loaded draft into editor: "${post.scheduledSlotLabel}"`);
    setTimeout(() => setScheduleToast(null), 3000);
  };

  const handleImageGeneratedFromImagen = (photo: ConferencePhoto) => {
    setPhotosList((prev) => [photo, ...prev]);
    setSelectedPhoto(photo);
    setScheduleToast('✨ Branded summit visual attached using Google Imagen 3!');
    setTimeout(() => setScheduleToast(null), 3200);
  };

  // Trending Hashtag Management
  const fetchTrendingHashtags = async () => {
    setIsFetchingHashtags(true);
    try {
      const res = await fetch('/api/suggest-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: campaign.name,
          keywords: highlights,
          existingTags: campaign.hashtags,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions && data.suggestions.length > 0) {
        setTrendingHashtags(data.suggestions);
        setScheduleToast('✨ Trending hashtags refreshed based on your event keywords!');
        setTimeout(() => setScheduleToast(null), 3200);
      }
    } catch (err) {
      console.warn('Failed to fetch hashtags from server, using local fallback:', err);
    } finally {
      setIsFetchingHashtags(false);
    }
  };

  const toggleHashtagInPost = (tag: string) => {
    if (postContent.includes(tag)) {
      // Remove hashtag
      const regex = new RegExp(`\\s*${tag}`, 'g');
      const updated = postContent.replace(regex, '');
      setPostContent(updated);
      setScheduleToast(`Removed ${tag} from post draft`);
    } else {
      // Add hashtag
      setPostContent((prev) => `${prev.trim()} ${tag}`);
      setScheduleToast(`Added ${tag} to post! (+18% algorithmic reach)`);
    }
    setTimeout(() => setScheduleToast(null), 2500);
  };

  const addAllTrendingHashtags = () => {
    let updated = postContent;
    let addedCount = 0;
    trendingHashtags.slice(0, 4).forEach((item) => {
      if (!updated.includes(item.tag)) {
        updated = `${updated.trim()} ${item.tag}`;
        addedCount++;
      }
    });
    setPostContent(updated);
    setScheduleToast(`Added ${addedCount} trending hashtags to post!`);
    setTimeout(() => setScheduleToast(null), 2500);
  };

  // Format LinkedIn content with tags, links, and line breaks
  const renderFormattedText = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-3"></div>;
      }

      // Check if line contains tags like #Tag or @Mention
      const words = line.split(' ');
      return (
        <p key={idx} className="leading-relaxed">
          {words.map((word, wIdx) => {
            if (word.startsWith('#')) {
              return (
                <span
                  key={wIdx}
                  className="text-[#004e98] font-semibold hover:underline cursor-pointer"
                >
                  {word}{' '}
                </span>
              );
            }
            if (word.startsWith('@')) {
              return (
                <span
                  key={wIdx}
                  className="text-[#004e98] font-semibold hover:underline cursor-pointer"
                >
                  {word}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </p>
      );
    });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Top Event Banner */}
        <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-xs border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side: Badge & Details */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-[#004e98] flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[32px]">hub</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b] truncate">
                  {campaign.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d5e3ff] text-[#001b3c] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004e98]"></span>
                  {campaign.dates} • {campaign.city || campaign.location.split(',')[0]}
                </span>
              </div>
              <p className="text-xs text-[#414752] flex flex-wrap items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[15px] text-[#004e98]">corporate_fare</span>
                <span>Hosted by {campaign.organizerName}</span>
                <span className="mx-1">•</span>
                <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">location_on</span>
                <span>{campaign.venue ? `${campaign.venue}, ` : ''}{campaign.location}</span>
              </p>
            </div>
          </div>

          {/* Right side: Tags & Official Badge */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-start lg:justify-end">
            <div className="flex flex-wrap items-center gap-1.5">
              {campaign.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#f0eded] text-xs text-[#004e98] font-semibold hover:bg-[#eae7e7] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-full bg-[#f6f3f2] text-xs text-[#414752] hover:text-[#1c1b1b] transition-colors cursor-pointer">
                {campaign.socialLinks.twitter}
              </span>
              <a
                className="px-2.5 py-1 rounded-full bg-[#f6f3f2] text-xs text-[#414752] hover:text-[#004e98] transition-colors flex items-center gap-1"
                href={`https://${campaign.socialLinks.website.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{campaign.socialLinks.website.replace(/^https?:\/\//, '')}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-xs font-bold shadow-2xs flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">verified</span>
              <span className="tracking-wide">Official Attendee Portal</span>
            </div>
          </div>
        </div>

        {/* Two-Column Workspace (Dual Pane) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Form Workbench (6 cols on Desktop) */}
          <div className="lg:col-span-6 w-full flex flex-col gap-4">
            <div className="w-full bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-gray-100 flex flex-col gap-5">
              {/* Header */}
              <div className="flex flex-col gap-1 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b]">
                    Craft Your LinkedIn Post
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0eded] text-xs text-[#004e98] font-bold">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    AI Assistant
                  </span>
                </div>
                <p className="text-xs text-[#414752]">
                  Generate an engaging, viral post highlighting your participation in seconds.
                </p>
              </div>

              {/* 1. Drag & Drop Photo Upload & Imagen AI Studio */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                      Conference Photos & Visuals
                    </label>
                    <span className="text-xs text-[#414752]">Max 10MB</span>
                  </div>

                  <button
                    onClick={() => setIsImagenModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#004e98] to-[#0466c2] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                    type="button"
                    title="Generate branded summit artwork with Google Imagen 3"
                  >
                    <span className="material-symbols-outlined text-[15px]">palette</span>
                    <span>Generate with Imagen AI</span>
                  </button>
                </div>

                {/* Dropzone Area */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#f6f3f2] hover:bg-[#eae7e7] transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-gray-200 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#d5e3ff] flex items-center justify-center text-[#004e98] group-hover:scale-105 transition-transform mb-1.5 shadow-2xs">
                    <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
                  </div>
                  <p className="text-xs font-semibold text-[#1c1b1b]">
                    Drop conference photos or stage selfies here, or{' '}
                    <span className="text-[#004e98] hover:underline font-bold">browse files</span>
                  </p>
                  <p className="text-[11px] text-[#414752] mt-0.5">Supports PNG, JPG up to 10MB</p>
                </div>

                {/* Thumbnail Row */}
                <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                  {/* Imagen Visual Generation Quick Slot */}
                  <button
                    onClick={() => setIsImagenModalOpen(true)}
                    className="w-28 h-16 rounded-lg bg-gradient-to-br from-[#d5e3ff]/70 to-[#d5e3ff]/20 hover:from-[#d5e3ff] hover:to-[#d5e3ff]/50 transition-all flex flex-col items-center justify-center gap-0.5 text-[#004e98] flex-shrink-0 border border-[#0466c2]/30 cursor-pointer shadow-2xs group"
                    type="button"
                    title="Generate branded visual with Imagen AI"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">palette</span>
                    <span className="text-[10px] font-bold text-center leading-tight">Imagen Visual</span>
                    <span className="text-[9px] text-[#006c49] font-bold">AI Studio</span>
                  </button>

                  {photosList.map((photo) => {
                    const isSelected = selectedPhoto.id === photo.id;
                    return (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-[#006c49] shadow-sm' : 'opacity-80 hover:opacity-100 ring-1 ring-gray-200'
                        }`}
                      >
                        <img alt={photo.label} className="w-full h-full object-cover" src={photo.url} />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#004e98]/20 flex items-start justify-end p-1">
                            <span className="w-5 h-5 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 flex items-center justify-center gap-0.5">
                          {photo.isAiGenerated && (
                            <span className="material-symbols-outlined text-[10px] text-[#6cf8bb]">auto_awesome</span>
                          )}
                          <p className="text-[10px] text-white truncate text-center font-medium">
                            {isSelected ? 'Selected' : photo.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Photo Slot */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-16 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] transition-colors flex flex-col items-center justify-center gap-1 text-[#414752] hover:text-[#004e98] flex-shrink-0 border border-gray-200 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="text-[11px] font-semibold">+ Add photo</span>
                  </button>

                  <div className="pl-2 hidden sm:flex flex-col justify-center">
                    <span className="text-xs text-[#006c49] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Stage image attached to preview
                    </span>
                    <span className="text-[11px] text-[#414752]">Optimal 16:9 social crop applied</span>
                  </div>
                </div>
              </div>

              {/* 2. Key Highlights / Takeaways Textarea */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider" htmlFor="post-highlights">
                    Key Highlights & Takeaways
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-xs text-[#414752] hover:text-[#ba1a1a] transition-colors font-semibold"
                    type="button"
                  >
                    Clear
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    className="w-full bg-[#f6f3f2] focus:bg-white rounded-xl p-3.5 text-xs sm:text-sm text-[#1c1b1b] focus:outline-none border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20 resize-y transition-all leading-relaxed placeholder:text-[#414752]/60 font-normal"
                    id="post-highlights"
                    placeholder="Enter what you learned, speakers you loved, or key takeaways..."
                    rows={4}
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                  />
                  <div className="absolute bottom-2.5 right-3 text-[#414752] font-mono text-xs pointer-events-none">
                    <span>{highlights.length}</span> chars
                  </div>
                </div>

                {/* Quick-add suggestion pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-[#414752] font-medium mr-1">Quick Add:</span>
                  {QUICK_ADD_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleQuickAdd(opt.text)}
                      className="px-2.5 py-1 rounded-full bg-[#f0eded] hover:bg-[#eae7e7] text-[#1c1b1b] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span className="text-[#004e98] font-bold">+</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. AI Trending Hashtags Suggestion Module */}
              <div className="flex flex-col gap-2.5 p-4 bg-[#f6f3f2] rounded-xl border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#004e98]">local_fire_department</span>
                    <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                      Trending LinkedIn Hashtags
                    </span>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-[10px] font-bold">
                      Algorithm Boost
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={fetchTrendingHashtags}
                      disabled={isFetchingHashtags}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-[#004e98] text-[11px] font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60 border border-gray-200"
                      type="button"
                      title="Analyze current keywords with AI"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${isFetchingHashtags ? 'animate-spin' : ''}`}>
                        sync
                      </span>
                      <span>{isFetchingHashtags ? 'Analyzing...' : 'Refresh AI'}</span>
                    </button>
                    <button
                      onClick={addAllTrendingHashtags}
                      className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md bg-[#004e98] hover:bg-[#004e98]/90 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                      type="button"
                    >
                      <span>+ Add Top 4</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-[#414752] leading-tight">
                  Auto-curated for <strong>{campaign.name}</strong> & your notes. Click any tag to inject or toggle in your post:
                </p>

                {/* Trending Hashtag Chips Grid */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {trendingHashtags.map((item) => {
                    const isIncluded = postContent.includes(item.tag);
                    return (
                      <button
                        key={item.tag}
                        onClick={() => toggleHashtagInPost(item.tag)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs border ${
                          isIncluded
                            ? 'bg-[#004e98] text-white border-[#004e98] ring-1 ring-[#004e98]'
                            : 'bg-white text-[#1c1b1b] border-gray-200 hover:border-[#0466c2] hover:text-[#004e98]'
                        }`}
                        title={`${item.reason} • ${item.volume}`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[13px] font-bold">
                          {isIncluded ? 'check' : 'add'}
                        </span>
                        <span>{item.tag}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                            isIncluded ? 'bg-white/20 text-white' : 'bg-[#f0eded] text-[#414752]'
                          }`}
                        >
                          {item.volume}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Tone Selector Chips */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                  Select Voice & Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Professional */}
                  <button
                    onClick={() => setSelectedTone('professional')}
                    className={`px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all text-left ${
                      selectedTone === 'professional'
                        ? 'bg-[#004e98] text-white shadow-sm font-bold'
                        : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#414752] font-semibold'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">business_center</span>
                    <span className="text-xs">Professional</span>
                  </button>

                  {/* Grateful Attendee */}
                  <button
                    onClick={() => setSelectedTone('grateful')}
                    className={`px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all text-left ${
                      selectedTone === 'grateful'
                        ? 'bg-[#004e98] text-white shadow-sm font-bold'
                        : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#414752] font-semibold'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] fill">volunteer_activism</span>
                    <span className="text-xs">Grateful Attendee</span>
                  </button>

                  {/* Key Takeaways */}
                  <button
                    onClick={() => setSelectedTone('takeaways')}
                    className={`px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all text-left ${
                      selectedTone === 'takeaways'
                        ? 'bg-[#004e98] text-white shadow-sm font-bold'
                        : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#414752] font-semibold'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                    <span className="text-xs">Key Takeaways</span>
                  </button>

                  {/* Speaker / Panelist */}
                  <button
                    onClick={() => setSelectedTone('speaker')}
                    className={`px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all text-left ${
                      selectedTone === 'speaker'
                        ? 'bg-[#004e98] text-white shadow-sm font-bold'
                        : 'bg-[#f0eded] hover:bg-[#eae7e7] text-[#414752] font-semibold'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                    <span className="text-xs">Speaker / Panelist</span>
                  </button>
                </div>
              </div>

              {/* 4. Primary CTA */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#004e98] hover:bg-[#004e98]/90 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isGenerating ? 'animate-spin' : 'animate-pulse'
                    }`}
                  >
                    {isGenerating ? 'sync' : 'auto_awesome'}
                  </span>
                  <span>{isGenerating ? 'Generating Branded Post with Gemini AI...' : 'Generate LinkedIn Post'}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[#414752] text-center">
                  <span className="material-symbols-outlined text-[15px] text-[#004e98]">verified_user</span>
                  <p className="text-xs">
                    Powered by EventPulse AI • Customized with official event hashtags & host mentions
                  </p>
                </div>
              </div>
            </div>

            {/* Pro-tip info banner */}
            <div className="w-full bg-[#f6f3f2] rounded-xl p-4 flex items-start gap-3 border border-gray-100">
              <span className="material-symbols-outlined text-[#006c49] text-[22px] flex-shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div className="flex flex-col">
                <h4 className="font-headline text-sm font-bold text-[#1c1b1b]">Maximize Attendee Reach</h4>
                <p className="text-xs text-[#414752] mt-0.5 leading-relaxed">
                  Posts shared within 2 hours of keynote sessions see a 3.4x higher engagement rate on LinkedIn. Tagging fellow attendees in the first comment drives further algorithmic visibility.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live LinkedIn Preview (6 cols on Desktop) */}
          <div className="lg:col-span-6 w-full flex flex-col gap-3 sticky top-20">
            {/* Header Bar with View Toggles and Char Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg font-bold text-[#1c1b1b]">Live LinkedIn Preview</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold">
                  Ready
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scheduled Queue Trigger Button */}
                <button
                  onClick={() => setIsQueueDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d5e3ff]/70 hover:bg-[#d5e3ff] text-[#001b3c] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  type="button"
                  title="View and manage scheduled draft queue"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#004e98]">event_upcoming</span>
                  <span>Scheduled Queue ({scheduledQueue.length})</span>
                </button>

                {/* Desktop / Mobile Toggle */}
                <div className="bg-[#f0eded] p-0.5 rounded-lg flex items-center shadow-inner">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                      previewMode === 'desktop'
                        ? 'bg-white text-[#004e98] shadow-xs'
                        : 'text-[#414752] hover:text-[#1c1b1b]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">computer</span>
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-white text-[#004e98] shadow-xs'
                        : 'text-[#414752] hover:text-[#1c1b1b]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">smartphone</span>
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Character Counter */}
                <div className="bg-[#f0eded] px-2.5 py-1 rounded-lg font-mono text-xs text-[#414752]">
                  <span className="font-bold text-[#004e98]">{postContent.length}</span> / 3,000
                </div>
              </div>
            </div>

            {/* Realistic LinkedIn Post Card Mockup */}
            <div
              className={`w-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-[390px] mx-auto ring-8 ring-gray-900/10' : ''
              }`}
            >
              {/* Post Author Header */}
              <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                      src={profile.avatarUrl}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#006c49] flex items-center justify-center ring-2 ring-white">
                      <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-title text-sm sm:text-base font-bold text-[#1c1b1b] truncate hover:underline cursor-pointer">
                        {profile.name}
                      </span>
                      <span className="text-[#414752] text-xs">• {profile.connectionDegree}</span>
                    </div>
                    <p className="text-xs text-[#414752] truncate max-w-[280px]">
                      {profile.headline}
                    </p>
                    <div className="flex items-center gap-1 text-[#414752] text-[11px] mt-0.5">
                      <span>Just now</span>
                      <span>•</span>
                      <span>Edited</span>
                      <span>•</span>
                      <span className="material-symbols-outlined text-[13px]">public</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="hidden sm:inline-flex items-center gap-1 text-[#004e98] hover:bg-[#d5e3ff]/30 px-2 py-1 rounded-md text-xs font-bold transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Follow</span>
                  </button>
                  <button
                    className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>
              </div>

              {/* Post Body Text Content */}
              <div className="px-4 sm:px-5 py-2 text-xs sm:text-sm text-[#1c1b1b] leading-relaxed flex flex-col gap-2 font-normal whitespace-pre-wrap select-text">
                {renderFormattedText(postContent)}
              </div>

              {/* Rich Media Attachment (Event Photo) */}
              <div className="px-4 sm:px-5 pt-2 pb-3">
                <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group shadow-xs">
                  <img
                    alt="Event summit attachment"
                    className="w-full h-auto max-h-[340px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    src={selectedPhoto.url}
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 text-white text-xs backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-[#6cf8bb]">
                      {selectedPhoto.isAiGenerated ? 'auto_awesome' : 'photo_camera'}
                    </span>
                    <span>{selectedPhoto.caption}</span>
                    {selectedPhoto.isAiGenerated && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-[#004e98] to-[#0466c2] text-white text-[9px] font-bold uppercase tracking-wider">
                        Imagen 3
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* LinkedIn Social Proof Counters */}
              <div className="px-4 sm:px-5 py-2 flex items-center justify-between text-[#414752] text-xs bg-[#f6f3f2]/60 border-t border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  {/* Reaction Cluster */}
                  <div className="flex items-center -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-[#004e98] flex items-center justify-center text-white shadow-2xs">
                      <span className="material-symbols-outlined text-[10px] fill">thumb_up</span>
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#006c49] flex items-center justify-center text-white shadow-2xs">
                      <span className="material-symbols-outlined text-[10px] fill">celebration</span>
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#ba1a1a] flex items-center justify-center text-white shadow-2xs">
                      <span className="material-symbols-outlined text-[10px] fill">favorite</span>
                    </span>
                  </div>
                  <span className="pl-1 font-medium">{reactionsCount} others</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    onClick={() => setShowComments(!showComments)}
                    className="hover:underline cursor-pointer"
                  >
                    {commentsList.length} comments
                  </span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">4 reposts</span>
                </div>
              </div>

              {/* Authentic LinkedIn Action Bar */}
              <div className="px-2 sm:px-4 py-1.5 grid grid-cols-4 gap-1 bg-white">
                <button
                  onClick={toggleLike}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg font-semibold text-xs transition-colors ${
                    isLiked
                      ? 'text-[#004e98] bg-[#d5e3ff]/30'
                      : 'text-[#414752] hover:bg-[#f0eded] hover:text-[#1c1b1b]'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'fill' : ''}`}>
                    thumb_up
                  </span>
                  <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[#414752] hover:bg-[#f0eded] hover:text-[#1c1b1b] font-semibold text-xs transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">comment</span>
                  <span className="hidden sm:inline">Comment</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[#414752] hover:bg-[#f0eded] hover:text-[#1c1b1b] font-semibold text-xs transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">repeat</span>
                  <span className="hidden sm:inline">Repost</span>
                </button>
                <button
                  onClick={handleOpenLinkedIn}
                  className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[#414752] hover:bg-[#f0eded] hover:text-[#1c1b1b] font-semibold text-xs transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {showComments && (
                <div className="p-4 bg-[#f6f3f2] border-t border-gray-100 flex flex-col gap-3">
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment on LinkedIn..."
                      value={newCommentInput}
                      onChange={(e) => setNewCommentInput(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#0466c2]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-full bg-[#004e98] text-white text-xs font-semibold"
                    >
                      Post
                    </button>
                  </form>
                  <div className="flex flex-col gap-2">
                    {commentsList.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-lg bg-white border border-gray-100 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1c1b1b]">{c.author}</span>
                          <span className="text-[10px] text-[#414752]">{c.time}</span>
                        </div>
                        <span className="text-[10px] text-[#414752]">{c.role}</span>
                        <p className="text-xs text-[#1c1b1b] mt-0.5">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Below Preview Card */}
            <div className="w-full flex flex-col gap-2 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Copy Post Text */}
                <button
                  onClick={handleCopyText}
                  className="w-full py-3 px-3 rounded-xl bg-white hover:bg-[#f6f3f2] text-[#004e98] text-xs sm:text-sm font-bold shadow-xs border border-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copyFeedback ? 'check' : 'content_copy'}
                  </span>
                  <span>{copyFeedback ? 'Copied!' : 'Copy Text'}</span>
                </button>

                {/* Schedule for Later */}
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="w-full py-3 px-3 rounded-xl bg-[#f0eded] hover:bg-[#eae7e7] text-[#001b3c] text-xs sm:text-sm font-bold shadow-xs border border-gray-200 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer"
                  type="button"
                  title="Queue post for peak event engagement windows"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#004e98]">schedule_send</span>
                  <span>Schedule for Later</span>
                </button>

                {/* Open in LinkedIn & Publish */}
                <button
                  onClick={handleOpenLinkedIn}
                  className="w-full py-3 px-3 rounded-xl bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer"
                  type="button"
                >
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span className="truncate">Publish to LinkedIn</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1 pt-1">
                {/* Regenerate Button */}
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1.5 text-[#414752] hover:text-[#004e98] text-xs font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-[#f0eded]"
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[17px] ${isGenerating ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>Regenerate Variant</span>
                </button>

                {/* Download Utility Link */}
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 text-[#414752] hover:text-[#1c1b1b] text-xs font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-[#f0eded]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px]">download</span>
                  <span>Download Image & Text (.txt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        postContent={postContent}
        tone={selectedTone}
        selectedPhoto={selectedPhoto}
        onScheduleConfirm={handleScheduleConfirm}
      />

      {/* Scheduled Queue Drawer */}
      <ScheduledQueueDrawer
        isOpen={isQueueDrawerOpen}
        onClose={() => setIsQueueDrawerOpen(false)}
        queue={scheduledQueue}
        onPublishNow={handlePublishNowFromQueue}
        onDelete={handleDeleteFromQueue}
        onSelectToEdit={handleSelectToEdit}
      />

      {/* Imagen Visual Studio Modal */}
      <ImagenStudioModal
        isOpen={isImagenModalOpen}
        onClose={() => setIsImagenModalOpen(false)}
        eventName={campaign.name}
        defaultHighlights={highlights}
        onImageGenerated={handleImageGeneratedFromImagen}
      />

      {/* Toast Notification */}
      {scheduleToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001b3c] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-slide-up border border-[#0466c2]/40">
          <span className="material-symbols-outlined text-[18px] text-[#6cf8bb]">event_available</span>
          <span>{scheduleToast}</span>
        </div>
      )}
    </div>
  );
};

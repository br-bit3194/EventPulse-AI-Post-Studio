import React, { useState } from 'react';
import { CampaignConfig, SharedPost } from '../types';

interface OrganizerViewProps {
  campaign: CampaignConfig;
  onUpdateCampaign: (updated: Partial<CampaignConfig>) => void;
  sharedPosts: SharedPost[];
  onCreateCampaignClick: () => void;
  onExportCsv: () => void;
  onSwitchToAttendeeView: () => void;
}

export const OrganizerView: React.FC<OrganizerViewProps> = ({
  campaign,
  onUpdateCampaign,
  sharedPosts,
  onCreateCampaignClick,
  onExportCsv,
  onSwitchToAttendeeView,
}) => {
  // Local edit states
  const [eventName, setEventName] = useState(campaign.name);
  const [format, setFormat] = useState<'hybrid' | 'in-person' | 'virtual'>(campaign.format);
  const [organizerName, setOrganizerName] = useState(campaign.organizerName);
  const [hashtags, setHashtags] = useState<string[]>(campaign.hashtags);
  const [linkedinUrl, setLinkedinUrl] = useState(campaign.socialLinks.linkedin);
  const [twitterHandle, setTwitterHandle] = useState(campaign.socialLinks.twitter);
  const [websiteUrl, setWebsiteUrl] = useState(campaign.socialLinks.website);
  const [isPublicAccess, setIsPublicAccess] = useState(campaign.isPublicAccess);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  // Copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaign.generatorSlug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Add hashtag
  const handleAddHashtag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = newTagInput.trim();
    if (!tag) return;
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formatted)) {
      setHashtags([...hashtags, formatted]);
    }
    setNewTagInput('');
    setShowAddTagInput(false);
  };

  // Remove hashtag
  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  // Save changes
  const handleSaveCampaign = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateCampaign({
        name: eventName,
        format,
        organizerName,
        hashtags,
        isPublicAccess,
        socialLinks: {
          linkedin: linkedinUrl,
          twitter: twitterHandle,
          website: websiteUrl,
        },
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 600);
  };

  // Reset changes
  const handleReset = () => {
    setEventName(campaign.name);
    setFormat(campaign.format);
    setOrganizerName(campaign.organizerName);
    setHashtags(campaign.hashtags);
    setLinkedinUrl(campaign.socialLinks.linkedin);
    setTwitterHandle(campaign.socialLinks.twitter);
    setWebsiteUrl(campaign.socialLinks.website);
    setIsPublicAccess(campaign.isPublicAccess);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Top Action & Status Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-xs font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
                Live Campaign
              </span>
              <span className="font-mono text-xs text-[#414752] font-medium tracking-tight">
                CAMPAIGN-ID: {campaign.id}
              </span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl text-[#1c1b1b] font-bold tracking-tight">
              Event Campaign Manager
            </h1>
            <p className="text-sm text-[#414752] max-w-2xl leading-relaxed">
              Configure your event details and distribute your branded LinkedIn generator link to speakers and attendees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] text-[#1c1b1b] text-xs font-semibold transition-all shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#414752]">download</span>
              <span>Export Analytics CSV</span>
            </button>
            <button
              onClick={onCreateCampaignClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0466c2] hover:bg-[#004e98] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create New Campaign</span>
            </button>
          </div>
        </div>

        {/* Real-Time Activity Status Pill Bar */}
        <div className="w-full bg-[#f6f3f2] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="inline-block h-6 w-6 rounded-full bg-[#d5e3ff] text-[#001b3c] flex items-center justify-center text-[10px] font-bold ring-2 ring-[#f6f3f2]">
                SL
              </div>
              <div className="inline-block h-6 w-6 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center text-[10px] font-bold ring-2 ring-[#f6f3f2]">
                MR
              </div>
              <div className="inline-block h-6 w-6 rounded-full bg-[#ffddb8] text-[#2a1700] flex items-center justify-center text-[10px] font-bold ring-2 ring-[#f6f3f2]">
                AK
              </div>
            </div>
            <p className="text-xs text-[#1c1b1b]">
              <span className="font-semibold text-[#006c49]">Campaign Status:</span> Live & Collecting Posts (
              <span className="font-semibold">{campaign.stats.postsCreated}</span> posts shared so far)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#414752]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006c49] animate-spin">sync</span>
              Auto-sync active
            </span>
            <span className="hidden sm:inline-block text-[#c1c6d4]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#0466c2]">speed</span>
              High viral momentum (+38/hr)
            </span>
          </div>
        </div>

        {/* Main Content Dual-Pane Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Create / Edit Event Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 sm:p-7 flex flex-col gap-6">
              {/* Card Header with Step Tracker */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d5e3ff] text-[#001b3c] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-headline text-lg font-bold text-[#1c1b1b]">Event Configuration</h2>
                    <p className="text-xs text-[#414752]">Core details ingested by the post generator model</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f0eded] text-xs text-[#414752] font-semibold">
                  Step 1 of 2
                </span>
              </div>

              {/* Form Fields Container */}
              <div className="flex flex-col gap-5">
                {/* Event Name & Format Switcher */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider" htmlFor="event-title">
                      Event Name
                    </label>
                    <div className="flex items-center gap-1 bg-[#f6f3f2] p-0.5 rounded-full">
                      <button
                        onClick={() => setFormat('hybrid')}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                          format === 'hybrid'
                            ? 'bg-white text-[#004e98] shadow-xs'
                            : 'text-[#414752] hover:text-[#1c1b1b]'
                        }`}
                        type="button"
                      >
                        Hybrid
                      </button>
                      <button
                        onClick={() => setFormat('in-person')}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                          format === 'in-person'
                            ? 'bg-white text-[#004e98] shadow-xs'
                            : 'text-[#414752] hover:text-[#1c1b1b]'
                        }`}
                        type="button"
                      >
                        In-Person
                      </button>
                      <button
                        onClick={() => setFormat('virtual')}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                          format === 'virtual'
                            ? 'bg-white text-[#004e98] shadow-xs'
                            : 'text-[#414752] hover:text-[#1c1b1b]'
                        }`}
                        type="button"
                      >
                        Virtual
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-[#f6f3f2] focus:bg-white text-[#1c1b1b] text-sm rounded-lg px-4 py-2.5 outline-none transition-all border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20 font-medium"
                      id="event-title"
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Organizer / Company Name with Verified Badge */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider" htmlFor="organizer-name">
                    Organizer / Host Entity
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-[#f6f3f2] focus:bg-white text-[#1c1b1b] text-sm rounded-lg pl-4 pr-10 py-2.5 outline-none transition-all border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20 font-medium"
                      id="organizer-name"
                      type="text"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                    />
                    <span
                      className="absolute right-3 material-symbols-outlined text-[#004e98] text-[20px] fill"
                      title="Verified Organizer Account"
                    >
                      verified
                    </span>
                  </div>
                </div>

                {/* Event Hashtags Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                      Event Campaign Hashtags
                    </label>
                    <span className="text-xs text-[#414752]">AI auto-injects these in outputs</span>
                  </div>
                  <div className="p-2.5 bg-[#f6f3f2] rounded-lg flex flex-wrap items-center gap-2">
                    {hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#004e98] text-xs font-semibold shadow-xs border border-gray-100"
                      >
                        <span>{tag}</span>
                        <button
                          className="text-[#414752] hover:text-[#ba1a1a] transition-colors"
                          onClick={() => handleRemoveHashtag(tag)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}

                    {showAddTagInput ? (
                      <form onSubmit={handleAddHashtag} className="inline-flex items-center gap-1">
                        <input
                          autoFocus
                          type="text"
                          placeholder="#Tag"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onBlur={() => {
                            if (!newTagInput) setShowAddTagInput(false);
                          }}
                          className="px-2.5 py-1 text-xs rounded-full bg-white border border-[#0466c2] text-[#1c1b1b] outline-none w-28"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1 text-xs rounded-full bg-[#004e98] text-white font-semibold"
                        >
                          Add
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowAddTagInput(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f0eded] hover:bg-[#eae7e7] text-[#414752] text-xs font-semibold transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        <span>Add tag</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="pt-2 flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                    Official Social & Landing Anchors
                  </span>

                  {/* LinkedIn Company Link */}
                  <div className="flex flex-col gap-1">
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center justify-center text-[#0466c2]">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 0 0 0-3.3 1.66 1.66 0 0 0 0 3.3m1.37 9.74V9.89H5.1v8.61h2.73z" />
                        </svg>
                      </div>
                      <input
                        className="w-full bg-[#f6f3f2] focus:bg-white text-[#1c1b1b] text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20"
                        placeholder="LinkedIn Company URL"
                        type="text"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* X / Twitter Link */}
                  <div className="flex flex-col gap-1">
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center justify-center text-[#414752]">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <input
                        className="w-full bg-[#f6f3f2] focus:bg-white text-[#1c1b1b] text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20"
                        placeholder="X / Twitter Handle"
                        type="text"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Official Website */}
                  <div className="flex flex-col gap-1">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 material-symbols-outlined text-[18px] text-[#414752]">
                        language
                      </span>
                      <input
                        className="w-full bg-[#f6f3f2] focus:bg-white text-[#1c1b1b] text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all border border-transparent focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20"
                        placeholder="Official Summit URL"
                        type="text"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Campaign Prompt Rules & Persona Tone (Step 2 Preview) */}
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col gap-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px] text-[#004e98]">auto_fix_high</span>
                      AI Generation Tone Guardrails
                    </span>
                    <span className="font-mono text-xs text-[#006c49] font-bold">Optimal Precision</span>
                  </div>
                  <p className="text-xs text-[#414752] leading-relaxed">
                    Attendee posts will naturally adopt high-conversion professional formats (Key Takeaways, Speaker Spotlight, and VIP Network invitations) while adhering strictly to your company branding.
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg text-[#414752] hover:text-[#1c1b1b] hover:bg-[#f0eded] text-xs font-semibold transition-colors"
                    type="button"
                  >
                    Reset Changes
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveCampaign}
                      disabled={isSaving}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] ${
                        saveSuccess ? 'bg-[#006c49]' : 'bg-[#0466c2] hover:bg-[#004e98]'
                      }`}
                      type="button"
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                          <span>Saving Changes...</span>
                        </>
                      ) : saveSuccess ? (
                        <>
                          <span className="material-symbols-outlined text-[18px]">done_all</span>
                          <span>Saved & Published!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">check</span>
                          <span>Save & Update Campaign</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Event Overview & Metrics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
            {/* Main Event Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden flex flex-col">
              {/* Event Visual Header */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  alt="Summit stage"
                  className="w-full h-full object-cover"
                  src={campaign.bannerImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-bold uppercase tracking-wider">
                      Active Now
                    </span>
                    <span className="text-xs text-white/95 font-medium drop-shadow-xs">
                      {campaign.dates}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-white drop-shadow-xs truncate">
                    {campaign.name}
                  </h3>
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                    <span>{campaign.location} • {campaign.organizerName.split(' ')[0]}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-5">
                {/* Attendee Generator Share Link section */}
                <div className="p-4 rounded-xl bg-[#f6f3f2] flex flex-col gap-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px] text-[#004e98]">link</span>
                      Attendee Generator Portal Link
                    </span>
                    <button
                      onClick={() => setShowQrModal(!showQrModal)}
                      className={`p-1.5 rounded transition-colors ${
                        showQrModal ? 'bg-[#004e98] text-white' : 'text-[#414752] hover:bg-[#eae7e7]'
                      }`}
                      title="Toggle Portal QR Code"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    </button>
                  </div>

                  {/* Input with Copy Button */}
                  <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-gray-200 shadow-2xs">
                    <input
                      className="flex-1 bg-transparent px-2.5 py-1.5 text-[#1c1b1b] font-mono text-xs outline-none select-all truncate"
                      readOnly
                      type="text"
                      value={campaign.generatorSlug}
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all active:scale-95 shadow-2xs ${
                        copiedLink ? 'bg-[#004e98]' : 'bg-[#006c49] hover:bg-[#005236]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copiedLink ? 'done' : 'content_copy'}
                      </span>
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  {/* Popover QR Box */}
                  {showQrModal && (
                    <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-3 animate-fade-in shadow-xs">
                      {/* Realistic SVG QR Code pattern */}
                      <div className="w-16 h-16 bg-[#1c1b1b] p-1.5 rounded flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                          <path d="M2 2h8v8H2V2m2 2v4h4V4H4m10-2h8v8h-8V2m2 2v4h4V4h-4M2 14h8v8H2v-8m2 2v4h4v-4H4m10 0h2v2h-2v-2m4 0h2v2h-2v-2m-4 4h2v2h-2v-2m4 0h2v2h-2v-2m-2-2h2v2h-2v-2m-2-4h2v2h-2v-2m4 0h2v2h-2v-2" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1c1b1b]">Live Stage Slide QR</span>
                        <span className="text-[11px] text-[#414752]">Attendees scan & generate posts in under 30s</span>
                        <button
                          onClick={onSwitchToAttendeeView}
                          className="text-[11px] text-[#004e98] font-bold hover:underline mt-1 text-left"
                        >
                          Preview Attendee Experience →
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-1.5 text-[#414752]">
                    <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5 text-[#004e98]">
                      tips_and_updates
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Share this link in your attendee emails, on stage slides, or badge lanyards.
                    </p>
                  </div>
                </div>

                {/* Metric Impact 2x2 Grid */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                    Campaign Performance Snapshot
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Metric 1: Total Posts */}
                    <div className="bg-[#f6f3f2] p-3.5 rounded-xl flex flex-col justify-between border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#414752]">Posts Created</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#6cf8bb]/40 text-[#00714d]">
                          {campaign.stats.postsGrowth}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline text-2xl font-bold text-[#1c1b1b] leading-tight">
                          {campaign.stats.postsCreated.toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-[#414752] mt-0.5">Published to LinkedIn</span>
                      </div>
                    </div>

                    {/* Metric 2: Estimated Impressions */}
                    <div className="bg-[#f6f3f2] p-3.5 rounded-xl flex flex-col justify-between border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#414752]">LinkedIn Reach</span>
                        <span className="material-symbols-outlined text-[16px] text-[#004e98]">visibility</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline text-2xl font-bold text-[#004e98] leading-tight">
                          {campaign.stats.reachCount}
                        </span>
                        <span className="block text-[11px] text-[#414752] mt-0.5">Est. Organic Impressions</span>
                      </div>
                    </div>

                    {/* Metric 3: Active Speakers & VIPs */}
                    <div className="bg-[#f6f3f2] p-3.5 rounded-xl flex flex-col justify-between border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#414752]">Keynote & VIPs</span>
                        <span className="material-symbols-outlined text-[16px] text-[#704500]">stars</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline text-2xl font-bold text-[#1c1b1b] leading-tight">
                          {campaign.stats.vipCount}
                        </span>
                        <span className="block text-[11px] text-[#414752] mt-0.5">Sharing official updates</span>
                      </div>
                    </div>

                    {/* Metric 4: Engagement Rate */}
                    <div className="bg-[#f6f3f2] p-3.5 rounded-xl flex flex-col justify-between border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#414752]">Viral Coefficient</span>
                        <span className="material-symbols-outlined text-[16px] text-[#006c49]">trending_up</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline text-2xl font-bold text-[#006c49] leading-tight">
                          {campaign.stats.viralRate}
                        </span>
                        <span className="block text-[11px] text-[#414752] mt-0.5">Avg feed interaction</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Live Posts Activity Stream */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                      Recent Attendee Shared Posts
                    </span>
                    <span className="text-[11px] text-[#006c49] flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-ping"></span> Live Feed
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {sharedPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 rounded-lg bg-[#f6f3f2] flex flex-col gap-1.5 hover:bg-[#eae7e7] transition-colors border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#d5e3ff] text-[#001b3c] flex items-center justify-center font-bold text-xs">
                              {post.authorInitials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#1c1b1b] leading-tight">
                                {post.authorName}
                              </span>
                              <span className="text-[10px] text-[#414752]">
                                {post.authorRole} {post.authorCompany ? `• ${post.authorCompany}` : ''}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#414752]">{post.timeAgo}</span>
                        </div>

                        <p className="text-xs text-[#1c1b1b] line-clamp-2 italic leading-relaxed">
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[#414752]">
                            {post.reactions} reactions • {post.comments} comments
                          </span>
                          <a
                            className="inline-flex items-center gap-1 text-[11px] text-[#004e98] font-bold hover:underline"
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View on LinkedIn</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Public Access Toggle Section */}
                <div className="pt-2 flex items-center justify-between bg-[#f6f3f2]/60 p-3 rounded-lg border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1c1b1b]">Attendee Generator Access</span>
                    <span className="text-[11px] text-[#414752]">Public (Instant generation without login)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={isPublicAccess}
                      onChange={(e) => setIsPublicAccess(e.target.checked)}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-[#e5e2e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c49]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

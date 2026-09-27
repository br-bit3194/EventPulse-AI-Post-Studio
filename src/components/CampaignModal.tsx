import React, { useState, useEffect, useId } from 'react';
import { CampaignConfig } from '../types';
import { ASSETS } from '../constants';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (campaign: CampaignConfig) => void;
}

const PRESET_VENUES = [
  'Moscone Center (San Francisco, CA)',
  'San Jose McEnery Convention Center (San Jose, CA)',
  'Austin Convention Center (Austin, TX)',
  'Jacob K. Javits Convention Center (New York, NY)',
  'McCormick Place (Chicago, IL)',
  'The Venetian Expo & Convention Center (Las Vegas, NV)',
  'ExCeL London (London, UK)',
  'Marina Bay Sands Expo & Convention Centre (Singapore)',
  'Messe Frankfurt (Frankfurt, Germany)',
  'Santa Clara Convention Center (Santa Clara, CA)',
  'Boston Convention and Exhibition Center (Boston, MA)',
  'Virtual Broadcast Studio / Spatial Stage',
];

const PRESET_LOCATIONS = [
  'San Francisco, CA, USA',
  'San Jose, CA, USA',
  'Austin, TX, USA',
  'New York, NY, USA',
  'Seattle, WA, USA',
  'Boston, MA, USA',
  'Los Angeles, CA, USA',
  'Chicago, IL, USA',
  'Las Vegas, NV, USA',
  'London, United Kingdom',
  'Berlin, Germany',
  'Paris, France',
  'Singapore',
  'Tokyo, Japan',
  'Bengaluru, Karnataka, India',
  'Toronto, ON, Canada',
  'Virtual / Worldwide',
];

// Helper to format human-readable event date strings
function formatEventDates(startStr: string, endStr: string): string {
  if (!startStr) return 'TBD';
  const start = new Date(startStr + 'T00:00:00');
  if (isNaN(start.getTime())) return startStr;

  if (!endStr || startStr === endStr) {
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const end = new Date(endStr + 'T00:00:00');
  if (isNaN(end.getTime())) return startStr;

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

// Generate smart heuristic tags instantaneously based on event name, venue, and city
function getSmartInitialHashtags(eventName: string, venue: string, location: string): string[] {
  const tags: string[] = [];
  const cleanName = eventName.replace(/[^a-zA-Z0-9]/g, '');

  if (cleanName.length > 2) {
    tags.push(`#${cleanName}`);
    tags.push(`#${cleanName}2026`);
    tags.push(`#${cleanName}Live`);
  }

  const lowerName = eventName.toLowerCase();
  if (lowerName.includes('ai') || lowerName.includes('neural') || lowerName.includes('agent')) {
    tags.push('#AgenticAI', '#GenerativeAI', '#EnterpriseAI');
  } else if (lowerName.includes('cloud') || lowerName.includes('dev') || lowerName.includes('scale')) {
    tags.push('#CloudArchitecture', '#DevOps', '#TechScale');
  } else {
    tags.push('#TechInnovation', '#TechSummit', '#FutureOfTech');
  }

  // Location based
  if (location.toLowerCase().includes('san francisco') || location.toLowerCase().includes('sf')) {
    tags.push('#SFTech', '#SiliconValleyTech');
  } else if (location.toLowerCase().includes('austin')) {
    tags.push('#AustinTech');
  } else if (location.toLowerCase().includes('new york') || location.toLowerCase().includes('nyc')) {
    tags.push('#NYCTech');
  } else if (location.toLowerCase().includes('london')) {
    tags.push('#LondonTechWeek');
  } else if (location.toLowerCase().includes('singapore')) {
    tags.push('#SGTech');
  }

  return Array.from(new Set(tags));
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  // Generate date defaults 2 weeks from now
  const now = new Date();
  const defaultStartDate = new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0];
  const defaultEndDate = new Date(now.getTime() + 16 * 86400000).toISOString().split('T')[0];

  // Core Form State
  const [name, setName] = useState('');
  const [format, setFormat] = useState<'hybrid' | 'in-person' | 'virtual'>('in-person');
  const [organizerName, setOrganizerName] = useState('');

  // Date Picker State
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Venue State (Dropdown + Option to Add Custom)
  const [venueOptions, setVenueOptions] = useState<string[]>(PRESET_VENUES);
  const [selectedVenue, setSelectedVenue] = useState<string>(PRESET_VENUES[0]);
  const [isAddingCustomVenue, setIsAddingCustomVenue] = useState(false);
  const [customVenueName, setCustomVenueName] = useState('');
  const [customVenueRoom, setCustomVenueRoom] = useState('');

  // Location / City / State State (Dropdown + Option to Add Custom)
  const [locationOptions, setLocationOptions] = useState<string[]>(PRESET_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<string>(PRESET_LOCATIONS[0]);
  const [isAddingCustomLocation, setIsAddingCustomLocation] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');
  const [customCountry, setCustomCountry] = useState('USA');

  // Hashtags State
  const [activeHashtags, setActiveHashtags] = useState<string[]>([
    '#TechSummit2026',
    '#Innovation',
    '#AILeader',
  ]);
  const [suggestedTags, setSuggestedTags] = useState<{ tag: string; volume?: string; score?: number }[]>([
    { tag: '#AgenticAI', volume: '142K', score: 98 },
    { tag: '#TechLeadership', volume: '340K', score: 95 },
    { tag: '#EnterpriseAI', volume: '210K', score: 92 },
    { tag: '#FutureOfTech', volume: '410K', score: 88 },
  ]);
  const [manualTagInput, setManualTagInput] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  // Unique IDs for accessibility
  const eventNameId = useId();
  const organizerId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const venueSelectId = useId();
  const locationSelectId = useId();

  // Calculate duration in days
  const startObj = new Date(startDate + 'T00:00:00');
  const endObj = new Date(endDate + 'T00:00:00');
  const diffDays = Math.max(1, Math.round((endObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  // Quick duration setter
  const setDurationDays = (days: number) => {
    if (!startDate) return;
    const base = new Date(startDate + 'T00:00:00');
    const newEnd = new Date(base.getTime() + (days - 1) * 86400000);
    setEndDate(newEnd.toISOString().split('T')[0]);
  };

  // Helper to add custom venue
  const handleApplyCustomVenue = () => {
    if (!customVenueName.trim()) return;
    const fullVenue = customVenueRoom.trim()
      ? `${customVenueName.trim()} (${customVenueRoom.trim()})`
      : customVenueName.trim();

    if (!venueOptions.includes(fullVenue)) {
      setVenueOptions([fullVenue, ...venueOptions]);
    }
    setSelectedVenue(fullVenue);
    setIsAddingCustomVenue(false);
    setCustomVenueName('');
    setCustomVenueRoom('');
  };

  // Helper to add custom location / city / state
  const handleApplyCustomLocation = () => {
    if (!customCity.trim()) return;
    const parts = [customCity.trim()];
    if (customState.trim()) parts.push(customState.trim());
    if (customCountry.trim()) parts.push(customCountry.trim());
    const fullLoc = parts.join(', ');

    if (!locationOptions.includes(fullLoc)) {
      setLocationOptions([fullLoc, ...locationOptions]);
    }
    setSelectedLocation(fullLoc);
    setIsAddingCustomLocation(false);
    setCustomCity('');
    setCustomState('');
  };

  // Automatic AI Hashtag Generator (backend call with client heuristic backup)
  const generateHashtagSuggestions = async (nameToUse?: string, venueToUse?: string, locToUse?: string) => {
    const currentName = nameToUse !== undefined ? nameToUse : name;
    const currentVenue = venueToUse !== undefined ? venueToUse : selectedVenue;
    const currentLoc = locToUse !== undefined ? locToUse : selectedLocation;

    setIsGeneratingTags(true);

    // Immediate instant heuristics so the user sees results right away
    const heuristics = getSmartInitialHashtags(currentName || 'Tech Summit', currentVenue, currentLoc);
    const initialSuggestions = heuristics
      .filter((t) => !activeHashtags.includes(t))
      .map((tag, idx) => ({
        tag,
        volume: `${80 + idx * 45}K`,
        score: Math.max(75, 98 - idx * 4),
      }));

    if (initialSuggestions.length > 0) {
      setSuggestedTags(initialSuggestions);
    }

    try {
      const res = await fetch('/api/suggest-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: currentName || 'Tech Conference',
          keywords: `${currentVenue} ${currentLoc}`,
          existingTags: activeHashtags,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          const formatted = data.suggestions
            .filter((s: any) => !activeHashtags.includes(s.tag))
            .map((s: any) => ({
              tag: s.tag.startsWith('#') ? s.tag : `#${s.tag}`,
              volume: s.volume || '150K',
              score: s.score || 90,
            }));
          if (formatted.length > 0) {
            setSuggestedTags(formatted);
          }
        }
      }
    } catch (err) {
      console.warn('Backend hashtag suggest fell back to heuristic suggestions:', err);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  // Debounced auto-generation when event name or location changes
  useEffect(() => {
    if (!name.trim()) return;
    const timer = setTimeout(() => {
      generateHashtagSuggestions(name, selectedVenue, selectedLocation);
    }, 600);
    return () => clearTimeout(timer);
  }, [name, selectedVenue, selectedLocation]);

  // Add a suggested tag to active tags
  const handleAddSuggestedTag = (tagToAdd: string) => {
    if (!activeHashtags.includes(tagToAdd)) {
      setActiveHashtags([...activeHashtags, tagToAdd]);
    }
    setSuggestedTags(suggestedTags.filter((s) => s.tag !== tagToAdd));
  };

  // Add all suggested tags
  const handleAddAllSuggestions = () => {
    const newTags = suggestedTags.map((s) => s.tag).filter((t) => !activeHashtags.includes(t));
    setActiveHashtags([...activeHashtags, ...newTags]);
    setSuggestedTags([]);
  };

  // Remove tag from active
  const handleRemoveActiveTag = (tagToRemove: string) => {
    setActiveHashtags(activeHashtags.filter((t) => t !== tagToRemove));
  };

  // Manual hashtag addition
  const handleAddManualTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = manualTagInput.trim();
    if (!clean) return;
    const formatted = clean.startsWith('#') ? clean : `#${clean}`;
    if (!activeHashtags.includes(formatted)) {
      setActiveHashtags([...activeHashtags, formatted]);
    }
    setManualTagInput('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedDates = formatEventDates(startDate, endDate);
    const slug = `https://eventpulse.ai/p/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    // Extract city & state if possible
    const locParts = selectedLocation.split(',').map((p) => p.trim());
    const city = locParts[0] || selectedLocation;
    const state = locParts[1] || '';

    const newCampaign: CampaignConfig = {
      id: `CAMP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      format,
      dates: formattedDates,
      startDate,
      endDate,
      venue: selectedVenue,
      location: selectedLocation,
      city,
      state,
      organizerName: organizerName.trim() || 'Global Media Group',
      isOrganizerVerified: true,
      hashtags: activeHashtags.length > 0 ? activeHashtags : ['#EventPulse2026'],
      socialLinks: {
        linkedin: `linkedin.com/company/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        twitter: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      },
      generatorSlug: slug,
      isPublicAccess: true,
      bannerImage: ASSETS.stagePhoto,
      stats: {
        postsCreated: 0,
        postsGrowth: '+0%',
        reachCount: '0',
        reachNumeric: 0,
        vipCount: '0 / 20',
        viralRate: '0.0%',
      },
    };

    onCreate(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 flex flex-col gap-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#004e98] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">campaign</span>
            </div>
            <div>
              <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b]">
                Create New Event Campaign
              </h2>
              <p className="text-xs text-[#414752]">
                Configure dates, venue, location & AI-powered viral hashtags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs sm:text-sm">
          {/* SECTION 1: Event Name & Format */}
          <div className="flex flex-col gap-3 p-4 bg-[#fcf9f8] rounded-xl border border-gray-100">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={eventNameId} className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004e98]">event</span>
                Event Name *
              </label>
              <input
                id={eventNameId}
                type="text"
                required
                placeholder="e.g. CloudScale AI Summit 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:border-[#0466c2] focus:ring-2 focus:ring-[#0466c2]/20 text-[#1c1b1b] outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Event Format */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                  Event Format
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormat('in-person')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
                      format === 'in-person'
                        ? 'bg-[#004e98] text-white shadow-xs'
                        : 'text-[#414752] hover:bg-gray-50'
                    }`}
                  >
                    In-Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('hybrid')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
                      format === 'hybrid'
                        ? 'bg-[#004e98] text-white shadow-xs'
                        : 'text-[#414752] hover:bg-gray-50'
                    }`}
                  >
                    Hybrid
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('virtual')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
                      format === 'virtual'
                        ? 'bg-[#004e98] text-white shadow-xs'
                        : 'text-[#414752] hover:bg-gray-50'
                    }`}
                  >
                    Virtual
                  </button>
                </div>
              </div>

              {/* Organizer / Host */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={organizerId} className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
                  Organizer / Host Entity
                </label>
                <input
                  id={organizerId}
                  type="text"
                  placeholder="e.g. CloudScale Media & Ventures"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="bg-white p-2.5 rounded-lg border border-gray-200 focus:border-[#0466c2] text-[#1c1b1b] outline-none text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Date Picker */}
          <div className="flex flex-col gap-3 p-4 bg-[#fcf9f8] rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004e98]">calendar_month</span>
                Event Dates (Date Picker)
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d5e3ff] text-[#001b3c] text-[11px] font-bold">
                🗓️ {formatEventDates(startDate, endDate)} ({diffDays} {diffDays === 1 ? 'day' : 'days'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={startDateId} className="text-[11px] font-semibold text-[#414752]">Start Date</label>
                <input
                  id={startDateId}
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartDate(newStart);
                    if (newStart > endDate) {
                      setEndDate(newStart);
                    }
                  }}
                  className="bg-white p-2.5 rounded-lg border border-gray-200 focus:border-[#0466c2] text-[#1c1b1b] outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor={endDateId} className="text-[11px] font-semibold text-[#414752]">End Date</label>
                <input
                  id={endDateId}
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white p-2.5 rounded-lg border border-gray-200 focus:border-[#0466c2] text-[#1c1b1b] outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Quick Duration Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#414752] font-medium mr-1">Quick Duration:</span>
              <button
                type="button"
                onClick={() => setDurationDays(1)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  diffDays === 1 ? 'bg-[#004e98] text-white font-bold' : 'bg-white text-[#414752] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                1 Day (Single)
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(2)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  diffDays === 2 ? 'bg-[#004e98] text-white font-bold' : 'bg-white text-[#414752] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                2 Days
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(3)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  diffDays === 3 ? 'bg-[#004e98] text-white font-bold' : 'bg-white text-[#414752] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                3 Days
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(4)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  diffDays === 4 ? 'bg-[#004e98] text-white font-bold' : 'bg-white text-[#414752] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                4 Days
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(7)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  diffDays === 7 ? 'bg-[#004e98] text-white font-bold' : 'bg-white text-[#414752] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                1 Week
              </button>
            </div>
          </div>

          {/* SECTION 3: Venue Details Dropdown & Option to Add Custom */}
          <div className="flex flex-col gap-3 p-4 bg-[#fcf9f8] rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label htmlFor={venueSelectId} className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004e98]">apartment</span>
                Venue Details
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomVenue(!isAddingCustomVenue)}
                className="text-xs text-[#0466c2] hover:text-[#004e98] font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isAddingCustomVenue ? 'expand_less' : 'add_circle'}
                </span>
                {isAddingCustomVenue ? 'Cancel Custom Venue' : '+ Add Custom Venue'}
              </button>
            </div>

            {/* Venue Dropdown */}
            <div className="relative">
              <select
                id={venueSelectId}
                value={isAddingCustomVenue ? '__custom__' : selectedVenue}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsAddingCustomVenue(true);
                  } else {
                    setSelectedVenue(e.target.value);
                    setIsAddingCustomVenue(false);
                  }
                }}
                className="w-full bg-white p-2.5 rounded-lg border border-gray-200 focus:border-[#0466c2] text-[#1c1b1b] outline-none text-xs sm:text-sm font-medium"
              >
                {venueOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
                <option value="__custom__" className="font-bold text-[#004e98]">
                  + Add New Custom Venue...
                </option>
              </select>
            </div>

            {/* Custom Venue Input Box */}
            {isAddingCustomVenue && (
              <div className="p-3 bg-white rounded-lg border border-[#0466c2]/30 flex flex-col gap-2.5 shadow-xs animate-fade-in">
                <div className="text-xs font-bold text-[#004e98] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">domain_add</span>
                  Add New Custom Venue
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Venue Name (e.g. San Francisco Marriott Marquis)"
                    value={customVenueName}
                    onChange={(e) => setCustomVenueName(e.target.value)}
                    className="p-2 text-xs bg-[#f6f3f2] rounded border border-gray-200 outline-none focus:border-[#0466c2]"
                  />
                  <input
                    type="text"
                    placeholder="Room / Hall / Suite (e.g. Grand Ballroom A)"
                    value={customVenueRoom}
                    onChange={(e) => setCustomVenueRoom(e.target.value)}
                    className="p-2 text-xs bg-[#f6f3f2] rounded border border-gray-200 outline-none focus:border-[#0466c2]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomVenue(false)}
                    className="px-3 py-1 text-xs text-[#414752] hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!customVenueName.trim()}
                    onClick={handleApplyCustomVenue}
                    className="px-3 py-1 text-xs font-bold bg-[#004e98] hover:bg-[#004e98]/90 disabled:opacity-50 text-white rounded shadow-xs"
                  >
                    Save & Select Venue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Location / City / State Dropdown & Option to Add Custom */}
          <div className="flex flex-col gap-3 p-4 bg-[#fcf9f8] rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label htmlFor={locationSelectId} className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004e98]">location_on</span>
                Location / City / State
              </label>
              <button
                type="button"
                onClick={() => setIsAddingCustomLocation(!isAddingCustomLocation)}
                className="text-xs text-[#0466c2] hover:text-[#004e98] font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isAddingCustomLocation ? 'expand_less' : 'add_circle'}
                </span>
                {isAddingCustomLocation ? 'Cancel Custom Location' : '+ Add Custom City/State'}
              </button>
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <select
                id={locationSelectId}
                value={isAddingCustomLocation ? '__custom__' : selectedLocation}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsAddingCustomLocation(true);
                  } else {
                    setSelectedLocation(e.target.value);
                    setIsAddingCustomLocation(false);
                  }
                }}
                className="w-full bg-white p-2.5 rounded-lg border border-gray-200 focus:border-[#0466c2] text-[#1c1b1b] outline-none text-xs sm:text-sm font-medium"
              >
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="__custom__" className="font-bold text-[#004e98]">
                  + Add New City / State / Country...
                </option>
              </select>
            </div>

            {/* Custom Location Inputs */}
            {isAddingCustomLocation && (
              <div className="p-3 bg-white rounded-lg border border-[#0466c2]/30 flex flex-col gap-2.5 shadow-xs animate-fade-in">
                <div className="text-xs font-bold text-[#004e98] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
                  Add Custom City / State / Location
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City (e.g. Miami)"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="p-2 text-xs bg-[#f6f3f2] rounded border border-gray-200 outline-none focus:border-[#0466c2]"
                  />
                  <input
                    type="text"
                    placeholder="State / Region (e.g. FL)"
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    className="p-2 text-xs bg-[#f6f3f2] rounded border border-gray-200 outline-none focus:border-[#0466c2]"
                  />
                  <input
                    type="text"
                    placeholder="Country (e.g. USA)"
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    className="p-2 text-xs bg-[#f6f3f2] rounded border border-gray-200 outline-none focus:border-[#0466c2]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomLocation(false)}
                    className="px-3 py-1 text-xs text-[#414752] hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!customCity.trim()}
                    onClick={handleApplyCustomLocation}
                    className="px-3 py-1 text-xs font-bold bg-[#004e98] hover:bg-[#004e98]/90 disabled:opacity-50 text-white rounded shadow-xs"
                  >
                    Save & Select Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: Automatically Generated / Suggested Hashtags */}
          <div className="flex flex-col gap-3 p-4 bg-[#fcf9f8] rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#004e98]">tag</span>
                Campaign Hashtags (AI Auto-Suggested)
              </label>
              <button
                type="button"
                onClick={() => generateHashtagSuggestions()}
                disabled={isGeneratingTags}
                className="text-xs font-semibold text-[#0466c2] hover:text-[#004e98] flex items-center gap-1 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${isGeneratingTags ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                {isGeneratingTags ? 'Generating...' : 'Refresh Suggestions'}
              </button>
            </div>

            {/* Active Selected Hashtags */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#414752]">Active Campaign Hashtags:</span>
              <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-2 bg-white rounded-lg border border-gray-200">
                {activeHashtags.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">No hashtags added yet. Select suggestions below or type your own.</span>
                ) : (
                  activeHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#d5e3ff] text-[#001b3c] text-xs font-bold tracking-tight shadow-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveActiveTag(tag)}
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full"
                      >
                        <span className="material-symbols-outlined text-[14px] leading-none">close</span>
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* AI Suggested Hashtags Chips Shelf */}
            {suggestedTags.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#006c49] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Suggested for your event (Click to add):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAllSuggestions}
                    className="text-[11px] font-bold text-[#004e98] hover:underline"
                  >
                    + Add All Suggestions
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {suggestedTags.map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleAddSuggestedTag(item.tag)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#e8f0fe] border border-gray-200 hover:border-[#004e98] text-[#1c1b1b] text-xs font-medium transition-all group shadow-xs active:scale-95"
                    >
                      <span className="text-[#004e98] font-bold">+</span>
                      <span>{item.tag}</span>
                      {item.volume && (
                        <span className="text-[10px] text-gray-400 group-hover:text-[#004e98]">
                          • {item.volume}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Hashtag Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Type custom hashtag (e.g. #Keynote2026) and press Enter"
                value={manualTagInput}
                onChange={(e) => setManualTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddManualTag();
                  }
                }}
                className="flex-1 bg-white p-2 rounded-lg border border-gray-200 focus:border-[#0466c2] text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddManualTag()}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[#1c1b1b] text-xs font-semibold rounded-lg transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#414752] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

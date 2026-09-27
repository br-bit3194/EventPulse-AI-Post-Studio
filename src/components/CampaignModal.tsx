import React, { useState } from 'react';
import { CampaignConfig } from '../types';
import { ASSETS } from '../constants';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (campaign: CampaignConfig) => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [format, setFormat] = useState<'hybrid' | 'in-person' | 'virtual'>('in-person');
  const [organizerName, setOrganizerName] = useState('');
  const [dates, setDates] = useState('Nov 12-14, 2025');
  const [location, setLocation] = useState('San Francisco, CA');
  const [hashtagsStr, setHashtagsStr] = useState('#TechSummit2025 #Innovation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = hashtagsStr
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const slug = `https://eventpulse.ai/p/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const newCampaign: CampaignConfig = {
      id: `CAMP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      format,
      dates,
      location,
      organizerName: organizerName.trim() || 'Global Media Group',
      isOrganizerVerified: true,
      hashtags: tags.length ? tags : ['#EventPulse2025'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#004e98]">add_circle</span>
            <h2 className="font-headline text-lg font-bold text-[#1c1b1b]">
              Create New Event Campaign
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Event Name</label>
            <input
              type="text"
              required
              placeholder="e.g. CloudScale World 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent focus:border-[#0466c2] text-[#1c1b1b] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1c1b1b] uppercase">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="bg-[#f6f3f2] p-2.5 rounded-lg text-[#1c1b1b] outline-none"
              >
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1c1b1b] uppercase">Dates</label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent text-[#1c1b1b] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Organizer / Host</label>
            <input
              type="text"
              placeholder="e.g. CloudScale Media & Ventures"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent focus:border-[#0466c2] text-[#1c1b1b] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent text-[#1c1b1b] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Official Hashtags (space separated)</label>
            <input
              type="text"
              value={hashtagsStr}
              onChange={(e) => setHashtagsStr(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent text-[#1c1b1b] outline-none font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#414752] hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-sm"
            >
              Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

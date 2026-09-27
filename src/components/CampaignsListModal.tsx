import React, { useState } from 'react';
import { CampaignConfig } from '../types';

interface CampaignsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CampaignConfig[];
  activeCampaignId: string;
  onSelectCampaign: (campaign: CampaignConfig) => void;
  onOpenCreateCampaign: () => void;
  onOpenAttendeePortal: (campaign: CampaignConfig) => void;
}

export const CampaignsListModal: React.FC<CampaignsListModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onOpenCreateCampaign,
  onOpenAttendeePortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in-person' | 'virtual' | 'hybrid'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (camp: CampaignConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(camp.generatorSlug);
    setCopiedId(camp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      camp.name.toLowerCase().includes(q) ||
      camp.organizerName.toLowerCase().includes(q) ||
      (camp.venue && camp.venue.toLowerCase().includes(q)) ||
      camp.location.toLowerCase().includes(q) ||
      camp.hashtags.some((h) => h.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return camp.id === activeCampaignId;
    return camp.format === statusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 flex flex-col gap-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d5e3ff] text-[#001b3c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">view_list</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b]">
                  Event Campaigns Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#f0eded] text-xs font-bold text-[#414752]">
                  {campaigns.length} Total
                </span>
              </div>
              <p className="text-xs text-[#414752]">
                List, manage, and launch live branded attendee generation campaigns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCreateCampaign();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Launch New Campaign
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f6f3f2] p-3 rounded-xl border border-gray-100">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 material-symbols-outlined text-[18px] text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by event name, venue, city, or hashtag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-[#1c1b1b] text-xs rounded-lg pl-9 pr-8 py-2 border border-gray-200 focus:border-[#0466c2] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'active', 'in-person', 'hybrid', 'virtual'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  statusFilter === filter
                    ? 'bg-[#004e98] text-white shadow-xs'
                    : 'bg-white text-[#414752] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Campaigns' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns List */}
        <div className="flex flex-col gap-3">
          {filteredCampaigns.length === 0 ? (
            <div className="p-8 text-center bg-[#fcf9f8] rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-gray-300">event_busy</span>
              <p className="text-sm font-bold text-[#1c1b1b]">No matching campaigns found</p>
              <p className="text-xs text-[#414752]">Try adjusting your search query or launch a new campaign.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-[#1c1b1b]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredCampaigns.map((camp) => {
              const isActive = camp.id === activeCampaignId;

              return (
                <div
                  key={camp.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col gap-3.5 ${
                    isActive
                      ? 'bg-white border-[#004e98] shadow-md ring-1 ring-[#004e98]/20'
                      : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  {/* Top Row: Badges & ID */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-[#137333] animate-pulse"></span>
                          Active Live Campaign
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-[#414752] text-xs font-semibold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Available
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-[#f6f3f2] text-[11px] font-semibold text-[#414752] uppercase">
                        {camp.format}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400 font-mono">
                      ID: {camp.id}
                    </span>
                  </div>

                  {/* Main Details */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline text-base sm:text-lg font-bold text-[#1c1b1b]">
                        {camp.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#414752]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#004e98]">corporate_fare</span>
                          <span className="font-medium">{camp.organizerName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#006c49]">calendar_today</span>
                          <span className="font-medium">{camp.dates}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">pin_drop</span>
                          <span className="font-medium">
                            {camp.venue ? `${camp.venue}, ` : ''}{camp.location}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Stats Summary Pill */}
                    <div className="flex items-center gap-3 bg-[#f6f3f2] px-3 py-2 rounded-xl border border-gray-100 self-start">
                      <div className="flex flex-col text-center">
                        <span className="text-xs font-bold text-[#1c1b1b]">
                          {camp.stats?.postsCreated ?? 0}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Posts</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex flex-col text-center">
                        <span className="text-xs font-bold text-[#004e98]">
                          {camp.stats?.reachCount ?? '0'}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Reach</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex flex-col text-center">
                        <span className="text-xs font-bold text-[#137333]">
                          {camp.stats?.viralRate ?? '0.0%'}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Virality</span>
                      </div>
                    </div>
                  </div>

                  {/* Hashtags Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {camp.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#f0eded] text-[11px] font-semibold text-[#004e98]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[11px] text-[#414752]">
                      <span className="font-medium truncate max-w-[240px] sm:max-w-xs">{camp.generatorSlug}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(camp, e)}
                        className="ml-1 p-1 hover:bg-gray-100 rounded text-[#004e98] transition-colors"
                        title="Copy attendee generator link"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copiedId === camp.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                      {copiedId === camp.id && (
                        <span className="text-[11px] font-bold text-[#137333]">Copied!</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAttendeePortal(camp);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#1c1b1b] transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#414752]">visibility</span>
                        Preview Portal
                      </button>

                      {isActive ? (
                        <button
                          type="button"
                          disabled
                          className="px-4 py-1.5 rounded-lg bg-[#e6f4ea] text-[#137333] text-xs font-bold flex items-center gap-1 cursor-default"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Currently Live
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCampaign(camp);
                            onClose();
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                          Launch / Make Active
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

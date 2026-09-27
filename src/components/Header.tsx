import React from 'react';
import { TabType, CampaignConfig, AttendeeProfile } from '../types';
import { ASSETS } from '../constants';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  campaign: CampaignConfig;
  profile: AttendeeProfile;
  onOpenDocs: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenCampaignsList: () => void;
  onOpenLaunchCampaign: () => void;
  campaignsCount?: number;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  campaign,
  profile,
  onOpenDocs,
  onOpenNotifications,
  onOpenProfile,
  onOpenCampaignsList,
  onOpenLaunchCampaign,
  campaignsCount = 4,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('organizer')}
          >
            <img
              alt="EventPulse Logo"
              className="h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
            <div className="flex flex-col">
              <span className="font-title text-base font-bold text-[#1c1b1b] leading-tight tracking-tight">
                EventPulse
              </span>
              <span className="text-[10px] text-[#004e98] tracking-wider uppercase font-bold">
                AI Post Studio
              </span>
            </div>
          </div>

          {/* Quick Active Campaign Pill */}
          <button
            type="button"
            onClick={onOpenCampaignsList}
            className="hidden md:flex items-center gap-1.5 bg-[#f6f3f2] hover:bg-[#eae7e7] px-2.5 py-1 rounded-full transition-colors text-left border border-gray-200"
            title="Click to list and switch event campaigns"
          >
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
            <span className="text-[11px] text-[#414752] font-medium">Live:</span>
            <span className="text-[11px] text-[#1c1b1b] font-bold max-w-[110px] truncate">
              {campaign.name.split(' ')[0]}
            </span>
            <span className="material-symbols-outlined text-[15px] text-gray-400">expand_more</span>
          </button>
        </div>

        {/* Center Pill Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-md">
          <nav className="inline-flex items-center p-1 bg-[#f0eded] rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab('organizer')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'organizer'
                  ? 'bg-white text-[#004e98] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#414752] hover:text-[#1c1b1b]'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => setActiveTab('attendee')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'attendee'
                  ? 'bg-white text-[#004e98] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#414752] hover:text-[#1c1b1b]'
              }`}
            >
              Attendee View
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#004e98] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-[#414752] hover:text-[#1c1b1b]'
              }`}
            >
              Campaign Analytics
            </button>
          </nav>
        </div>

        {/* Right Section: List Campaigns + Launch Campaign Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* List All Campaigns Button */}
          <button
            type="button"
            onClick={onOpenCampaignsList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#e4e1e1] text-[#1c1b1b] text-xs font-semibold transition-all shadow-2xs"
            title="List all event campaigns in directory"
          >
            <span className="material-symbols-outlined text-[17px] text-[#004e98]">format_list_bulleted</span>
            <span className="hidden sm:inline">Campaigns</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white text-[#004e98] text-[10px] font-bold">
              {campaignsCount}
            </span>
          </button>

          {/* Launch Campaign Button */}
          <button
            type="button"
            onClick={onOpenLaunchCampaign}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
            title="Create and launch a new live campaign"
          >
            <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
            <span>Launch Campaign</span>
          </button>

          {/* Docs / Help Guide */}
          <button
            onClick={onOpenDocs}
            className="hidden xl:inline-flex items-center gap-1 p-2 rounded-lg text-[#414752] hover:text-[#1c1b1b] hover:bg-[#f0eded] transition-colors"
            title="Documentation"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-full text-[#414752] hover:bg-[#f0eded] hover:text-[#1c1b1b] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>

          {/* Profile Avatar & Menu */}
          <div 
            className="relative flex items-center pl-0.5 cursor-pointer"
            onClick={onOpenProfile}
            title={`Logged in as ${profile.name}`}
          >
            <div className="relative">
              <img
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                src={profile.avatarUrl}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#006c49] ring-2 ring-white"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-gray-100 py-1.5 px-2 bg-[#fcf9f8]">
        <button
          onClick={() => setActiveTab('organizer')}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            activeTab === 'organizer' ? 'bg-[#004e98] text-white' : 'text-[#414752]'
          }`}
        >
          Organizer
        </button>
        <button
          onClick={() => setActiveTab('attendee')}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            activeTab === 'attendee' ? 'bg-[#004e98] text-white' : 'text-[#414752]'
          }`}
        >
          Attendee View
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            activeTab === 'analytics' ? 'bg-[#004e98] text-white' : 'text-[#414752]'
          }`}
        >
          Campaign Analytics
        </button>
      </div>
    </header>
  );
};

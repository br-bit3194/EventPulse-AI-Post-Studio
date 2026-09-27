import React, { useState } from 'react';
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
  onOpenCampaignSwitcher: () => void;
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
  onOpenCampaignSwitcher,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
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

        {/* Center Pill Navigation */}
        <div className="flex items-center justify-center flex-1 max-w-md">
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

        {/* Right Section Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Active Event Indicator / Switcher */}
          <button
            onClick={onOpenCampaignSwitcher}
            className="hidden xl:flex items-center gap-1.5 bg-[#f6f3f2] hover:bg-[#eae7e7] px-3 py-1 rounded-full transition-colors text-left"
            title="Switch or manage active event"
          >
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
            <span className="text-[11px] text-[#414752]">Active Event:</span>
            <span className="text-[11px] text-[#1c1b1b] font-semibold max-w-[120px] truncate">
              {campaign.name.split(' ')[0]} 2025
            </span>
            <span className="material-symbols-outlined text-[16px] text-gray-500">expand_more</span>
          </button>

          {/* Docs / Help Guide */}
          <button
            onClick={onOpenDocs}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#414752] hover:text-[#1c1b1b] hover:bg-[#f0eded] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <span>Docs</span>
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#004e98]"></span>
            )}
          </button>

          {/* Profile Avatar & Menu */}
          <div 
            className="relative flex items-center pl-1 cursor-pointer"
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
    </header>
  );
};

import React, { useState } from 'react';
import { AttendeeProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AttendeeProfile;
  onUpdate: (updated: AttendeeProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdate,
}) => {
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...profile,
      name: name.trim() || profile.name,
      headline: headline.trim() || profile.headline,
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#004e98]">account_circle</span>
            <h2 className="font-headline text-lg font-bold text-[#1c1b1b]">Attendee Profile Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-4 py-1">
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#004e98]"
            />
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-xs font-bold text-[#1c1b1b] uppercase">Avatar Image URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="bg-[#f6f3f2] p-2 rounded text-xs text-[#1c1b1b] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent focus:border-[#0466c2] text-[#1c1b1b] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent focus:border-[#0466c2] text-[#1c1b1b] outline-none"
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
              className="px-5 py-2 rounded-lg bg-[#004e98] text-white text-xs font-bold shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

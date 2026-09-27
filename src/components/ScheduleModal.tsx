import React, { useState } from 'react';
import { ScheduledPost, ToneType, ConferencePhoto } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  postContent: string;
  tone: ToneType;
  selectedPhoto?: ConferencePhoto;
  onScheduleConfirm: (post: Omit<ScheduledPost, 'id' | 'createdAt' | 'status'>) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  postContent,
  tone,
  selectedPhoto,
  onScheduleConfirm,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'keynote' | 'lunch' | 'gala' | 'custom'>('keynote');
  const [customDate, setCustomDate] = useState('2025-10-15');
  const [customTime, setCustomTime] = useState('10:15');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const presets = [
    {
      id: 'keynote',
      label: 'Post-Keynote Peak Window',
      time: 'Day 2 (Oct 15) @ 10:15 AM',
      badge: '🔥 Highest Viral Lift (+184%)',
      desc: 'Releases right as the morning keynote concludes, when attendees check LinkedIn in the auditorium.',
    },
    {
      id: 'lunch',
      label: 'Executive Lunch & Networking',
      time: 'Day 2 (Oct 15) @ 12:30 PM',
      badge: '🥪 High Peer Sharing',
      desc: 'Prime window when attendees are networking and browsing summit tags.',
    },
    {
      id: 'gala',
      label: 'Evening Gala & Award Reception',
      time: 'Day 2 (Oct 15) @ 6:00 PM',
      badge: '🍸 Celebration Spike',
      desc: 'Ideal for celebratory and grateful recap posts with evening cocktail photos.',
    },
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    let scheduledTime = 'Day 2 (Oct 15) @ 10:15 AM';
    let scheduledSlotLabel = 'Post-Keynote Peak Window';

    if (selectedPreset === 'lunch') {
      scheduledTime = 'Day 2 (Oct 15) @ 12:30 PM';
      scheduledSlotLabel = 'Executive Lunch & Networking';
    } else if (selectedPreset === 'gala') {
      scheduledTime = 'Day 2 (Oct 15) @ 6:00 PM';
      scheduledSlotLabel = 'Evening Gala & Award Reception';
    } else if (selectedPreset === 'custom') {
      scheduledTime = `${customDate} @ ${customTime}`;
      scheduledSlotLabel = 'Custom Scheduled Slot';
    }

    onScheduleConfirm({
      content: postContent,
      tone,
      scheduledTime,
      scheduledSlotLabel,
      photoUrl: selectedPhoto?.url,
      photoCaption: selectedPhoto?.caption,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#004e98]">schedule_send</span>
            <div>
              <h2 className="font-headline text-lg font-bold text-[#1c1b1b]">
                Schedule Post for Event Release
              </h2>
              <p className="text-xs text-[#414752]">Queue your drafted post for peak attendee engagement times</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleConfirm} className="flex flex-col gap-4 text-xs sm:text-sm">
          {/* Draft Post Snippet */}
          <div className="p-3 bg-[#f6f3f2] rounded-xl border border-gray-100 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-[#414752]">
              <span className="font-bold uppercase tracking-wider">Draft Preview:</span>
              <span className="font-semibold text-[#004e98] capitalize">{tone} tone</span>
            </div>
            <p className="text-xs text-[#1c1b1b] line-clamp-2 italic leading-relaxed">
              "{postContent.slice(0, 140)}..."
            </p>
          </div>

          {/* Timing Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Select Release Window
            </label>
            <div className="flex flex-col gap-2">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPreset(p.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#d5e3ff]/30 border-[#004e98] ring-1 ring-[#004e98]'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedPreset(p.id as any)}
                          className="text-[#004e98] focus:ring-[#004e98]"
                        />
                        <span className="font-bold text-xs text-[#1c1b1b]">{p.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#006c49] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    </div>
                    <div className="pl-5 flex flex-col gap-0.5">
                      <span className="text-xs font-mono font-semibold text-[#004e98]">{p.time}</span>
                      <p className="text-[11px] text-[#414752] leading-tight">{p.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Custom Date & Time Option */}
              <div
                onClick={() => setSelectedPreset('custom')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  selectedPreset === 'custom'
                    ? 'bg-[#d5e3ff]/30 border-[#004e98] ring-1 ring-[#004e98]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={selectedPreset === 'custom'}
                    onChange={() => setSelectedPreset('custom')}
                    className="text-[#004e98] focus:ring-[#004e98]"
                  />
                  <span className="font-bold text-xs text-[#1c1b1b]">Custom Date & Time</span>
                </div>

                {selectedPreset === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 pl-5 pt-1">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="bg-white p-2 rounded-lg border border-gray-200 text-xs text-[#1c1b1b] outline-none"
                    />
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="bg-white p-2 rounded-lg border border-gray-200 text-xs text-[#1c1b1b] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Pre-release Note */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Reminder / Session Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Snap stage selfie during keynote before clicking post"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#f6f3f2] p-2.5 rounded-lg border border-transparent focus:border-[#0466c2] text-xs text-[#1c1b1b] outline-none"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2.5 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Confirm & Queue Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Viral Spike Detected! 🚀',
      desc: 'David Ross’s keynote takeaway post reached 1,200+ impressions in 15 mins.',
      time: '3m ago',
      unread: true,
      icon: 'trending_up',
      color: 'text-[#006c49]',
    },
    {
      id: 'n2',
      title: 'Reach Milestone Reached',
      desc: 'TechNova Global Summit 2025 just crossed 480K total estimated organic impressions.',
      time: '18m ago',
      unread: true,
      icon: 'stars',
      color: 'text-[#004e98]',
    },
    {
      id: 'n3',
      title: 'Portal Link Scanned',
      desc: 'Stage QR code was scanned 28 times from Main Stage Hall A.',
      time: '34m ago',
      unread: false,
      icon: 'qr_code_2',
      color: 'text-[#414752]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 border-l border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#004e98]">notifications</span>
              <h3 className="font-headline text-base font-bold text-[#1c1b1b]">Live Campaign Alerts</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  n.unread
                    ? 'bg-[#f6f3f2] border-[#d5e3ff]'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`material-symbols-outlined text-[20px] ${n.color} mt-0.5`}>
                    {n.icon}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1c1b1b]">{n.title}</span>
                      <span className="text-[10px] text-[#414752]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#414752] leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-xs text-[#414752] hover:text-[#004e98] font-semibold"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004e98] text-white text-xs font-bold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface FooterProps {
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs }) => {
  return (
    <footer className="w-full bg-white mt-12 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-title text-base font-bold text-[#1c1b1b]">EventPulse</span>
          <span className="text-xs text-[#414752]">
            © 2025 EventPulse AI Studio. Built for high-impact social reach.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenDocs}
            className="text-xs font-semibold text-[#414752] hover:text-[#1c1b1b] transition-colors"
          >
            Terms
          </button>
          <button
            onClick={onOpenDocs}
            className="text-xs font-semibold text-[#414752] hover:text-[#1c1b1b] transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={onOpenDocs}
            className="text-xs font-semibold text-[#414752] hover:text-[#1c1b1b] transition-colors"
          >
            Help Center
          </button>
        </div>
      </div>
    </footer>
  );
};

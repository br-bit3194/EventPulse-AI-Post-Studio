import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d5e3ff] text-[#004e98] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <h2 className="font-headline text-lg sm:text-xl font-bold text-[#1c1b1b]">
                EventPulse Documentation & Playbook
              </h2>
              <p className="text-xs text-[#414752]">How to drive maximum viral amplification at your event</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-5 text-xs sm:text-sm text-[#414752] leading-relaxed">
          <section className="flex flex-col gap-1.5">
            <h3 className="font-headline text-sm font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#004e98]">qr_code</span>
              1. The 30-Second Stage QR Strategy
            </h3>
            <p>
              Place the Attendee Generator QR code on transition slides between keynote speakers. Our analytics indicate a 3.4x conversion rate when speakers remind the room: <em>“Scan to capture your personal takeaways before the next track begins.”</em>
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-headline text-sm font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">psychology</span>
              2. AI Persona & Tone Guardrails
            </h3>
            <p>
              The built-in Gemini AI generator automatically maintains your official event anchors and company hashtags while customizing the post to the attendee’s selected tone:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Grateful Attendee:</strong> Celebrates organizers, community energy, and keynote speakers.</li>
              <li><strong>Key Takeaways:</strong> Uses numbered bullets (1️⃣, 2️⃣, 3️⃣) and strategic questions to maximize comments.</li>
              <li><strong>Speaker / Panelist:</strong> Authoritative recap of session thesis with calls to collaborate.</li>
              <li><strong>Professional:</strong> High-level executive perspective on industry shifts.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-headline text-sm font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#704500]">share</span>
              3. 1-Click Publishing Workflow
            </h3>
            <p>
              Attendees can click <strong>“Open in LinkedIn & Publish”</strong> which encodes the post text directly into LinkedIn’s share dialog, or simply click <strong>“Copy Post Text”</strong> to paste alongside their custom photos.
            </p>
          </section>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#004e98] text-white text-xs font-bold hover:bg-[#004e98]/90 transition-colors shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

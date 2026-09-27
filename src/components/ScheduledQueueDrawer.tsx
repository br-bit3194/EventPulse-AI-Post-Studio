import React from 'react';
import { ScheduledPost } from '../types';

interface ScheduledQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: ScheduledPost[];
  onPublishNow: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onSelectToEdit: (post: ScheduledPost) => void;
}

export const ScheduledQueueDrawer: React.FC<ScheduledQueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  onPublishNow,
  onDelete,
  onSelectToEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 border-l border-gray-100 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#004e98]">event_upcoming</span>
              <div>
                <h3 className="font-headline text-base font-bold text-[#1c1b1b]">
                  Scheduled Post Queue
                </h3>
                <p className="text-xs text-[#414752]">{queue.length} posts waiting for peak windows</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#414752] hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Queue List */}
          {queue.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-2 text-[#414752]">
              <span className="material-symbols-outlined text-[48px] text-gray-300">schedule</span>
              <p className="font-headline text-sm font-bold text-[#1c1b1b]">No Scheduled Posts Yet</p>
              <p className="text-xs max-w-xs">
                Draft your takeaways and click <strong>“Schedule for Later”</strong> to queue posts for peak conference sessions.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {queue.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-xl bg-[#f6f3f2] border border-gray-200 flex flex-col gap-3 hover:border-gray-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d5e3ff] text-[#001b3c] text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[13px]">alarm</span>
                      {post.scheduledTime}
                    </span>
                    <span className="text-[10px] text-[#006c49] font-bold uppercase tracking-wider bg-[#6cf8bb]/30 px-2 py-0.5 rounded">
                      Queued
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {post.photoUrl && (
                      <img
                        src={post.photoUrl}
                        alt="Attached media"
                        className="w-16 h-12 rounded object-cover flex-shrink-0 border border-gray-200"
                      />
                    )}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#1c1b1b] truncate">
                        {post.scheduledSlotLabel}
                      </span>
                      <p className="text-xs text-[#414752] line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {post.notes && (
                    <div className="p-2 bg-white rounded-lg text-[11px] text-[#414752] flex items-center gap-1.5 border border-gray-100">
                      <span className="material-symbols-outlined text-[14px] text-[#f59e0b]">note</span>
                      <span>Reminder: {post.notes}</span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                    <button
                      onClick={() => onSelectToEdit(post)}
                      className="text-[#004e98] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Load in Editor</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDelete(post.id)}
                        className="text-[#414752] hover:text-[#ba1a1a] p-1 transition-colors"
                        title="Delete from queue"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                      <button
                        onClick={() => onPublishNow(post)}
                        className="px-3 py-1.5 rounded-lg bg-[#004e98] hover:bg-[#004e98]/90 text-white font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">send</span>
                        <span>Publish Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-[#414752]">
            ⚡ Automatic notifications sent 10m before slot release
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#f0eded] hover:bg-[#eae7e7] text-[#1c1b1b] text-xs font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

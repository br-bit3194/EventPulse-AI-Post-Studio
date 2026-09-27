import React, { useState, useEffect } from 'react';
import { TabType, CampaignConfig, AttendeeProfile, SharedPost, ToneType } from './types';
import { DEFAULT_CAMPAIGN, DEFAULT_PROFILE, INITIAL_POSTS } from './constants';
import { Header } from './components/Header';
import { OrganizerView } from './components/OrganizerView';
import { AttendeeView } from './components/AttendeeView';
import { CampaignAnalytics } from './components/CampaignAnalytics';
import { DocsModal } from './components/DocsModal';
import { CampaignModal } from './components/CampaignModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('organizer');
  const [campaign, setCampaign] = useState<CampaignConfig>(DEFAULT_CAMPAIGN);
  const [profile, setProfile] = useState<AttendeeProfile>(DEFAULT_PROFILE);
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>(INITIAL_POSTS);

  // Modals state
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync campaign and posts from backend
  useEffect(() => {
    fetch('/api/campaign')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.campaign) {
          setCampaign((prev) => ({ ...prev, ...data.campaign }));
        }
      })
      .catch((err) => console.log('Offline mode or server initializing:', err));

    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts && data.posts.length > 0) {
          setSharedPosts(data.posts);
        }
      })
      .catch((err) => console.log('Using default feed posts:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Update campaign
  const handleUpdateCampaign = async (updated: Partial<CampaignConfig>) => {
    const newConfig = { ...campaign, ...updated };
    setCampaign(newConfig);
    showToast('Campaign settings updated & live on attendee portal!');
    try {
      await fetch('/api/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Local update saved', err);
    }
  };

  // Create new campaign
  const handleCreateCampaign = (newCamp: CampaignConfig) => {
    setCampaign(newCamp);
    showToast(`New campaign "${newCamp.name}" launched!`);
    setActiveTab('organizer');
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/analytics/export', '_blank');
  };

  // Attendee published a post
  const handlePostPublished = async (content: string, tone: ToneType) => {
    showToast('Post created! Opening LinkedIn to share...');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: profile.name,
          authorRole: profile.headline,
          content,
          tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setSharedPosts((prev) => [data.post, ...prev]);
        if (data.updatedStats) {
          setCampaign((prev) => ({ ...prev, stats: data.updatedStats }));
        }
      }
    } catch {
      // Local fallback
      const newPost: SharedPost = {
        id: `post-${Date.now()}`,
        authorName: profile.name,
        authorRole: profile.headline.split('|')[0] || 'Attendee',
        authorCompany: 'EventPulse Community',
        authorInitials: profile.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        timeAgo: 'Just now',
        timestamp: new Date().toISOString(),
        content,
        reactions: 1,
        comments: 0,
        reposts: 0,
        tone,
      };
      setSharedPosts((prev) => [newPost, ...prev]);
      setCampaign((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          postsCreated: prev.stats.postsCreated + 1,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        campaign={campaign}
        profile={profile}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotifications(0);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCampaignSwitcher={() => setIsCreateCampaignOpen(true)}
        unreadNotificationsCount={unreadNotifications}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 bg-[#fcf9f8]">
        {activeTab === 'organizer' && (
          <OrganizerView
            campaign={campaign}
            onUpdateCampaign={handleUpdateCampaign}
            sharedPosts={sharedPosts}
            onCreateCampaignClick={() => setIsCreateCampaignOpen(true)}
            onExportCsv={handleExportCsv}
            onSwitchToAttendeeView={() => setActiveTab('attendee')}
          />
        )}

        {activeTab === 'attendee' && (
          <AttendeeView
            campaign={campaign}
            profile={profile}
            onPostPublished={handlePostPublished}
          />
        )}

        {activeTab === 'analytics' && (
          <CampaignAnalytics
            campaign={campaign}
            sharedPosts={sharedPosts}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

      {/* Standard Footer */}
      <Footer onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Modals and Drawers */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <CampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreate={handleCreateCampaign}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdate={setProfile}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setUnreadNotifications(0)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1b1b] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-slide-up border border-gray-700">
          <span className="material-symbols-outlined text-[18px] text-[#6cf8bb]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

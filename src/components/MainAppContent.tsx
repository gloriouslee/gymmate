'use client';

import React from 'react';
import { GymProvider, useGym } from '@/context/GymContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import RestTimerOverlay from '@/components/RestTimerOverlay';
import ActiveWorkoutModal from '@/components/workout/ActiveWorkoutModal';
import WorkoutSummaryModal from '@/components/workout/WorkoutSummaryModal';
import WeightLogModal from '@/components/weight/WeightLogModal';

import HomeTab from '@/components/tabs/HomeTab';
import PlanTab from '@/components/tabs/PlanTab';
import ProgressTab from '@/components/tabs/ProgressTab';
import LibraryTab from '@/components/tabs/LibraryTab';
import ProfileTab from '@/components/tabs/ProfileTab';

function AppLayout() {
  const { activeTab } = useGym();

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white flex flex-col selection:bg-[#00F19F] selection:text-black">
      {/* Top Header with WHOOP dials & unit switcher */}
      <Header />

      {/* Main Tab View */}
      <main className="flex-1 p-4 pb-24 max-w-5xl mx-auto w-full">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Floating Rest Timer Overlay when set is logged */}
      <RestTimerOverlay />

      {/* Live Fullscreen Workout Tracker Modal */}
      <ActiveWorkoutModal />

      {/* Celebratory Post-Workout Summary with PRs */}
      <WorkoutSummaryModal />

      {/* Body Weight Logging Modal */}
      <WeightLogModal />

      {/* Mobile-first Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}

export default function MainAppContent() {
  return (
    <GymProvider>
      <AppLayout />
    </GymProvider>
  );
}

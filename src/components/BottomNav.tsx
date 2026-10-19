'use client';

import React from 'react';
import { useGym } from '@/context/GymContext';
import { Home, CalendarDays, Play, TrendingUp, Dumbbell } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, activeSession, setIsWorkoutModalOpen, startSession } = useGym();

  const handleStartClick = () => {
    if (activeSession) {
      setIsWorkoutModalOpen(true);
    } else {
      // Start today's planned or quick workout
      startSession({ title: 'Buổi tập nhanh' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F12]/95 backdrop-blur-lg border-t border-[#24323A] pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'home' ? 'text-[#00F19F]' : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Home</span>
        </button>

        {/* Plan & Calendar */}
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'plan' ? 'text-[#00F19F]' : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Plan</span>
        </button>

        {/* Central Start / Active Workout Action Button */}
        <div className="relative -top-4 flex items-center justify-center px-2">
          <button
            onClick={handleStartClick}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 ${
              activeSession
                ? 'bg-[#00F19F] text-black font-black animate-pulse shadow-[0_0_25px_rgba(0,241,159,0.5)]'
                : 'bg-[#00F19F] hover:bg-[#00dd90] text-black shadow-[0_0_20px_rgba(0,241,159,0.3)]'
            }`}
          >
            <Play className="w-6 h-6 fill-black ml-0.5" />
            <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">
              {activeSession ? 'RESUME' : 'START'}
            </span>
          </button>
        </div>

        {/* Progress & Analytics */}
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'progress' ? 'text-[#00F19F]' : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Progress</span>
        </button>

        {/* Library */}
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'library' ? 'text-[#00F19F]' : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <Dumbbell className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Library</span>
        </button>
      </div>
    </nav>
  );
}

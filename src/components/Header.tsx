'use client';

import React from 'react';
import { useGym } from '@/context/GymContext';
import { Scale, User, Plus } from 'lucide-react';
import { formatWeight } from '@/utils/fitness';

export default function Header() {
  const { user, toggleUnit, setActiveTab, activeSession, setIsWorkoutModalOpen, setIsWeightModalOpen } = useGym();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F12]/90 backdrop-blur-md border-b border-[#24323A] px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          {/* Athletic Logo Mark */}
          <div className="w-8 h-8 rounded-full border-2 border-[#00F19F] flex items-center justify-center bg-[#131A1E] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(0,241,159,0.3)]">
            <span className="text-xs font-black tracking-tighter text-[#00F19F]">
              W
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-widest uppercase text-white font-mono">
                GYM<span className="text-[#00F19F]">MATE</span>
              </span>
              <span className="text-[10px] font-bold bg-[#1C262C] text-[#7BA1BB] px-1.5 py-0.5 rounded border border-[#24323A]">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[#8E9DA8] font-medium tracking-wide">
              ATHLETIC PERFORMANCE
            </p>
          </div>
        </div>

        {/* Center/Right Metrics & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Workout Floating Pill if running */}
          {activeSession && (
            <button
              onClick={() => setIsWorkoutModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#00F19F]/15 border border-[#00F19F] px-2.5 py-1 rounded-full text-xs font-bold text-[#00F19F] animate-pulse hover:bg-[#00F19F]/25 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#00F19F] animate-ping" />
              <span>Đang tập</span>
            </button>
          )}

          {/* Body Weight Quick Tracking Pill */}
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="flex items-center gap-2 bg-[#131A1E] hover:bg-[#1C262C] border border-[#24323A] hover:border-[#00F19F] px-2.5 py-1.5 rounded-xl transition-all group"
            title="Bấm để ghi nhận cân nặng mới"
          >
            <Scale className="w-3.5 h-3.5 text-[#00F19F] group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-[#8E9DA8] font-bold">
                Cân nặng
              </div>
              <div className="text-xs font-black text-white font-number">
                {formatWeight(user.bodyWeight, user.unit)}
              </div>
            </div>
            <div className="w-4 h-4 rounded-full bg-[#1C262C] group-hover:bg-[#00F19F] group-hover:text-black flex items-center justify-center text-[#8E9DA8] text-[10px] font-bold transition-colors">
              +
            </div>
          </button>

          {/* Unit Toggle Button */}
          <button
            onClick={toggleUnit}
            title="Đổi đơn vị kg / lb"
            className="px-2.5 py-1.5 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-[11px] font-black text-white tracking-wider uppercase transition-colors"
          >
            {user.unit.toUpperCase()}
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-[#1C262C] border border-[#24323A] flex items-center justify-center hover:border-[#00F19F] transition-colors"
            title={user.name}
          >
            <User className="w-4 h-4 text-[#8E9DA8]" />
          </button>
        </div>
      </div>
    </header>
  );
}

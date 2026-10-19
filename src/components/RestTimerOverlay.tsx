'use client';

import React from 'react';
import { useGym } from '@/context/GymContext';
import { Play, Pause, Plus, SkipForward, Timer } from 'lucide-react';
import { formatDuration } from '@/utils/fitness';

export default function RestTimerOverlay() {
  const { restTimer, pauseRestTimer, resumeRestTimer, addRestTimerSeconds, stopRestTimer } = useGym();

  if (!restTimer.isActive) return null;

  const percent = restTimer.totalSeconds > 0
    ? Math.max(0, Math.min(100, ((restTimer.totalSeconds - restTimer.remainingSeconds) / restTimer.totalSeconds) * 100))
    : 0;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50">
      <div className="bg-[#131A1E]/95 backdrop-blur-md border border-[#00F19F] rounded-2xl p-3 shadow-[0_0_30px_rgba(0,241,159,0.25)] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
        {/* Left: Timer circle and info */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#24323A"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#00F19F"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * percent) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <Timer className="absolute w-5 h-5 text-[#00F19F]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00F19F]">
                NGHỈ GIỮA HIỆP (REST)
              </span>
              {restTimer.setNumber && (
                <span className="text-[9px] bg-[#1C262C] px-1.5 py-0.2 rounded text-[#8E9DA8]">
                  Hiệp {restTimer.setNumber}
                </span>
              )}
            </div>
            <div className="text-xl font-black text-white font-number tracking-tight">
              {formatDuration(restTimer.remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-1.5">
          {/* +30s */}
          <button
            onClick={() => addRestTimerSeconds(30)}
            className="px-2.5 py-1.5 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-xs font-bold text-white flex items-center gap-0.5 active:scale-95 transition-all"
            title="Thêm 30 giây"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F19F]" />
            <span>30s</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={restTimer.isRunning ? pauseRestTimer : resumeRestTimer}
            className="w-9 h-9 rounded-xl bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] flex items-center justify-center text-white active:scale-95 transition-all"
            title={restTimer.isRunning ? 'Tạm dừng' : 'Tiếp tục'}
          >
            {restTimer.isRunning ? (
              <Pause className="w-4 h-4 text-[#FFDE00]" />
            ) : (
              <Play className="w-4 h-4 fill-[#00F19F] text-[#00F19F]" />
            )}
          </button>

          {/* Skip / Close */}
          <button
            onClick={stopRestTimer}
            className="w-9 h-9 rounded-xl bg-[#1C262C] hover:bg-red-500/20 border border-[#24323A] flex items-center justify-center text-[#8E9DA8] hover:text-red-400 active:scale-95 transition-all"
            title="Bỏ qua nghỉ"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

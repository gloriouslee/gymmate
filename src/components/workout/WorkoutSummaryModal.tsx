'use client';

import React from 'react';
import { useGym } from '@/context/GymContext';
import { Trophy, Flame, Dumbbell, Clock, CheckCircle2, X } from 'lucide-react';
import { formatDuration, formatWeight } from '@/utils/fitness';

export default function WorkoutSummaryModal() {
  const { lastFinishedSession, setLastFinishedSession, getExerciseById, user } = useGym();

  if (!lastFinishedSession) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#131A1E] border border-[#00F19F] rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,241,159,0.3)]">
        {/* Close Button */}
        <button
          onClick={() => setLastFinishedSession(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#00F19F]/20 border-2 border-[#00F19F] flex items-center justify-center mx-auto text-[#00F19F] shadow-[0_0_20px_rgba(0,241,159,0.4)]">
            <Trophy className="w-8 h-8 text-[#00F19F]" />
          </div>
          <div className="text-[11px] font-black uppercase tracking-widest text-[#00F19F]">
            BUỔI TẬP HOÀN THÀNH
          </div>
          <h2 className="text-xl font-black text-white">{lastFinishedSession.title}</h2>
          <p className="text-xs text-[#8E9DA8]">
            Bạn đã nỗ lực hết mình hôm nay! Cơ thể đang trong quá trình tái tạo và phát triển.
          </p>
        </div>

        {/* PR Alerts if achieved */}
        {lastFinishedSession.prsAchieved && lastFinishedSession.prsAchieved.length > 0 && (
          <div className="mb-5 bg-gradient-to-r from-[#FFDE00]/15 to-[#00F19F]/15 border border-[#FFDE00]/50 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#FFDE00] uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-[#FFDE00]" />
              <span>KỶ LỤC MỚI ĐƯỢC THIẾT LẬP (NEW PR)!</span>
            </div>
            {lastFinishedSession.prsAchieved.map(pr => {
              const ex = getExerciseById(pr.exerciseId);
              return (
                <div
                  key={pr.id}
                  className="bg-[#1C262C]/80 border border-[#24323A] rounded-xl p-2 flex items-center justify-between text-xs gap-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#24323A] bg-[#131A1E]">
                      {ex?.imageUrl ? (
                        <img
                          src={ex.imageUrl}
                          alt={ex.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="w-3.5 h-3.5 text-[#FFDE00]" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-white truncate">{ex?.vietnameseName || ex?.name || 'Bài tập'}</span>
                  </div>
                  <span className="font-black text-[#00F19F] font-number shrink-0">
                    {pr.type === 'heaviest_weight' ? `${pr.value}kg (${pr.repsAtWeight} reps)` : `1RM: ${pr.value}kg`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Volume */}
          <div className="bg-[#1C262C] border border-[#24323A] rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8E9DA8] mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-[#00F19F]" />
              <span>Tổng khối lượng</span>
            </div>
            <div className="text-lg font-black text-white font-number">
              {formatWeight(lastFinishedSession.totalVolume, user.unit)}
            </div>
          </div>

          {/* Strain */}
          <div className="bg-[#1C262C] border border-[#24323A] rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8E9DA8] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#0093E7]" />
              <span>WHOOP Strain</span>
            </div>
            <div className="text-lg font-black text-[#0093E7] font-number">
              {lastFinishedSession.strainScore.toFixed(1)} / 21
            </div>
          </div>

          {/* Duration */}
          <div className="bg-[#1C262C] border border-[#24323A] rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8E9DA8] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#7BA1BB]" />
              <span>Thời gian</span>
            </div>
            <div className="text-lg font-black text-white font-number">
              {formatDuration(lastFinishedSession.durationSeconds)}
            </div>
          </div>

          {/* Completed Sets */}
          <div className="bg-[#1C262C] border border-[#24323A] rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8E9DA8] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16EC06]" />
              <span>Hiệp hoàn thành</span>
            </div>
            <div className="text-lg font-black text-[#16EC06] font-number">
              {lastFinishedSession.totalCompletedSets} hiệp
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setLastFinishedSession(null)}
          className="w-full py-3.5 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(0,241,159,0.4)] transition-all active:scale-95"
        >
          XONG (DONE)
        </button>
      </div>
    </div>
  );
}

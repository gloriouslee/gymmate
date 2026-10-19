'use client';

import React from 'react';
import { useGym } from '@/context/GymContext';
import {
  Flame,
  Play,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Moon,
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
  Dumbbell
} from 'lucide-react';
import { formatWeight } from '@/utils/fitness';

export default function HomeTab() {
  const {
    user,
    schedule,
    templates,
    getTemplateById,
    startSession,
    setIsWorkoutModalOpen,
    activeSession,
    prs,
    getExerciseById,
    suggestions,
    acceptSuggestion,
    dismissSuggestion,
    setActiveTab,
    weightHistory,
    setIsWeightModalOpen,
    sessionHistory
  } = useGym();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayScheduled = schedule.find(s => s.date === todayStr);
  const todayTemplate = todayScheduled?.templateId ? getTemplateById(todayScheduled.templateId) : null;

  // Compute weight change vs start
  const earliestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : user.bodyWeight;
  const weightDiff = Math.round((user.bodyWeight - earliestWeight) * 10) / 10;
  const totalVolumeAll = sessionHistory.reduce((acc, s) => acc + s.totalVolume, 0);

  // Days of current week for mini strip
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const sched = schedule.find(s => s.date === dStr);
      dates.push({
        dateStr: dStr,
        dayName: dayLabels[i],
        dayNumber: d.getDate(),
        isToday: dStr === todayStr,
        status: sched?.status || 'none',
        template: sched?.templateId ? getTemplateById(sched.templateId) : null
      });
    }
    return dates;
  };

  const weekDays = getWeekDates();
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Performance & Body Stats Card */}
      <div className="bg-gradient-to-br from-[#1B252C] to-[#101518] border border-[#24323A] rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#00F19F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#00F19F]">
              THỂ TRẠNG & TẬP LUYỆN
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">
              Chào {user.name.split(' ').pop()}!
            </h1>
          </div>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="text-xs bg-[#1C262C] hover:bg-[#24323A] border border-[#00F19F]/50 px-3 py-1 rounded-full text-[#00F19F] font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ghi Cân Nặng</span>
          </button>
        </div>

        {/* 3 Metrics dials: Body Weight, Completed Workouts, Total Volume */}
        <div className="grid grid-cols-3 gap-3">
          {/* Body Weight Card */}
          <div
            onClick={() => setIsWeightModalOpen(true)}
            className="bg-[#131A1E]/80 border border-[#00F19F]/40 hover:border-[#00F19F] rounded-2xl p-3 text-center cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#00F19F] uppercase tracking-wider mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Cân Nặng</span>
            </div>
            <div className="text-2xl font-black text-white font-number group-hover:text-[#00F19F] transition-colors">
              {user.bodyWeight} <span className="text-xs font-normal text-[#8E9DA8]">{user.unit}</span>
            </div>
            <div className="text-[10px] text-[#00F19F] font-bold mt-0.5 font-number flex items-center justify-center gap-0.5">
              {weightDiff <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg</span>
            </div>
          </div>

          {/* Completed Sessions */}
          <div className="bg-[#131A1E]/80 border border-[#0093E7]/40 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#0093E7] uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Buổi Tập</span>
            </div>
            <div className="text-2xl font-black text-white font-number">
              {sessionHistory.length}
            </div>
            <div className="text-[10px] text-[#8E9DA8] mt-0.5">Đã hoàn thành</div>
          </div>

          {/* Volume */}
          <div className="bg-[#131A1E]/80 border border-[#FFDE00]/40 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#FFDE00] uppercase tracking-wider mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Khối Lượng</span>
            </div>
            <div className="text-2xl font-black text-[#FFDE00] font-number">
              {(totalVolumeAll / 1000).toFixed(1)} <span className="text-xs font-normal text-[#8E9DA8]">Tấn</span>
            </div>
            <div className="text-[10px] text-[#8E9DA8] mt-0.5">Tích lũy</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Mini-Strip */}
      <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#00F19F]" />
            Lịch tuần này
          </span>
          <button
            onClick={() => setActiveTab('plan')}
            className="text-xs font-bold text-[#00F19F] hover:underline flex items-center gap-0.5"
          >
            Chi tiết lịch <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map(day => {
            const isCompleted = day.status === 'completed';
            const isRest = day.status === 'rest';
            const isPlanned = day.status === 'planned';

            return (
              <div
                key={day.dateStr}
                onClick={() => setActiveTab('plan')}
                className={`py-2 px-1 rounded-xl cursor-pointer border transition-all ${
                  day.isToday
                    ? 'border-[#00F19F] bg-[#00F19F]/10 shadow-[0_0_12px_rgba(0,241,159,0.2)]'
                    : 'border-[#24323A] bg-[#172127] hover:bg-[#1C262C]'
                }`}
              >
                <div className="text-[10px] text-[#8E9DA8] font-bold">{day.dayName}</div>
                <div className="text-xs font-black text-white font-number my-0.5">
                  {day.dayNumber}
                </div>
                <div className="flex justify-center mt-1">
                  {isCompleted && <span className="w-2 h-2 rounded-full bg-[#16EC06]" />}
                  {isRest && <span className="w-2 h-2 rounded-full bg-[#7BA1BB]" />}
                  {isPlanned && <span className="w-2 h-2 rounded-full bg-[#0093E7]" />}
                  {!isCompleted && !isRest && !isPlanned && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#24323A]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progressive Overload Smart Suggestion Alert */}
      {pendingSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-[#00F19F]/10 via-[#131A1E] to-[#0093E7]/10 border border-[#00F19F]/50 rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#00F19F] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#00F19F]" />
            <span>GỢI Ý TĂNG TẢI (SMART PROGRESSION)</span>
          </div>
          <p className="text-xs text-white font-medium">{pendingSuggestions[0].reason}</p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => acceptSuggestion(pendingSuggestions[0].id)}
              className="px-3 py-1.5 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(0,241,159,0.3)]"
            >
              Áp dụng (+{pendingSuggestions[0].suggestedWeightDelta}kg)
            </button>
            <button
              onClick={() => dismissSuggestion(pendingSuggestions[0].id)}
              className="px-3 py-1.5 bg-[#1C262C] hover:bg-[#24323A] text-[#8E9DA8] text-xs font-bold rounded-xl transition-colors"
            >
              Để sau
            </button>
          </div>
        </div>
      )}

      {/* Today's Workout Focus Card */}
      <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8E9DA8]">
            LỊCH TẬP HÔM NAY
          </span>
          {todayScheduled?.status === 'completed' && (
            <span className="flex items-center gap-1 text-xs font-black text-[#16EC06] bg-[#16EC06]/15 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
            </span>
          )}
          {todayScheduled?.status === 'rest' && (
            <span className="text-xs font-black text-[#7BA1BB] bg-[#7BA1BB]/15 px-2.5 py-0.5 rounded-full">
              Ngày nghỉ phục hồi
            </span>
          )}
        </div>

        {todayScheduled?.status === 'rest' ? (
          <div className="py-4 text-center space-y-2">
            <Moon className="w-10 h-10 text-[#7BA1BB] mx-auto" />
            <h3 className="text-base font-black text-white">Hôm nay là Ngày Nghỉ (Rest Day)</h3>
            <p className="text-xs text-[#8E9DA8] max-w-sm mx-auto">
              Cơ bắp phát triển trong lúc nghỉ ngơi. Hãy ngủ đủ 8 tiếng, uống đủ nước và bổ sung dinh dưỡng chất lượng.
            </p>
          </div>
        ) : todayTemplate ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-white">{todayTemplate.name}</h3>
                <p className="text-xs text-[#8E9DA8] mt-0.5">{todayTemplate.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 my-4 text-xs text-[#8E9DA8]">
              <div>
                <span className="text-white font-black font-number">
                  {todayTemplate.exercises.length}
                </span>{' '}
                bài tập
              </div>
              <div>•</div>
              <div>
                <span className="text-white font-black font-number">
                  ~{todayTemplate.estimatedDurationMinutes}
                </span>{' '}
                phút
              </div>
              <div>•</div>
              <div className="flex gap-1">
                {todayTemplate.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold text-[#0093E7] bg-[#0093E7]/10 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Exercise preview pills with illustration thumbnails */}
            <div className="space-y-2 mb-4">
              {todayTemplate.exercises.slice(0, 3).map((te, idx) => {
                const ex = getExerciseById(te.exerciseId);
                return (
                  <div
                    key={te.id}
                    className="bg-[#1C262C] border border-[#24323A] rounded-2xl p-2.5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Exercise illustration thumbnail */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#24323A] bg-[#131A1E]">
                        {ex?.imageUrl ? (
                          <img
                            src={ex.imageUrl}
                            alt={ex.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-[#24323A]">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-black text-white truncate">
                          {ex?.vietnameseName || ex?.name}
                        </div>
                        <div className="text-[10px] text-[#8E9DA8] truncate">
                          {ex?.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-[#00F19F] font-number">
                        {te.targetSets} hiệp × {te.repMax} reps
                      </div>
                      <div className="text-[10px] text-[#8E9DA8] font-number">
                        {te.targetWeight} kg • {te.restSeconds}s nghỉ
                      </div>
                    </div>
                  </div>
                );
              })}
              {todayTemplate.exercises.length > 3 && (
                <div className="text-[11px] text-[#8E9DA8] text-center pt-1 font-medium">
                  + {todayTemplate.exercises.length - 3} bài tập khác trong giáo án
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            {activeSession ? (
              <button
                onClick={() => setIsWorkoutModalOpen(true)}
                className="w-full py-3.5 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(0,241,159,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>TIẾP TỤC BUỔI TẬP ĐANG DIỄN RA</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  startSession({
                    templateId: todayTemplate.id,
                    scheduledId: todayScheduled?.id,
                    title: todayTemplate.name
                  })
                }
                className="w-full py-3.5 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(0,241,159,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>BẮT ĐẦU BUỔI TẬP (START WORKOUT)</span>
              </button>
            )}
          </div>
        ) : (
          <div className="py-4 text-center space-y-3">
            <p className="text-xs text-[#8E9DA8]">Chưa xếp lịch buổi tập cụ thể cho hôm nay.</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => startSession({ title: 'Buổi tập nhanh' })}
                className="px-4 py-2.5 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(0,241,159,0.3)]"
              >
                Bắt đầu tập tự do
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className="px-4 py-2.5 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] text-white text-xs font-bold rounded-xl"
              >
                Chọn giáo án
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Personal Records (PR) Highlights with illustration thumbnails */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#FFDE00]" />
            Kỷ lục gần đây (Personal Records)
          </span>
          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-bold text-[#00F19F] hover:underline"
          >
            Tất cả PR
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prs.slice(0, 2).map(pr => {
            const ex = getExerciseById(pr.exerciseId);
            return (
              <div
                key={pr.id}
                className="bg-[#131A1E] border border-[#24323A] hover:border-[#FFDE00]/50 rounded-2xl p-3 flex items-center gap-3 transition-colors"
              >
                {/* PR Exercise image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#24323A] bg-[#1C262C] relative">
                  {ex?.imageUrl ? (
                    <img
                      src={ex.imageUrl}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-[#FFDE00]" />
                    </div>
                  )}
                  <span className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70">
                    <Trophy className="w-3 h-3 text-[#FFDE00]" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase text-[#FFDE00] bg-[#FFDE00]/10 px-1.5 py-0.2 rounded">
                    {pr.type === 'heaviest_weight' ? 'Max Weight' : 'Est. 1RM'}
                  </span>
                  <div className="text-xs font-black text-white truncate mt-0.5">
                    {ex?.vietnameseName || ex?.name}
                  </div>
                  <div className="text-base font-black text-[#00F19F] font-number">
                    {pr.value} kg
                    {pr.repsAtWeight ? (
                      <span className="text-xs text-[#8E9DA8] ml-1 font-normal">
                        × {pr.repsAtWeight} reps
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

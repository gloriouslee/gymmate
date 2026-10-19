'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/GymContext';
import {
  Trophy,
  Target,
  TrendingUp,
  History,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  Dumbbell,
  Scale,
  TrendingDown,
  Trash2
} from 'lucide-react';
import { formatDuration, formatWeight, calculateEstimated1RM } from '@/utils/fitness';
import { Goal } from '@/types/gym';

export default function ProgressTab() {
  const {
    prs,
    goals,
    addGoal,
    deleteGoal,
    sessionHistory,
    exercises,
    getExerciseById,
    suggestions,
    acceptSuggestion,
    dismissSuggestion,
    user,
    weightHistory,
    setIsWeightModalOpen,
    deleteBodyWeightEntry
  } = useGym();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'prs' | 'goals' | 'weight' | 'history'>('analytics');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [selectedExerciseFor1RM, setSelectedExerciseFor1RM] = useState('barbell-bench-press');

  // New Goal Form State
  const [newGoalExerciseId, setNewGoalExerciseId] = useState('barbell-bench-press');
  const [newGoalMetric, setNewGoalMetric] = useState<'weight' | 'estimated_1rm'>('weight');
  const [newGoalBaseline, setNewGoalBaseline] = useState(60);
  const [newGoalTarget, setNewGoalTarget] = useState(100);
  const [newGoalDate, setNewGoalDate] = useState('2026-12-31');

  const handleCreateGoal = () => {
    addGoal({
      exerciseId: newGoalExerciseId,
      metric: newGoalMetric,
      baseline: newGoalBaseline,
      target: newGoalTarget,
      current: newGoalBaseline,
      targetDate: newGoalDate
    });
    setShowAddGoalModal(false);
  };

  // Compute Volume History for Chart (reverse chrono to chrono)
  const volumeHistory = [...sessionHistory].reverse().map((s, idx) => ({
    name: `Buổi ${idx + 1}`,
    title: s.title,
    volume: s.totalVolume,
    strain: s.strainScore,
    date: s.startTime.split('T')[0]
  }));

  // Max volume for scaling SVG chart
  const maxVolume = Math.max(1, ...volumeHistory.map(v => v.volume));

  // Compute 1RM data points for selected exercise
  const exercise1RMHistory: { date: string; value: number }[] = [];
  [...sessionHistory].reverse().forEach(s => {
    const ex = s.exercises.find(e => e.exerciseId === selectedExerciseFor1RM);
    if (ex) {
      const bestSet = ex.sets
        .filter(set => set.completed)
        .reduce((max, set) => {
          const est = calculateEstimated1RM(set.actualWeight, set.actualReps);
          return est > max ? est : max;
        }, 0);

      if (bestSet > 0) {
        exercise1RMHistory.push({
          date: s.startTime.split('T')[0],
          value: bestSet
        });
      }
    }
  });

  const max1RM = Math.max(1, ...exercise1RMHistory.map(d => d.value));

  // Bodyweight calculations
  const sortedWeightHistory = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const earliestWeight = sortedWeightHistory.length > 0 ? sortedWeightHistory[0].weight : user.bodyWeight;
  const currentWeight = user.bodyWeight;
  const totalWeightDiff = Math.round((currentWeight - earliestWeight) * 10) / 10;
  const targetDiff = user.targetWeight ? Math.round((currentWeight - user.targetWeight) * 10) / 10 : null;
  const userBmi = user.height
    ? (currentWeight / ((user.height / 100) * (user.height / 100))).toFixed(1)
    : null;

  const allRecordedWeights = sortedWeightHistory.map(w => w.weight);
  if (user.targetWeight) allRecordedWeights.push(user.targetWeight);
  const minWeightRange = allRecordedWeights.length > 0 ? Math.min(...allRecordedWeights) - 2 : 60;
  const maxWeightRange = allRecordedWeights.length > 0 ? Math.max(...allRecordedWeights) + 2 : 90;
  const weightRangeSpan = Math.max(1, maxWeightRange - minWeightRange);

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Sub Tabs Selector */}
      <div className="flex bg-[#131A1E] p-1 rounded-2xl border border-[#24323A] overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'analytics'
              ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
              : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Biểu Đồ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'prs'
              ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
              : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Kỷ Lục PR</span>
        </button>

        <button
          onClick={() => setActiveSubTab('goals')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'goals'
              ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
              : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Mục Tiêu</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weight')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weight'
              ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
              : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Cân Nặng</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeSubTab === 'history'
              ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
              : 'text-[#8E9DA8] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Lịch Sử</span>
        </button>
      </div>

      {/* --- ANALYTICS TAB --- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          {/* Workout Volume Trend Chart */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0093E7]">
                  KHỐI LƯỢNG TÍCH LŨY (TOTAL VOLUME)
                </span>
                <h3 className="text-base font-black text-white">Xu hướng khối lượng theo buổi tập</h3>
              </div>
              <span className="text-xs bg-[#1C262C] border border-[#24323A] px-2.5 py-1 rounded-xl text-[#8E9DA8]">
                {sessionHistory.length} buổi tập gần nhất
              </span>
            </div>

            {/* SVG Interactive Bar Chart */}
            <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-[#24323A]/60">
              {volumeHistory.map((item, idx) => {
                const heightPercent = maxVolume > 0 ? (item.volume / maxVolume) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip value */}
                    <div className="text-[9px] font-bold text-[#00F19F] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-number">
                      {Math.round(item.volume / 1000)}k
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${Math.max(10, heightPercent)}%` }}
                      className="w-full bg-gradient-to-t from-[#0093E7]/40 to-[#00F19F] rounded-t-lg group-hover:brightness-125 transition-all shadow-[0_0_10px_rgba(0,241,159,0.2)]"
                    />
                    {/* Label */}
                    <div className="text-[9px] text-[#8E9DA8] mt-2 truncate w-full text-center">
                      {item.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-[#8E9DA8]">
              <span>Cột cao thể hiện tổng khối lượng tạ (weight × reps) tăng tiến.</span>
              <span className="text-[#00F19F] font-bold">Max: {maxVolume.toLocaleString()} kg</span>
            </div>
          </div>

          {/* 1RM Progression for Exercise */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F19F]">
                  SỨC MẠNH TỐI ĐA (ESTIMATED 1RM)
                </span>
                <h3 className="text-base font-black text-white">Tiến độ 1RM theo bài tập</h3>
              </div>

              {/* Select Exercise with thumbnail */}
              <div className="flex items-center gap-2 bg-[#1C262C] border border-[#24323A] rounded-2xl p-1.5">
                {(() => {
                  const selEx = getExerciseById(selectedExerciseFor1RM);
                  return selEx?.imageUrl ? (
                    <img
                      src={selEx.imageUrl}
                      alt={selEx.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#24323A] shrink-0"
                    />
                  ) : null;
                })()}
                <select
                  value={selectedExerciseFor1RM}
                  onChange={e => setSelectedExerciseFor1RM(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold rounded-xl pr-2 focus:outline-none"
                >
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id} className="bg-[#1C262C] text-white">
                      {ex.vietnameseName} ({ex.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {exercise1RMHistory.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8E9DA8] border border-dashed border-[#24323A] rounded-2xl">
                Chưa có dữ liệu hiệp tập hoàn thành cho bài này trong lịch sử.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="h-36 w-full flex items-end gap-4 pt-4 pb-2 px-2 border-b border-[#24323A]/60">
                  {exercise1RMHistory.map((point, idx) => {
                    const h = max1RM > 0 ? (point.value / max1RM) * 100 : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div className="text-[10px] font-black text-[#FFDE00] font-number mb-1">
                          {point.value}kg
                        </div>
                        <div
                          style={{ height: `${Math.max(15, h)}%` }}
                          className="w-full bg-[#FFDE00] rounded-t-lg group-hover:brightness-125 transition-all shadow-[0_0_12px_rgba(255,222,0,0.3)]"
                        />
                        <div className="text-[9px] text-[#8E9DA8] mt-2">{point.date.slice(5)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-[#8E9DA8] flex justify-between">
                  <span>Công thức Epley: 1RM = Trọng lượng × (1 + Số lần / 30)</span>
                  <span className="text-[#FFDE00] font-bold">1RM Kỷ lục: {max1RM} kg</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PERSONAL RECORDS (PRS) TAB --- */}
      {activeSubTab === 'prs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#FFDE00]" />
              Bảng Vàng Thành Tích (Hall of PRs)
            </span>
            <span className="text-xs text-[#8E9DA8]">{prs.length} kỷ lục đã ghi nhận</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prs.map(pr => {
              const ex = getExerciseById(pr.exerciseId);
              return (
                <div
                  key={pr.id}
                  className="bg-[#131A1E] border border-[#24323A] hover:border-[#FFDE00]/50 rounded-2xl p-4 space-y-3 transition-colors relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    {/* Illustration image thumbnail */}
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
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#FFDE00] bg-[#FFDE00]/10 px-1.5 py-0.2 rounded-lg">
                          {pr.type === 'heaviest_weight'
                            ? 'Max Weight'
                            : 'Est. 1RM'}
                        </span>
                        <span className="text-[10px] text-[#8E9DA8]">
                          {new Date(pr.achievedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-white truncate mt-1">
                        {ex?.vietnameseName || ex?.name}
                      </h4>
                      <p className="text-[10px] text-[#8E9DA8] truncate">{ex?.name}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-baseline justify-between border-t border-[#24323A]/50">
                    <span className="text-[10px] uppercase font-bold text-[#8E9DA8]">Thành tích:</span>
                    <div className="text-xl font-black text-[#00F19F] font-number">
                      {pr.value} kg
                      {pr.repsAtWeight && (
                        <span className="text-xs text-[#8E9DA8] font-normal ml-1">
                          × {pr.repsAtWeight} reps
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- GOALS TAB --- */}
      {activeSubTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#00F19F]" />
              Mục Tiêu Tập Luyện (Goals)
            </span>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="px-3 py-1.5 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1 shadow-[0_0_12px_rgba(0,241,159,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Mục Tiêu</span>
            </button>
          </div>

          <div className="space-y-3">
            {goals.map(goal => {
              const ex = getExerciseById(goal.exerciseId);
              const progressPercent = Math.min(
                100,
                Math.max(
                  0,
                  Math.round(
                    ((goal.current - goal.baseline) / (goal.target - goal.baseline)) * 100
                  )
                )
              );
              const isAchieved = goal.current >= goal.target || goal.status === 'achieved';

              return (
                <div
                  key={goal.id}
                  className={`bg-[#131A1E] border rounded-2xl p-4 space-y-3 transition-colors ${
                    isAchieved ? 'border-[#16EC06]/60 bg-[#16EC06]/5' : 'border-[#24323A]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Exercise illustration thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#24323A] bg-[#1C262C]">
                        {ex?.imageUrl ? (
                          <img
                            src={ex.imageUrl}
                            alt={ex.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#00F19F]">
                            <Target className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">
                            {ex?.vietnameseName || ex?.name}
                          </h4>
                          {isAchieved && (
                            <span className="text-[9px] font-black text-[#16EC06] bg-[#16EC06]/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> ĐẠT MỤC TIÊU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8E9DA8]">
                          Mục tiêu:{' '}
                          {goal.metric === 'weight' ? 'Mức tạ hiệp tập' : '1RM ước tính'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-[#8E9DA8] hover:text-red-400 p-1"
                      title="Xóa mục tiêu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-number">
                      <span className="text-[#8E9DA8]">
                        Hiện tại: <strong className="text-white">{goal.current} kg</strong>
                      </span>
                      <span className="text-[#00F19F] font-black">{progressPercent}%</span>
                      <span className="text-[#8E9DA8]">
                        Target: <strong className="text-[#00F19F]">{goal.target} kg</strong>
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-[#1C262C] rounded-full overflow-hidden border border-[#24323A]">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAchieved ? 'bg-[#16EC06]' : 'bg-[#00F19F]'
                        }`}
                      />
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="flex items-center justify-between text-[10px] text-[#8E9DA8] pt-1 border-t border-[#24323A]/50">
                      <span>Thời hạn mục tiêu:</span>
                      <span className="font-bold text-white">{goal.targetDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- WEIGHT TAB --- */}
      {activeSubTab === 'weight' && (
        <div className="space-y-4">
          {/* Header & Quick Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00F19F] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                THEO DÕI THỂ TRỌNG (BODY WEIGHT)
              </span>
              <h3 className="text-base font-black text-white">Tiến trình thay đổi cân nặng</h3>
            </div>
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="px-3.5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,241,159,0.3)] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi Cân Nặng</span>
            </button>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Current Weight */}
            <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#8E9DA8] block">Hiện Tại</span>
              <div className="text-2xl font-black text-white font-number mt-1">
                {currentWeight}{' '}
                <span className="text-xs text-[#8E9DA8] font-normal font-sans">{user.unit}</span>
              </div>
              <span className="text-[10px] text-[#00F19F] block mt-1">
                Cập nhật: {weightHistory.length > 0 ? weightHistory[0].date : 'Hôm nay'}
              </span>
            </div>

            {/* Target Weight */}
            <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#8E9DA8] block">Mục Tiêu</span>
              <div className="text-2xl font-black text-[#0093E7] font-number mt-1">
                {user.targetWeight || '--'}{' '}
                <span className="text-xs text-[#8E9DA8] font-normal font-sans">{user.unit}</span>
              </div>
              <span className="text-[10px] text-[#8E9DA8] block mt-1">
                {targetDiff !== null
                  ? targetDiff === 0
                    ? '🎯 Đã đạt mục tiêu!'
                    : targetDiff > 0
                    ? `Cần giảm ${targetDiff} kg`
                    : `Cần tăng ${Math.abs(targetDiff)} kg`
                  : 'Chưa đặt'}
              </span>
            </div>

            {/* Total Change */}
            <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#8E9DA8] block">Biến Thiên</span>
              <div
                className={`text-2xl font-black font-number mt-1 flex items-center gap-1 ${
                  totalWeightDiff <= 0 ? 'text-[#00F19F]' : 'text-[#FFDE00]'
                }`}
              >
                {totalWeightDiff <= 0 ? (
                  <TrendingDown className="w-5 h-5" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                <span>{totalWeightDiff > 0 ? `+${totalWeightDiff}` : totalWeightDiff} kg</span>
              </div>
              <span className="text-[10px] text-[#8E9DA8] block mt-1">
                Kể từ {earliestWeight} kg
              </span>
            </div>

            {/* BMI Index */}
            <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4">
              <span className="text-[10px] uppercase font-bold text-[#8E9DA8] block">Chỉ Số BMI</span>
              <div className="text-2xl font-black text-white font-number mt-1">
                {userBmi || '--'}
              </div>
              <span className="text-[10px] text-[#8E9DA8] block mt-1">
                {userBmi
                  ? Number(userBmi) < 18.5
                    ? 'Hơi gầy'
                    : Number(userBmi) < 25
                    ? 'Lý tưởng (Chuẩn)'
                    : 'Thừa cân'
                  : 'Cần cập nhật chiều cao'}
              </span>
            </div>
          </div>

          {/* Bodyweight Trend Chart Card */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F19F]">
                  BIỂU ĐỒ DIỄN BIẾN (WEIGHT PROGRESSION)
                </span>
                <h3 className="text-base font-black text-white">Xu hướng thay đổi thể trọng</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8E9DA8]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F19F]" />
                  <span>Thực tế</span>
                </div>
                {user.targetWeight && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t border-dashed border-[#0093E7]" />
                    <span>Mục tiêu ({user.targetWeight} kg)</span>
                  </div>
                )}
              </div>
            </div>

            {/* SVG Visual Representation */}
            {sortedWeightHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8E9DA8] border border-dashed border-[#24323A] rounded-2xl">
                Chưa có dữ liệu cân nặng nào được ghi nhận. Bấm &quot;Ghi Cân Nặng&quot; để bắt đầu theo dõi.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-52 w-full pt-4 pb-2 px-2 relative flex flex-col justify-between">
                  {/* Target reference line */}
                  {user.targetWeight && (
                    <div
                      style={{
                        bottom: `${((user.targetWeight - minWeightRange) / weightRangeSpan) * 100}%`
                      }}
                      className="absolute left-0 right-0 border-b border-dashed border-[#0093E7]/60 pointer-events-none z-0 flex items-center justify-end pr-2"
                    >
                      <span className="text-[9px] font-black text-[#0093E7] bg-[#131A1E] px-1 -translate-y-1/2">
                        Mục tiêu: {user.targetWeight}kg
                      </span>
                    </div>
                  )}

                  {/* SVG Chart */}
                  <svg className="w-full h-40 overflow-visible z-10" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F19F" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00F19F" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Polygon fill under curve */}
                    {(() => {
                      const points = sortedWeightHistory.map((item, idx) => {
                        const count = sortedWeightHistory.length;
                        const x = count === 1 ? 500 : (idx / (count - 1)) * 960 + 20;
                        const y = 180 - ((item.weight - minWeightRange) / weightRangeSpan) * 150;
                        return `${x},${y}`;
                      });
                      const firstX = sortedWeightHistory.length === 1 ? 500 : 20;
                      const lastX = sortedWeightHistory.length === 1 ? 500 : 980;
                      return (
                        <polygon
                          points={`${firstX},190 ${points.join(' ')} ${lastX},190`}
                          fill="url(#weightGrad)"
                        />
                      );
                    })()}

                    {/* Polyline connecting points */}
                    {sortedWeightHistory.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#00F19F"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={sortedWeightHistory
                          .map((item, idx) => {
                            const count = sortedWeightHistory.length;
                            const x = (idx / (count - 1)) * 960 + 20;
                            const y = 180 - ((item.weight - minWeightRange) / weightRangeSpan) * 150;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {/* Circles for each point */}
                    {sortedWeightHistory.map((item, idx) => {
                      const count = sortedWeightHistory.length;
                      const x = count === 1 ? 500 : (idx / (count - 1)) * 960 + 20;
                      const y = 180 - ((item.weight - minWeightRange) / weightRangeSpan) * 150;
                      return (
                        <g key={item.id} className="cursor-pointer group">
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            className="fill-[#131A1E] stroke-[#00F19F] stroke-[3px] group-hover:r-[8px] transition-all"
                          />
                          <circle cx={x} cy={y} r="2.5" fill="#00F19F" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Horizontal Dates Label Row */}
                  <div className="flex justify-between items-center text-[10px] text-[#8E9DA8] pt-2 border-t border-[#24323A]/50">
                    {sortedWeightHistory.map((item) => (
                      <div key={item.id} className="text-center">
                        <span className="font-bold text-white block">{item.weight}kg</span>
                        <span className="text-[9px] text-[#8E9DA8]">{item.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weigh-in History List */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#00F19F]" />
                Lịch Sử Các Lần Ghi Nhận ({weightHistory.length})
              </span>
              <button
                onClick={() => setIsWeightModalOpen(true)}
                className="text-xs text-[#00F19F] hover:underline font-bold"
              >
                + Thêm bản ghi mới
              </button>
            </div>

            <div className="space-y-2">
              {weightHistory.map((entry, idx) => {
                const nextEntry = weightHistory[idx + 1];
                const diffFromPrev = nextEntry
                  ? Math.round((entry.weight - nextEntry.weight) * 10) / 10
                  : null;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#172127] border border-[#24323A] hover:border-[#00F19F]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1C262C] border border-[#24323A] flex items-center justify-center text-[#00F19F] shrink-0">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white font-number">
                            {entry.weight} {user.unit}
                          </span>
                          {diffFromPrev !== null && (
                            <span
                              className={`text-[10px] font-bold font-number px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                                diffFromPrev <= 0
                                  ? 'text-[#00F19F] bg-[#00F19F]/10'
                                  : 'text-[#FFDE00] bg-[#FFDE00]/10'
                              }`}
                            >
                              {diffFromPrev <= 0 ? (
                                <TrendingDown className="w-3 h-3" />
                              ) : (
                                <TrendingUp className="w-3 h-3" />
                              )}
                              {diffFromPrev > 0 ? `+${diffFromPrev}` : diffFromPrev} kg
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#8E9DA8]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.date).toLocaleDateString('vi-VN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                          {entry.note && (
                            <>
                              <span>•</span>
                              <span className="italic truncate max-w-xs">{entry.note}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteBodyWeightEntry(entry.id)}
                      className="p-2 rounded-xl text-[#8E9DA8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- HISTORY TAB --- */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#0093E7]" />
              Nhật Ký Các Buổi Tập (Workout Logs)
            </span>
            <span className="text-xs text-[#8E9DA8]">{sessionHistory.length} buổi</span>
          </div>

          <div className="space-y-3">
            {sessionHistory.map(session => (
              <div
                key={session.id}
                className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">{session.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#8E9DA8] mt-0.5">
                      <span className="flex items-center gap-1 font-number">
                        <Calendar className="w-3 h-3 text-[#00F19F]" />
                        {new Date(session.startTime).toLocaleDateString('vi-VN')}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(session.durationSeconds)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-[#0093E7] bg-[#0093E7]/10 px-2 py-0.5 rounded-lg">
                      Strain: {session.strainScore.toFixed(1)}
                    </span>
                    <div className="text-xs font-bold text-white font-number mt-1">
                      {formatWeight(session.totalVolume, user.unit)}
                    </div>
                  </div>
                </div>

                {/* Exercises summary */}
                <div className="space-y-1 pt-1 border-t border-[#24323A]/50">
                  {session.exercises.map(se => {
                    const ex = getExerciseById(se.exerciseId);
                    const completedSets = se.sets.filter(s => s.completed);
                    return (
                      <div
                        key={se.id}
                        className="flex items-center justify-between text-xs text-[#8E9DA8]"
                      >
                        <span className="text-white font-medium">
                          {ex?.vietnameseName || ex?.name}
                        </span>
                        <span className="font-number font-bold text-[#7BA1BB]">
                          {completedSets.length} sets completed
                        </span>
                      </div>
                    );
                  })}
                </div>

                {session.notes && (
                  <div className="text-xs bg-[#1C262C] rounded-xl p-2 text-[#8E9DA8] italic">
                    &quot;{session.notes}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ADD GOAL MODAL --- */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Thêm Mục Tiêu Tập Luyện</h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="w-7 h-7 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Chọn bài tập
                </label>
                <select
                  value={newGoalExerciseId}
                  onChange={e => setNewGoalExerciseId(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                >
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.vietnameseName} ({ex.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Loại chỉ số
                </label>
                <select
                  value={newGoalMetric}
                  onChange={e => setNewGoalMetric(e.target.value as 'weight' | 'estimated_1rm')}
                  className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                >
                  <option value="weight">Mức tạ tập luyện (Weight)</option>
                  <option value="estimated_1rm">1RM Ước tính (Estimated 1RM)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                    Mức gốc (kg)
                  </label>
                  <input
                    type="number"
                    value={newGoalBaseline}
                    onChange={e => setNewGoalBaseline(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                    Mục tiêu (kg)
                  </label>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={e => setNewGoalTarget(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Hạn mục tiêu (Target Date)
                </label>
                <input
                  type="date"
                  value={newGoalDate}
                  onChange={e => setNewGoalDate(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCreateGoal}
                className="w-full py-2.5 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)]"
              >
                Tạo Mục Tiêu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

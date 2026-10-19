'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/GymContext';
import {
  X,
  Plus,
  Trash2,
  Check,
  Clock,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Link2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatDuration, formatWeight } from '@/utils/fitness';

export default function ActiveWorkoutModal() {
  const {
    activeSession,
    isWorkoutModalOpen,
    setIsWorkoutModalOpen,
    exercises,
    getExerciseById,
    updateActiveSessionNotes,
    updateSetLog,
    addSetToExercise,
    removeSetFromExercise,
    addExerciseToActiveSession,
    finishActiveSession,
    cancelActiveSession,
    user,
    sessionHistory
  } = useGym();

  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({});

  if (!activeSession || !isWorkoutModalOpen) return null;

  const toggleCollapse = (exerciseId: string) => {
    setCollapsedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleFinish = () => {
    finishActiveSession();
  };

  // Filter exercises for adding to active session
  const filteredAvailableExercises = exercises.filter(
    e =>
      e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      e.vietnameseName.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F12] flex flex-col overflow-hidden animate-in fade-in">
      {/* Top Bar */}
      <div className="bg-[#131A1E] border-b border-[#24323A] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWorkoutModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] flex items-center justify-center text-[#8E9DA8] hover:text-white transition-colors"
            title="Thu nhỏ cửa sổ"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>{activeSession.title}</span>
              <span className="w-2 h-2 rounded-full bg-[#00F19F] animate-ping" />
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#8E9DA8]">
              <span className="flex items-center gap-1 font-number">
                <Clock className="w-3.5 h-3.5 text-[#0093E7]" />
                {formatDuration(activeSession.durationSeconds)}
              </span>
              <span>•</span>
              <span className="text-[#00F19F] font-bold">
                {activeSession.totalCompletedSets} hiệp hoàn thành
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleFinish}
            className="px-4 py-1.5 rounded-xl bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,241,159,0.4)] transition-all active:scale-95"
          >
            KẾT THÚC
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full pb-32">
        {/* Session Stats Banner */}
        <div className="grid grid-cols-3 gap-2 bg-[#131A1E] border border-[#24323A] p-3 rounded-2xl">
          <div className="text-center border-r border-[#24323A]">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Khối lượng</div>
            <div className="text-sm font-black text-white font-number">
              {formatWeight(activeSession.totalVolume, user.unit)}
            </div>
          </div>
          <div className="text-center border-r border-[#24323A]">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Hoàn thành</div>
            <div className="text-sm font-black text-[#00F19F] font-number">
              {activeSession.targetCompletionRate}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Strain ước tính</div>
            <div className="text-sm font-black text-[#0093E7] font-number">
              {activeSession.strainScore.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Exercises List */}
        {activeSession.exercises.map((se, index) => {
          const exInfo = getExerciseById(se.exerciseId);
          const isCollapsed = collapsedExercises[se.exerciseId];

          // Lookup previous session data for this exercise
          const prevSession = sessionHistory.find(s =>
            s.exercises.some(e => e.exerciseId === se.exerciseId)
          );
          const prevEx = prevSession?.exercises.find(e => e.exerciseId === se.exerciseId);
          const prevBestSet = prevEx?.sets?.find(s => s.completed) || prevEx?.sets?.[0];

          return (
            <div
              key={se.id}
              className={`bg-[#131A1E] border rounded-2xl overflow-hidden transition-all ${
                se.supersetGroupId ? 'border-[#0093E7]/60 shadow-[0_0_15px_rgba(0,147,231,0.15)]' : 'border-[#24323A]'
              }`}
            >
              {/* Exercise Header */}
              <div className="p-3 bg-[#172127] border-b border-[#24323A] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Exercise Image Thumbnail */}
                  {exInfo?.imageUrl ? (
                    <img
                      src={exInfo.imageUrl}
                      alt={exInfo.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#24323A] shrink-0"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-lg bg-[#24323A] text-white text-xs font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-white">
                        {exInfo?.vietnameseName || exInfo?.name || 'Bài tập'}
                      </h3>
                      {se.supersetGroupId && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-[#0093E7] bg-[#0093E7]/15 px-1.5 py-0.2 rounded">
                          <Link2 className="w-3 h-3" /> Superset
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8E9DA8] font-medium">{exInfo?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleCollapse(se.exerciseId)}
                    className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="p-3.5 space-y-3">
                  {/* Previous Result Hint */}
                  {prevBestSet && (
                    <div className="bg-[#1C262C]/60 border border-[#24323A] rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
                      <span className="text-[#8E9DA8] font-medium">Buổi gần nhất:</span>
                      <span className="font-bold text-[#7BA1BB] font-number">
                        {prevBestSet.actualWeight}kg × {prevBestSet.actualReps} reps
                      </span>
                    </div>
                  )}

                  {/* Sets Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[#8E9DA8] text-[10px] uppercase font-bold tracking-wider border-b border-[#24323A]/50 pb-2">
                          <th className="w-10 pb-2">Set</th>
                          <th className="pb-2">Mục tiêu</th>
                          <th className="w-24 pb-2 text-center">Tạ ({user.unit})</th>
                          <th className="w-20 pb-2 text-center">Reps</th>
                          <th className="w-14 pb-2 text-center">RPE</th>
                          <th className="w-12 pb-2 text-center">Xong</th>
                          <th className="w-8 pb-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#24323A]/30">
                        {se.sets.map((set, setIndex) => (
                          <tr
                            key={set.id}
                            className={`transition-colors ${
                              set.completed ? 'bg-[#00F19F]/5' : 'hover:bg-[#1C262C]/40'
                            }`}
                          >
                            {/* Set # */}
                            <td className="py-2.5 font-bold font-number text-white">
                              {set.setNumber}
                            </td>

                            {/* Target */}
                            <td className="py-2.5 text-[#8E9DA8] text-[11px] font-number">
                              {set.targetWeight}kg × {set.targetReps}
                            </td>

                            {/* Actual Weight with quick adjust */}
                            <td className="py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualWeight: Math.max(0, set.actualWeight - 2.5)
                                    })
                                  }
                                  className="w-5 h-6 bg-[#1C262C] hover:bg-[#24323A] rounded text-[#8E9DA8] hover:text-white font-bold"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={set.actualWeight}
                                  onChange={e =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualWeight: parseFloat(e.target.value) || 0
                                    })
                                  }
                                  className="w-12 text-center bg-[#1C262C] border border-[#24323A] rounded-lg py-1 text-white font-black font-number text-xs focus:border-[#00F19F] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualWeight: set.actualWeight + 2.5
                                    })
                                  }
                                  className="w-5 h-6 bg-[#1C262C] hover:bg-[#24323A] rounded text-[#8E9DA8] hover:text-white font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Actual Reps with quick adjust */}
                            <td className="py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualReps: Math.max(0, set.actualReps - 1)
                                    })
                                  }
                                  className="w-5 h-6 bg-[#1C262C] hover:bg-[#24323A] rounded text-[#8E9DA8] hover:text-white font-bold"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={set.actualReps}
                                  onChange={e =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualReps: parseInt(e.target.value) || 0
                                    })
                                  }
                                  className="w-10 text-center bg-[#1C262C] border border-[#24323A] rounded-lg py-1 text-white font-black font-number text-xs focus:border-[#00F19F] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSetLog(se.exerciseId, set.id, {
                                      actualReps: set.actualReps + 1
                                    })
                                  }
                                  className="w-5 h-6 bg-[#1C262C] hover:bg-[#24323A] rounded text-[#8E9DA8] hover:text-white font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* RPE */}
                            <td className="py-2.5 text-center">
                              <input
                                type="number"
                                min="6"
                                max="10"
                                step="0.5"
                                value={set.rpe}
                                onChange={e =>
                                  updateSetLog(se.exerciseId, set.id, {
                                    rpe: parseFloat(e.target.value) || 8
                                  })
                                }
                                className="w-10 text-center bg-[#1C262C] border border-[#24323A] rounded-lg py-1 text-[#8E9DA8] font-bold font-number text-xs focus:border-[#00F19F] focus:outline-none"
                              />
                            </td>

                            {/* Completed Checkbox Button */}
                            <td className="py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  updateSetLog(se.exerciseId, set.id, {
                                    completed: !set.completed
                                  })
                                }
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                  set.completed
                                    ? 'bg-[#16EC06] text-black shadow-[0_0_12px_rgba(22,236,6,0.4)]'
                                    : 'bg-[#1C262C] border border-[#24323A] text-[#8E9DA8] hover:border-[#16EC06]'
                                }`}
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                              </button>
                            </td>

                            {/* Delete set */}
                            <td className="py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => removeSetFromExercise(se.exerciseId, set.id)}
                                className="text-[#8E9DA8] hover:text-red-400 p-1"
                                title="Xóa hiệp"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Set Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => addSetToExercise(se.exerciseId)}
                      className="w-full py-2 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#00F19F]" />
                      <span>Thêm hiệp tập (Add Set)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Exercise to Workout Button */}
        <button
          onClick={() => setShowAddExerciseModal(true)}
          className="w-full py-3.5 bg-[#131A1E] hover:bg-[#1C262C] border border-dashed border-[#24323A] hover:border-[#00F19F] rounded-2xl text-xs font-bold text-[#8E9DA8] hover:text-[#00F19F] flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm bài tập vào buổi tập (+ Add Exercise)</span>
        </button>

        {/* Workout Notes */}
        <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-3.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#8E9DA8] mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0093E7]" />
            Ghi chú buổi tập
          </label>
          <textarea
            value={activeSession.notes}
            onChange={e => updateActiveSessionNotes(e.target.value)}
            placeholder="Cảm nhận hôm nay, nhóm cơ bị mỏi, năng lượng..."
            rows={2}
            className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl p-2.5 text-xs text-white placeholder-[#8E9DA8]/60 focus:border-[#00F19F] focus:outline-none"
          />
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white">Thêm bài tập</h3>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-[#24323A]">
              <input
                type="text"
                placeholder="Tìm bài tập (tên, nhóm cơ)..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8E9DA8] focus:border-[#00F19F] focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredAvailableExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    addExerciseToActiveSession(ex.id);
                    setShowAddExerciseModal(false);
                  }}
                  className="p-3 bg-[#172127] hover:bg-[#1C262C] border border-[#24323A] hover:border-[#00F19F] rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{ex.vietnameseName}</div>
                    <div className="text-[10px] text-[#8E9DA8]">{ex.name}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#00F19F] bg-[#00F19F]/10 px-2 py-0.5 rounded">
                    {ex.muscleGroup}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-red-500/40 rounded-3xl p-5 max-w-sm w-full text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-base font-black text-white">Bạn muốn hủy buổi tập?</h3>
            <p className="text-xs text-[#8E9DA8]">
              Dữ liệu của các hiệp tập chưa hoàn thành sẽ không được lưu vào lịch sử.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 bg-[#1C262C] rounded-xl text-xs font-bold text-white"
              >
                Tiếp tục tập
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  cancelActiveSession();
                }}
                className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl text-xs font-bold text-red-400"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

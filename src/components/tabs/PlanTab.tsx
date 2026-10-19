'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/GymContext';
import {
  CalendarDays,
  Plus,
  Play,
  Trash2,
  Edit2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Moon,
  Clock,
  Dumbbell,
  Link2,
  Check,
  X,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { WorkoutTemplate, TemplateExercise } from '@/types/gym';

export default function PlanTab() {
  const {
    schedule,
    templates,
    getTemplateById,
    scheduleWorkoutOnDate,
    moveScheduledWorkout,
    markDayAsRest,
    deleteScheduledWorkout,
    saveTemplate,
    deleteTemplate,
    exercises,
    getExerciseById,
    startSession
  } = useGym();

  const [viewMode, setViewMode] = useState<'calendar' | 'templates'>('calendar');
  const [weekOffset, setWeekOffset] = useState(0);

  // Drag and drop states
  const [draggedTemplateId, setDraggedTemplateId] = useState<string | null>(null);
  const [draggedScheduleId, setDraggedScheduleId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Template editor modal state
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Quick schedule action modal for mobile
  const [schedulingDate, setSchedulingDate] = useState<string | null>(null);

  // Calculate dates of the selected week
  const getDaysOfWeek = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday + offset * 7);

    const days = [];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const scheduledItems = schedule.filter(s => s.date === dStr);
      days.push({
        dateStr: dStr,
        dayName: dayNames[i],
        dayNumber: d.getDate(),
        month: d.getMonth() + 1,
        isToday: dStr === todayStr,
        scheduled: scheduledItems
      });
    }
    return days;
  };

  const currentDays = getDaysOfWeek(weekOffset);

  // HTML5 Drag and drop handlers
  const handleDragStartTemplate = (e: React.DragEvent, templateId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'template', id: templateId }));
    setDraggedTemplateId(templateId);
  };

  const handleDragStartScheduled = (e: React.DragEvent, schedId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'scheduled', id: schedId }));
    setDraggedScheduleId(schedId);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDragOverDate(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.type === 'template') {
        scheduleWorkoutOnDate(targetDate, data.id);
      } else if (data.type === 'scheduled') {
        moveScheduledWorkout(data.id, targetDate);
      }
    } catch {
      // fallback
    }

    setDraggedTemplateId(null);
    setDraggedScheduleId(null);
  };

  // Template builder helpers
  const handleCreateNewTemplate = () => {
    const newTmpl: WorkoutTemplate = {
      id: `tmpl-${Date.now()}`,
      name: 'Giáo án mới',
      description: 'Mô tả mục tiêu buổi tập...',
      tags: ['Hypertrophy'],
      estimatedDurationMinutes: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: []
    };
    setEditingTemplate(newTmpl);
    setShowTemplateModal(true);
  };

  const handleAddExerciseToTemplate = (exId: string) => {
    if (!editingTemplate) return;
    const newEx: TemplateExercise = {
      id: `te-${Date.now()}-${editingTemplate.exercises.length + 1}`,
      exerciseId: exId,
      order: editingTemplate.exercises.length + 1,
      targetSets: 3,
      repMin: 8,
      repMax: 12,
      targetWeight: 60,
      targetRpe: 8,
      targetRir: 2,
      restSeconds: 90
    };
    setEditingTemplate({
      ...editingTemplate,
      exercises: [...editingTemplate.exercises, newEx]
    });
    setShowExercisePicker(false);
  };

  const handleRemoveExerciseFromTemplate = (teId: string) => {
    if (!editingTemplate) return;
    const updated = editingTemplate.exercises.filter(e => e.id !== teId);
    setEditingTemplate({
      ...editingTemplate,
      exercises: updated.map((e, idx) => ({ ...e, order: idx + 1 }))
    });
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (!editingTemplate) return;
    const items = [...editingTemplate.exercises];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    setEditingTemplate({
      ...editingTemplate,
      exercises: items.map((e, idx) => ({ ...e, order: idx + 1 }))
    });
  };

  const handleToggleSuperset = (index: number) => {
    if (!editingTemplate || index >= editingTemplate.exercises.length - 1) return;
    const items = [...editingTemplate.exercises];
    const current = items[index];
    const next = items[index + 1];

    if (current.supersetGroupId) {
      // Remove superset
      current.supersetGroupId = undefined;
      next.supersetGroupId = undefined;
    } else {
      const newGroupId = `ss-${Date.now()}`;
      current.supersetGroupId = newGroupId;
      next.supersetGroupId = newGroupId;
    }

    setEditingTemplate({
      ...editingTemplate,
      exercises: items
    });
  };

  const handleSaveTemplateModal = () => {
    if (!editingTemplate) return;
    saveTemplate(editingTemplate);
    setShowTemplateModal(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Top Toggle Switch */}
      <div className="flex items-center justify-between">
        <div className="flex bg-[#131A1E] p-1 rounded-2xl border border-[#24323A]">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
                : 'text-[#8E9DA8] hover:text-white'
            }`}
          >
            Lịch Tuần (Calendar)
          </button>
          <button
            onClick={() => setViewMode('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === 'templates'
                ? 'bg-[#00F19F] text-black shadow-[0_0_15px_rgba(0,241,159,0.3)]'
                : 'text-[#8E9DA8] hover:text-white'
            }`}
          >
            Giáo Án (Templates)
          </button>
        </div>

        {viewMode === 'templates' && (
          <button
            onClick={handleCreateNewTemplate}
            className="px-3.5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,241,159,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Giáo Án</span>
          </button>
        )}
      </div>

      {/* --- CALENDAR VIEW --- */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Week Selector Nav */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-3 flex items-center justify-between">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-[#8E9DA8] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {weekOffset === 0
                  ? 'Tuần này'
                  : weekOffset > 0
                  ? `${weekOffset} tuần tới`
                  : `${Math.abs(weekOffset)} tuần trước`}
              </span>
              <div className="text-[10px] text-[#8E9DA8]">
                {currentDays[0].dayNumber}/{currentDays[0].month} - {currentDays[6].dayNumber}/
                {currentDays[6].month}
              </div>
            </div>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-[#8E9DA8] hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Draggable Template Quick Drawer */}
          <div className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00F19F] flex items-center gap-1">
                <GripVertical className="w-3.5 h-3.5 text-[#00F19F]" />
                Kéo thả giáo án vào ngày trong tuần (Drag & Drop)
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {templates.map(tmpl => (
                <div
                  key={tmpl.id}
                  draggable
                  onDragStart={e => handleDragStartTemplate(e, tmpl.id)}
                  onClick={() => {
                    // Mobile friendly: tap to pick date
                    setSchedulingDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="shrink-0 bg-[#172127] hover:bg-[#1C262C] active:scale-95 border border-[#24323A] hover:border-[#00F19F] px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing text-xs text-white transition-all flex items-center gap-2 group"
                >
                  <GripVertical className="w-3.5 h-3.5 text-[#8E9DA8] group-hover:text-[#00F19F]" />
                  <div>
                    <div className="font-bold whitespace-nowrap">{tmpl.name}</div>
                    <div className="text-[10px] text-[#8E9DA8]">{tmpl.exercises.length} bài tập</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Days Calendar Grid */}
          <div className="space-y-2.5">
            {currentDays.map(day => {
              const isDragOver = dragOverDate === day.dateStr;

              return (
                <div
                  key={day.dateStr}
                  onDragOver={e => handleDragOver(e, day.dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, day.dateStr)}
                  className={`bg-[#131A1E] border rounded-2xl p-3.5 transition-all ${
                    isDragOver
                      ? 'border-[#00F19F] bg-[#00F19F]/10 scale-[1.01]'
                      : day.isToday
                      ? 'border-[#00F19F]/60 shadow-[0_0_15px_rgba(0,241,159,0.15)]'
                      : 'border-[#24323A]'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#24323A]/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black uppercase px-2 py-0.5 rounded-lg ${
                          day.isToday ? 'bg-[#00F19F] text-black' : 'bg-[#1C262C] text-[#8E9DA8]'
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="text-xs font-bold text-white font-number">
                        {day.dayNumber}/{day.month}
                      </span>
                      {day.isToday && (
                        <span className="text-[10px] font-bold text-[#00F19F] uppercase tracking-wide">
                          (Hôm nay)
                        </span>
                      )}
                    </div>

                    {/* Quick Day Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => markDayAsRest(day.dateStr)}
                        className="px-2 py-1 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-lg text-[10px] font-bold text-[#7BA1BB] flex items-center gap-1"
                        title="Đánh dấu ngày nghỉ"
                      >
                        <Moon className="w-3 h-3" />
                        <span>Nghỉ</span>
                      </button>
                      <button
                        onClick={() => setSchedulingDate(day.dateStr)}
                        className="px-2 py-1 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-lg text-[10px] font-bold text-white flex items-center gap-1"
                        title="Thêm buổi tập vào ngày này"
                      >
                        <Plus className="w-3 h-3 text-[#00F19F]" />
                        <span>Thêm</span>
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Items in this day */}
                  {day.scheduled.length === 0 ? (
                    <div className="py-2 text-center text-xs text-[#8E9DA8]/60 border border-dashed border-[#24323A] rounded-xl">
                      Kéo thả giáo án hoặc bấm &quot;Thêm&quot; để xếp lịch
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.scheduled.map(item => {
                        const tmpl = item.templateId ? getTemplateById(item.templateId) : null;
                        const isRest = item.status === 'rest';

                        if (isRest) {
                          return (
                            <div
                              key={item.id}
                              className="bg-[#1C262C]/60 border border-[#7BA1BB]/30 rounded-xl p-2.5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4 text-[#7BA1BB]" />
                                <div>
                                  <span className="font-bold text-[#7BA1BB]">
                                    Ngày Nghỉ Phục Hồi (Rest Day)
                                  </span>
                                  <div className="text-[10px] text-[#8E9DA8]">{item.notes}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteScheduledWorkout(item.id)}
                                className="text-[#8E9DA8] hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={e => handleDragStartScheduled(e, item.id)}
                            className="bg-[#172127] border border-[#24323A] hover:border-[#0093E7] rounded-xl p-3 flex items-center justify-between cursor-grab active:cursor-grabbing transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <GripVertical className="w-4 h-4 text-[#8E9DA8]" />
                              <div>
                                <div className="text-xs font-black text-white flex items-center gap-2">
                                  <span>{tmpl?.name || item.customTitle || 'Buổi tập'}</span>
                                  {item.status === 'completed' && (
                                    <span className="text-[9px] font-bold text-[#16EC06] bg-[#16EC06]/15 px-1.5 py-0.2 rounded">
                                      Hoàn thành
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#8E9DA8] flex items-center gap-2 mt-0.5">
                                  <span>{tmpl?.exercises.length || 0} bài tập</span>
                                  <span>•</span>
                                  <span>~{tmpl?.estimatedDurationMinutes || 60}p</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Start Workout Button */}
                              <button
                                onClick={() =>
                                  startSession({
                                    templateId: item.templateId,
                                    scheduledId: item.id,
                                    title: tmpl?.name
                                  })
                                }
                                className="px-2.5 py-1.5 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black rounded-lg uppercase flex items-center gap-1"
                              >
                                <Play className="w-3 h-3 fill-black" />
                                <span>Tập</span>
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => deleteScheduledWorkout(item.id)}
                                className="p-1.5 bg-[#1C262C] hover:bg-red-500/20 text-[#8E9DA8] hover:text-red-400 rounded-lg"
                                title="Xóa buổi này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TEMPLATES LIST VIEW --- */}
      {viewMode === 'templates' && (
        <div className="space-y-3">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              className="bg-[#131A1E] border border-[#24323A] rounded-2xl p-4 space-y-3 hover:border-[#0093E7]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black text-white">{tmpl.name}</h3>
                  <p className="text-xs text-[#8E9DA8] mt-0.5">{tmpl.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingTemplate(tmpl);
                      setShowTemplateModal(true);
                    }}
                    className="p-2 bg-[#1C262C] hover:bg-[#24323A] text-[#8E9DA8] hover:text-white rounded-xl transition-colors"
                    title="Chỉnh sửa giáo án"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(tmpl.id)}
                    className="p-2 bg-[#1C262C] hover:bg-red-500/20 text-[#8E9DA8] hover:text-red-400 rounded-xl transition-colors"
                    title="Xóa giáo án"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Exercises in template preview with illustration thumbnails */}
              <div className="space-y-2">
                {tmpl.exercises.map((te, idx) => {
                  const ex = getExerciseById(te.exerciseId);
                  return (
                    <div
                      key={te.id}
                      className="bg-[#1C262C] border border-[#24323A]/60 rounded-xl p-2 flex items-center justify-between text-xs gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-[#24323A] bg-[#131A1E]">
                          {ex?.imageUrl ? (
                            <img
                              src={ex.imageUrl}
                              alt={ex.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white bg-[#24323A]">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold truncate">
                              {ex?.vietnameseName || ex?.name}
                            </span>
                            {te.supersetGroupId && (
                              <span className="text-[9px] text-[#0093E7] bg-[#0093E7]/15 px-1 py-0.2 rounded font-bold">
                                Superset
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8E9DA8] truncate">{ex?.name}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-white font-black font-number text-[11px]">
                          {te.targetSets}s × {te.repMax}r
                        </span>
                        <div className="text-[10px] text-[#8E9DA8] font-number">
                          {te.targetWeight}kg
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Start */}
              <div className="pt-2 flex justify-between items-center border-t border-[#24323A]">
                <div className="text-[11px] text-[#8E9DA8]">
                  ~{tmpl.estimatedDurationMinutes} phút • {tmpl.exercises.length} bài tập
                </div>
                <button
                  onClick={() => startSession({ templateId: tmpl.id, title: tmpl.name })}
                  className="px-3.5 py-1.5 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Bắt đầu tập ngay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TEMPLATE BUILDER MODAL --- */}
      {showTemplateModal && editingTemplate && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Chỉnh Sửa Giáo Án (Workout Builder)
                </h3>
                <p className="text-[11px] text-[#8E9DA8]">
                  Kéo thả bài tập, đặt target hiệp/rep/tạ và tạo Superset
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Template Name & Description */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={e =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  placeholder="Tên giáo án (vd: Push Day A - Ngực & Tay sau)"
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-sm font-black text-white focus:border-[#00F19F] focus:outline-none"
                />
                <input
                  type="text"
                  value={editingTemplate.description}
                  onChange={e =>
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  }
                  placeholder="Mô tả mục tiêu buổi tập..."
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-[#8E9DA8] focus:border-[#00F19F] focus:outline-none"
                />
              </div>

              {/* Exercises in Builder */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-white">Danh sách bài tập</span>
                  <button
                    onClick={() => setShowExercisePicker(true)}
                    className="px-2.5 py-1 bg-[#00F19F]/15 border border-[#00F19F] text-[#00F19F] rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#00F19F]/25"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm bài tập
                  </button>
                </div>

                {editingTemplate.exercises.map((te, idx) => {
                  const ex = getExerciseById(te.exerciseId);

                  return (
                    <div
                      key={te.id}
                      className={`bg-[#172127] border rounded-2xl p-3 space-y-2 transition-all ${
                        te.supersetGroupId ? 'border-[#0093E7] bg-[#0093E7]/5' : 'border-[#24323A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Thumbnail in builder */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#24323A] bg-[#1C262C]">
                            {ex?.imageUrl ? (
                              <img
                                src={ex.imageUrl}
                                alt={ex.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-[#24323A]">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-white truncate">
                              {ex?.vietnameseName || ex?.name}
                            </div>
                            <div className="text-[10px] text-[#8E9DA8] truncate">{ex?.name}</div>
                          </div>
                        </div>

                        {/* Order & Superset Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-[#8E9DA8] hover:text-white disabled:opacity-30"
                            title="Lên trên"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(idx, 'down')}
                            disabled={idx === editingTemplate.exercises.length - 1}
                            className="p-1 text-[#8E9DA8] hover:text-white disabled:opacity-30"
                            title="Xuống dưới"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSuperset(idx)}
                            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                              te.supersetGroupId
                                ? 'bg-[#0093E7] text-black border-[#0093E7]'
                                : 'bg-[#1C262C] text-[#8E9DA8] border-[#24323A] hover:text-white'
                            }`}
                            title="Nhóm Superset với bài kế tiếp"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromTemplate(te.id)}
                            className="p-1.5 text-[#8E9DA8] hover:text-red-400"
                            title="Xóa bài"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Target configurations */}
                      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                        <div className="bg-[#1C262C] p-2 rounded-xl border border-[#24323A]">
                          <div className="text-[9px] uppercase text-[#8E9DA8] font-bold">Hiệp (Sets)</div>
                          <input
                            type="number"
                            value={te.targetSets}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 1;
                              const updated = [...editingTemplate.exercises];
                              updated[idx].targetSets = val;
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="w-full text-center bg-transparent font-black text-white text-xs mt-0.5 focus:outline-none"
                          />
                        </div>
                        <div className="bg-[#1C262C] p-2 rounded-xl border border-[#24323A]">
                          <div className="text-[9px] uppercase text-[#8E9DA8] font-bold">Reps</div>
                          <input
                            type="number"
                            value={te.repMax}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 8;
                              const updated = [...editingTemplate.exercises];
                              updated[idx].repMax = val;
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="w-full text-center bg-transparent font-black text-white text-xs mt-0.5 focus:outline-none"
                          />
                        </div>
                        <div className="bg-[#1C262C] p-2 rounded-xl border border-[#24323A]">
                          <div className="text-[9px] uppercase text-[#8E9DA8] font-bold">Tạ (kg)</div>
                          <input
                            type="number"
                            value={te.targetWeight}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              const updated = [...editingTemplate.exercises];
                              updated[idx].targetWeight = val;
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="w-full text-center bg-transparent font-black text-white text-xs mt-0.5 focus:outline-none"
                          />
                        </div>
                        <div className="bg-[#1C262C] p-2 rounded-xl border border-[#24323A]">
                          <div className="text-[9px] uppercase text-[#8E9DA8] font-bold">Nghỉ (s)</div>
                          <input
                            type="number"
                            value={te.restSeconds}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 60;
                              const updated = [...editingTemplate.exercises];
                              updated[idx].restSeconds = val;
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="w-full text-center bg-transparent font-black text-white text-xs mt-0.5 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="p-4 border-t border-[#24323A] flex justify-end gap-2">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-[#1C262C] text-[#8E9DA8] hover:text-white rounded-xl text-xs font-bold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveTemplateModal}
                className="px-5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)]"
              >
                LƯU GIÁO ÁN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXERCISE PICKER MODAL (Inside Builder) --- */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white">Chọn bài tập</h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b border-[#24323A]">
              <input
                type="text"
                placeholder="Tìm bài tập..."
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8E9DA8] focus:border-[#00F19F] focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {exercises
                .filter(
                  e =>
                    e.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                    e.vietnameseName.toLowerCase().includes(pickerSearch.toLowerCase())
                )
                .map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExerciseToTemplate(ex.id)}
                    className="p-2.5 bg-[#172127] hover:bg-[#1C262C] border border-[#24323A] hover:border-[#00F19F] rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#24323A] bg-[#131A1E]">
                        {ex.imageUrl ? (
                          <img
                            src={ex.imageUrl}
                            alt={ex.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8E9DA8]">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{ex.vietnameseName}</div>
                        <div className="text-[10px] text-[#8E9DA8] truncate">{ex.name}</div>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-[#00F19F] bg-[#00F19F]/10 px-2 py-0.5 rounded shrink-0">
                      {ex.muscleGroup}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- QUICK SCHEDULE MODAL (FOR MOBILE TAP) --- */}
      {schedulingDate && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Xếp lịch cho {schedulingDate}</h3>
              <button
                onClick={() => setSchedulingDate(null)}
                className="w-7 h-7 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8E9DA8]">Chọn giáo án để gán vào ngày này:</p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {templates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    scheduleWorkoutOnDate(schedulingDate, tmpl.id);
                    setSchedulingDate(null);
                  }}
                  className="w-full text-left p-3 bg-[#172127] hover:bg-[#1C262C] border border-[#24323A] hover:border-[#00F19F] rounded-xl text-xs font-bold text-white transition-colors"
                >
                  <div>{tmpl.name}</div>
                  <div className="text-[10px] text-[#8E9DA8] font-normal">
                    {tmpl.exercises.length} bài tập • ~{tmpl.estimatedDurationMinutes}p
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-[#24323A] pt-3">
              <button
                onClick={() => {
                  markDayAsRest(schedulingDate);
                  setSchedulingDate(null);
                }}
                className="w-full py-2 bg-[#1C262C] hover:bg-[#24323A] text-[#7BA1BB] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Đặt làm Ngày Nghỉ (Rest Day)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { useGym } from '@/context/GymContext';
import {
  Search,
  Star,
  Plus,
  Dumbbell,
  BookOpen,
  X,
  Trophy,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Upload,
  Link
} from 'lucide-react';
import { MuscleGroup, EquipmentType, MovementPattern, Difficulty, Exercise } from '@/types/gym';

export default function LibraryTab() {
  const { exercises, toggleFavoriteExercise, addCustomExercise, updateExerciseImage, prs } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Selected exercise for detail modal
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Custom exercise modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customVnName, setCustomVnName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('chest');
  const [customEquipment, setCustomEquipment] = useState<EquipmentType>('dumbbell');
  const [customMovement, setCustomMovement] = useState<MovementPattern>('push');
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>('beginner');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [customCues, setCustomCues] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customFileInputRef = useRef<HTMLInputElement>(null);

  // Filtering
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.vietnameseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    const matchesFav = !showOnlyFavorites || ex.isFavorite;

    return matchesSearch && matchesMuscle && matchesEquipment && matchesFav;
  });

  const handleSaveCustomExercise = () => {
    if (!customName.trim()) return;

    addCustomExercise({
      name: customName,
      vietnameseName: customVnName || customName,
      muscleGroup: customMuscle,
      equipment: customEquipment,
      movementPattern: customMovement,
      difficulty: customDifficulty,
      imageUrl: customImageUrl || undefined,
      instructions: customInstructions ? customInstructions.split('\n').filter(Boolean) : ['Thực hiện đúng kỹ thuật và nhịp thở.'],
      cues: customCues ? customCues.split('\n').filter(Boolean) : ['Gồng cơ và kiểm soát đường tạ.'],
      isFavorite: false
    });

    // Reset & close
    setCustomName('');
    setCustomVnName('');
    setCustomImageUrl('');
    setCustomInstructions('');
    setCustomCues('');
    setShowCustomModal(false);
  };

  const handleUpdateViewingImage = (url: string) => {
    if (!viewingExercise || !url) return;
    updateExerciseImage(viewingExercise.id, url);
    setViewingExercise({ ...viewingExercise, imageUrl: url });
    setIsEditingImage(false);
    setNewImageUrl('');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, forCustom: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        if (forCustom) {
          setCustomImageUrl(base64Url);
        } else if (viewingExercise) {
          handleUpdateViewingImage(base64Url);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const muscleFilters: { label: string; value: MuscleGroup | 'all' }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Ngực', value: 'chest' },
    { label: 'Lưng xô', value: 'back' },
    { label: 'Chân', value: 'legs' },
    { label: 'Vai', value: 'shoulders' },
    { label: 'Tay', value: 'arms' },
    { label: 'Bụng/Core', value: 'core' }
  ];

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Header & Custom Exercise Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00F19F]">
            THƯ VIỆN BÀI TẬP (EXERCISE LIBRARY)
          </span>
          <h2 className="text-base font-black text-white">Hình Ảnh Minh Họa & Kỹ Thuật Chuẩn</h2>
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="px-3.5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,241,159,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Riêng</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8E9DA8] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Tìm bài tập theo tên tiếng Việt hoặc tiếng Anh..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#131A1E] border border-[#24323A] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#8E9DA8] focus:border-[#00F19F] focus:outline-none transition-colors"
        />
      </div>

      {/* Muscle Group Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setShowOnlyFavorites(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 border transition-colors ${
            showOnlyFavorites
              ? 'bg-[#FFDE00]/15 text-[#FFDE00] border-[#FFDE00]'
              : 'bg-[#131A1E] text-[#8E9DA8] border-[#24323A] hover:text-white'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          <span>Yêu thích</span>
        </button>

        {muscleFilters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setSelectedMuscle(filter.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors ${
              selectedMuscle === filter.value
                ? 'bg-[#00F19F] text-black border-[#00F19F]'
                : 'bg-[#131A1E] text-[#8E9DA8] border-[#24323A] hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredExercises.map(ex => {
          const exPrs = prs.filter(p => p.exerciseId === ex.id);
          const maxWeightPR = exPrs.find(p => p.type === 'heaviest_weight');

          return (
            <div
              key={ex.id}
              onClick={() => {
                setViewingExercise(ex);
                setIsEditingImage(false);
              }}
              className="bg-[#131A1E] hover:bg-[#172127] border border-[#24323A] hover:border-[#0093E7]/50 rounded-2xl p-3 cursor-pointer transition-all space-y-2.5 group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                {/* Exercise Illustration Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#24323A] bg-[#1C262C] relative">
                  {ex.imageUrl ? (
                    <img
                      src={ex.imageUrl}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8E9DA8]">
                      <Dumbbell className="w-6 h-6 text-[#8E9DA8]" />
                      <span className="text-[8px] uppercase font-bold mt-1">GymMate</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[8px] font-bold text-white px-1 rounded uppercase">
                    {ex.muscleGroup.slice(0, 3)}
                  </span>
                </div>

                {/* Exercise Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-black text-white group-hover:text-[#00F19F] transition-colors leading-tight line-clamp-2">
                      {ex.vietnameseName}
                    </h3>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavoriteExercise(ex.id);
                      }}
                      className={`p-1 rounded-lg transition-colors ${
                        ex.isFavorite ? 'text-[#FFDE00]' : 'text-[#8E9DA8] hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${ex.isFavorite ? 'fill-[#FFDE00]' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[10px] text-[#8E9DA8] truncate mt-0.5">{ex.name}</p>

                  {/* Badges */}
                  <div className="flex items-center gap-1 mt-2 text-[9px]">
                    <span className="font-bold text-[#00F19F] bg-[#00F19F]/10 px-1.5 py-0.2 rounded uppercase">
                      {ex.muscleGroup}
                    </span>
                    <span className="text-[#8E9DA8] bg-[#1C262C] px-1.5 py-0.2 rounded capitalize">
                      {ex.equipment}
                    </span>
                    {ex.isCustom && (
                      <span className="text-[#0093E7] bg-[#0093E7]/15 px-1.5 py-0.2 rounded font-bold">
                        Tự tạo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Best PR pill if exists */}
              {maxWeightPR && (
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#24323A]/50">
                  <span className="text-[#8E9DA8]">Kỷ lục (PR):</span>
                  <span className="font-bold text-[#FFDE00] font-number">
                    {maxWeightPR.value} kg ({maxWeightPR.repsAtWeight} reps)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- EXERCISE DETAIL MODAL WITH LARGE ILLUSTRATION --- */}
      {viewingExercise && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header with Close */}
            <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">
                  {viewingExercise.vietnameseName}
                </h3>
                <p className="text-xs text-[#8E9DA8]">{viewingExercise.name}</p>
              </div>
              <button
                onClick={() => setViewingExercise(null)}
                className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Large Illustration / Photo Card */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#1C262C] border border-[#24323A] group">
                {viewingExercise.imageUrl ? (
                  <img
                    src={viewingExercise.imageUrl}
                    alt={viewingExercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8E9DA8]">
                    <Dumbbell className="w-12 h-12 text-[#8E9DA8] mb-2" />
                    <span className="text-xs font-bold">Chưa có ảnh minh họa</span>
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Change photo button on top of image */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => setIsEditingImage(!isEditingImage)}
                    className="px-3 py-1.5 bg-[#131A1E]/90 hover:bg-[#131A1E] border border-[#00F19F] text-xs font-bold text-[#00F19F] rounded-xl flex items-center gap-1 shadow-lg backdrop-blur-sm transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Đổi ảnh minh họa</span>
                  </button>
                </div>
              </div>

              {/* Image Editor Expandable Panel */}
              {isEditingImage && (
                <div className="bg-[#172127] border border-[#00F19F]/50 rounded-2xl p-3.5 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5 text-[#00F19F]">
                      <ImageIcon className="w-4 h-4" /> Cập nhật hình ảnh bài tập
                    </span>
                    <button
                      onClick={() => setIsEditingImage(false)}
                      className="text-[#8E9DA8] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Dán đường dẫn ảnh (URL)..."
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8E9DA8] focus:border-[#00F19F] focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdateViewingImage(newImageUrl)}
                        className="px-3 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-bold rounded-xl"
                      >
                        Lưu URL
                      </button>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-[10px] text-[#8E9DA8] uppercase font-bold px-2">Hoặc</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-[#1C262C] hover:bg-[#24323A] border border-dashed border-[#24323A] hover:border-[#00F19F] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0093E7]" />
                      <span>Tải ảnh từ máy / điện thoại</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, false)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-[#00F19F] bg-[#00F19F]/10 border border-[#00F19F]/30 px-2.5 py-1 rounded-xl uppercase">
                  Cơ chính: {viewingExercise.muscleGroup}
                </span>
                <span className="text-xs font-bold text-white bg-[#1C262C] border border-[#24323A] px-2.5 py-1 rounded-xl capitalize">
                  Thiết bị: {viewingExercise.equipment}
                </span>
                <span className="text-xs font-bold text-[#0093E7] bg-[#0093E7]/10 border border-[#0093E7]/30 px-2.5 py-1 rounded-xl capitalize">
                  Chuyển động: {viewingExercise.movementPattern}
                </span>
              </div>

              {/* Step by step instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#00F19F]" />
                  Hướng dẫn thực hiện (Step-by-step)
                </h4>
                <div className="space-y-1.5">
                  {viewingExercise.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-[#E2E8F0]">
                      <span className="w-5 h-5 rounded-full bg-[#1C262C] text-[#00F19F] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Cues & Tips */}
              {viewingExercise.cues && viewingExercise.cues.length > 0 && (
                <div className="bg-[#1C262C]/70 border border-[#24323A] rounded-2xl p-3.5 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#FFDE00] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFDE00]" />
                    Lưu ý & Điểm tựa quan trọng (Key Cues)
                  </h4>
                  <ul className="space-y-1 text-xs text-[#8E9DA8]">
                    {viewingExercise.cues.map((cue, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white">
                        <Check className="w-3.5 h-3.5 text-[#00F19F] shrink-0" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#24323A] flex justify-end">
              <button
                onClick={() => setViewingExercise(null)}
                className="px-5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)]"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD CUSTOM EXERCISE MODAL --- */}
      {showCustomModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white">Tạo Bài Tập Riêng</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Tên tiếng Anh (hoặc tên chuẩn)
                </label>
                <input
                  type="text"
                  placeholder="vd: Incline Cable Fly"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Tên tiếng Việt
                </label>
                <input
                  type="text"
                  placeholder="vd: Ép ngực trên kéo cáp"
                  value={customVnName}
                  onChange={e => setCustomVnName(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>

              {/* Image Input for Custom Exercise */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Ảnh minh họa (Tải ảnh hoặc nhập link URL)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={customImageUrl}
                      onChange={e => setCustomImageUrl(e.target.value)}
                      className="flex-1 bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => customFileInputRef.current?.click()}
                      className="px-3 py-2 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-xs font-bold text-white flex items-center gap-1"
                      title="Chọn ảnh từ thiết bị"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#00F19F]" />
                      <span>Chọn file</span>
                    </button>
                    <input
                      ref={customFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, true)}
                      className="hidden"
                    />
                  </div>

                  {customImageUrl && (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-[#24323A]">
                      <img
                        src={customImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomImageUrl('')}
                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                    Nhóm cơ chính
                  </label>
                  <select
                    value={customMuscle}
                    onChange={e => setCustomMuscle(e.target.value as MuscleGroup)}
                    className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                  >
                    <option value="chest">Ngực (Chest)</option>
                    <option value="back">Lưng (Back)</option>
                    <option value="legs">Chân (Legs)</option>
                    <option value="shoulders">Vai (Shoulders)</option>
                    <option value="arms">Tay (Arms)</option>
                    <option value="core">Bụng (Core)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                    Thiết bị
                  </label>
                  <select
                    value={customEquipment}
                    onChange={e => setCustomEquipment(e.target.value as EquipmentType)}
                    className="w-full bg-[#1C262C] border border-[#24323A] text-white text-xs font-bold rounded-xl px-3 py-2 focus:border-[#00F19F] focus:outline-none"
                  >
                    <option value="barbell">Barbell (Đòn tạ)</option>
                    <option value="dumbbell">Dumbbell (Tạ đơn)</option>
                    <option value="cable">Cable (Dây cáp)</option>
                    <option value="machine">Machine (Máy)</option>
                    <option value="bodyweight">Bodyweight</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Hướng dẫn (mỗi bước 1 dòng)
                </label>
                <textarea
                  rows={2}
                  placeholder="Bước 1: Chỉnh cáp ngang ngực..."
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl p-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Mẹo kỹ thuật / Cues (mỗi mẹo 1 dòng)
                </label>
                <textarea
                  rows={2}
                  placeholder="Gồng cơ ngực ở đỉnh 1 giây..."
                  value={customCues}
                  onChange={e => setCustomCues(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl p-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#24323A] flex justify-end gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 bg-[#1C262C] text-[#8E9DA8] hover:text-white rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCustomExercise}
                className="px-5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)]"
              >
                LƯU BÀI TẬP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

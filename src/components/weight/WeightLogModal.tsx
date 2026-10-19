'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/GymContext';
import { Scale, Plus, Trash2, X, TrendingDown, TrendingUp, Calendar, Check } from 'lucide-react';
import { formatWeight } from '@/utils/fitness';

export default function WeightLogModal() {
  const {
    user,
    weightHistory,
    logBodyWeight,
    deleteBodyWeightEntry,
    isWeightModalOpen,
    setIsWeightModalOpen
  } = useGym();

  const [inputWeight, setInputWeight] = useState(user.bodyWeight || 74.5);
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputNote, setInputNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isWeightModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWeight <= 0) return;

    logBodyWeight(inputWeight, inputDate, inputNote);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsWeightModalOpen(false);
    }, 800);
  };

  // Compute weight change vs earliest logged entry
  const earliestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : user.bodyWeight;
  const currentWeight = user.bodyWeight;
  const totalChange = Math.round((currentWeight - earliestWeight) * 10) / 10;

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#24323A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00F19F]/15 border border-[#00F19F] flex items-center justify-center text-[#00F19F]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white">Ghi Nhận Cân Nặng</h3>
              <p className="text-[10px] text-[#8E9DA8]">Theo dõi sự thay đổi thể trọng theo thời gian</p>
            </div>
          </div>
          <button
            onClick={() => setIsWeightModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#1C262C] flex items-center justify-center text-[#8E9DA8] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-2 bg-[#1C262C] border border-[#24323A] p-3 rounded-2xl text-center">
            <div>
              <div className="text-[9px] uppercase font-bold text-[#8E9DA8]">Hiện tại</div>
              <div className="text-base font-black text-white font-number">{user.bodyWeight} kg</div>
            </div>
            <div className="border-x border-[#24323A]">
              <div className="text-[9px] uppercase font-bold text-[#8E9DA8]">Thay đổi</div>
              <div
                className={`text-base font-black font-number flex items-center justify-center gap-0.5 ${
                  totalChange <= 0 ? 'text-[#00F19F]' : 'text-[#FFDE00]'
                }`}
              >
                {totalChange <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                <span>{totalChange > 0 ? `+${totalChange}` : totalChange} kg</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-[#8E9DA8]">Mục tiêu</div>
              <div className="text-base font-black text-[#0093E7] font-number">
                {user.targetWeight ? `${user.targetWeight} kg` : '--'}
              </div>
            </div>
          </div>

          {/* Log Weight Form */}
          <form onSubmit={handleSave} className="bg-[#172127] border border-[#24323A] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white block">
              Nhập cân nặng mới
            </span>

            {/* Weight Input with +/- 0.1 & +/- 0.5 buttons */}
            <div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputWeight(prev => Math.round((prev - 0.5) * 10) / 10)}
                  className="px-2.5 py-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-xs font-bold text-white border border-[#24323A]"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => setInputWeight(prev => Math.round((prev - 0.1) * 10) / 10)}
                  className="px-2.5 py-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-xs font-bold text-white border border-[#24323A]"
                >
                  -0.1
                </button>

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    value={inputWeight}
                    onChange={e => setInputWeight(parseFloat(e.target.value) || 0)}
                    className="w-28 text-center bg-[#131A1E] border-2 border-[#00F19F] rounded-2xl py-2 text-2xl font-black text-white font-number focus:outline-none shadow-[0_0_15px_rgba(0,241,159,0.2)]"
                  />
                  <span className="absolute -bottom-4 left-0 right-0 text-center text-[10px] text-[#8E9DA8] font-bold">
                    {user.unit.toUpperCase()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setInputWeight(prev => Math.round((prev + 0.1) * 10) / 10)}
                  className="px-2.5 py-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-xs font-bold text-white border border-[#24323A]"
                >
                  +0.1
                </button>
                <button
                  type="button"
                  onClick={() => setInputWeight(prev => Math.round((prev + 0.5) * 10) / 10)}
                  className="px-2.5 py-2 bg-[#1C262C] hover:bg-[#24323A] rounded-xl text-xs font-bold text-white border border-[#24323A]"
                >
                  +0.5
                </button>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Ngày ghi nhận
                </label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={e => setInputDate(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                  Ghi chú
                </label>
                <input
                  type="text"
                  placeholder="vd: Cân sáng sớm..."
                  value={inputNote}
                  onChange={e => setInputNote(e.target.value)}
                  className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-[#00F19F] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00F19F] hover:bg-[#00dd90] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)] transition-all flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>ĐÃ LƯU CÂN NẶNG</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>LƯU CÂN NẶNG (SAVE)</span>
                </>
              )}
            </button>
          </form>

          {/* History List */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#8E9DA8] block">
              Lịch sử ghi cân nặng gần đây
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {weightHistory.map((item, idx) => {
                const prevItem = weightHistory[idx + 1];
                const diff = prevItem ? Math.round((item.weight - prevItem.weight) * 10) / 10 : null;

                return (
                  <div
                    key={item.id}
                    className="bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8E9DA8]" />
                      <div>
                        <div className="text-white font-bold">{item.date}</div>
                        {item.note && <div className="text-[10px] text-[#8E9DA8]">{item.note}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-white font-black font-number text-sm">
                          {item.weight} kg
                        </span>
                        {diff !== null && (
                          <div
                            className={`text-[9px] font-bold font-number ${
                              diff <= 0 ? 'text-[#00F19F]' : 'text-[#FFDE00]'
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff} kg
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteBodyWeightEntry(item.id)}
                        className="text-[#8E9DA8] hover:text-red-400 p-1"
                        title="Xóa bản ghi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

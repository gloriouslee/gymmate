'use client';

import React, { useState, useRef } from 'react';
import { useGym } from '@/context/GymContext';
import {
  User,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Dumbbell,
  Scale,
  Ruler,
  Target,
  CheckCircle2,
  FileJson,
  Info
} from 'lucide-react';

export default function ProfileTab() {
  const {
    user,
    updateUserProfile,
    toggleUnit,
    exportDataJSON,
    importDataJSON,
    resetAllData,
    prs,
    sessionHistory
  } = useGym();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bodyWeight, setBodyWeight] = useState(user.bodyWeight);
  const [targetWeight, setTargetWeight] = useState(user.targetWeight || 70);
  const [height, setHeight] = useState(user.height);
  const [targetGoal, setTargetGoal] = useState(user.targetGoal);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setBodyWeight(user.bodyWeight);
    setTargetWeight(user.targetWeight || 70);
    setHeight(user.height);
    setTargetGoal(user.targetGoal);
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      bodyWeight,
      targetWeight,
      height,
      targetGoal
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportMessage('Khôi phục dữ liệu thành công!');
        } else {
          setImportMessage('Lỗi định dạng file JSON không hợp lệ!');
        }
        setTimeout(() => setImportMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F19F]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-[#1C262C] border-2 border-[#00F19F] mx-auto flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(0,241,159,0.3)]">
          <User className="w-10 h-10 text-[#00F19F]" />
        </div>

        <h2 className="text-xl font-black text-white">{user.name}</h2>
        <p className="text-xs text-[#8E9DA8] mt-0.5">{user.email}</p>

        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#24323A]/60">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Cân nặng</div>
            <div className="text-sm font-black text-white font-number">{user.bodyWeight} kg</div>
          </div>
          <div className="text-center border-x border-[#24323A]/60">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Buổi đã tập</div>
            <div className="text-sm font-black text-[#00F19F] font-number">
              {sessionHistory.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-[#8E9DA8]">Kỷ lục PR</div>
            <div className="text-sm font-black text-[#FFDE00] font-number">{prs.length}</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-[#00F19F]" />
            Thông Tin Cá Nhân & Thiết Lập
          </span>
          {savedSuccess && (
            <span className="text-xs font-bold text-[#16EC06] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyWeight}
                onChange={e => setBodyWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none font-number"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                Mục tiêu (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={targetWeight}
                onChange={e => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-[#0093E7] font-bold focus:border-[#0093E7] focus:outline-none font-number"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none font-number"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#8E9DA8] block mb-1">
              Mục tiêu luyện tập
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={e => setTargetGoal(e.target.value)}
              className="w-full bg-[#1C262C] border border-[#24323A] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00F19F] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8E9DA8]">Đơn vị đo:</span>
              <button
                type="button"
                onClick={toggleUnit}
                className="px-3 py-1 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-lg text-xs font-black text-[#00F19F] uppercase"
              >
                {user.unit.toUpperCase()}
              </button>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#00F19F] hover:bg-[#00dd90] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,241,159,0.3)] transition-all"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>

      {/* Backup, Restore & Reset */}
      <div className="bg-[#131A1E] border border-[#24323A] rounded-3xl p-5 space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
          <FileJson className="w-4 h-4 text-[#0093E7]" />
          Dữ Liệu & Sao Lưu (Data Management)
        </span>

        {importMessage && (
          <div className="p-3 bg-[#1C262C] border border-[#00F19F] text-xs font-bold text-[#00F19F] rounded-xl text-center">
            {importMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={exportDataJSON}
            className="py-2.5 px-3 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00F19F]" />
            <span>Xuất file JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 bg-[#1C262C] hover:bg-[#24323A] border border-[#24323A] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#0093E7]" />
            <span>Nhập file JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (confirm('Khôi phục toàn bộ về dữ liệu mẫu ban đầu?')) {
                resetAllData();
              }
            }}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu mẫu ban đầu</span>
          </button>
        </div>
      </div>

      {/* App & WHOOP Design Guideline Note */}
      <div className="bg-[#131A1E]/60 border border-[#24323A] rounded-3xl p-4 text-xs text-[#8E9DA8] space-y-1.5">
        <div className="flex items-center gap-1.5 text-white font-bold">
          <Info className="w-4 h-4 text-[#00F19F]" />
          <span>GymMate — Powered by WHOOP Design System</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Được thiết kế dựa trên WHOOP Brand Design Guideline: tông màu đen sâu viền xám tro, điểm nhấn Neon Teal (#00F19F), Strain Blue (#0093E7), phân cấp phục hồi Recovery (#16EC06, #FFDE00, #FF0026). Tuân thủ 100% PRD Personal Gym Tracking App cho Hoang Le Huy.
        </p>
      </div>
    </div>
  );
}

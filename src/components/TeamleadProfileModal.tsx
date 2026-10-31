import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserCheck,
  Calendar,
  Phone,
  Save,
  CheckCircle,
  Building2,
  Shield,
  MapPin,
} from 'lucide-react';

interface TeamleadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamleadProfileModal: React.FC<TeamleadProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, supervisors, updateTeamleadSelfProfile } = useApp();

  const [birthday, setBirthday] = useState(currentUser.birthday || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setBirthday(currentUser.birthday || '');
    setPhone(currentUser.phone || '');
    setIsSaved(false);
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const supervisor = supervisors.find((s) => s.id === currentUser.supervisorId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeamleadSelfProfile(currentUser.id, birthday, phone);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Hồ Sơ Cá Nhân Teamleader
              </h2>
              <p className="text-[11px] text-slate-500">
                Tự cập nhật ngày sinh nhật và số điện thoại liên hệ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Identity Info (Read-only) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Họ và Tên:</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {currentUser.code}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{currentUser.region || 'Miền Bắc'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="truncate">GS: {supervisor?.name || 'Vĩnh Phúc'}</span>
              </div>
            </div>
          </div>

          {/* Editable Birthday */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Ngày Sinh Nhật:
            </label>
            <input
              type="date"
              required
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 cursor-pointer font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Ngày sinh được hiển thị trên danh sách và dùng để chúc mừng sinh nhật trong tháng.
            </p>
          </div>

          {/* Editable Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Số Điện Thoại Liên Hệ:
            </label>
            <input
              type="tel"
              required
              placeholder="Ví dụ: 0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 font-mono font-medium"
            />
          </div>

          {isSaved && (
            <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Đã lưu thành công ngày sinh nhật và số điện thoại!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu Thông Tin
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

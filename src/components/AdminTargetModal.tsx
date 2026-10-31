import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Settings, ShieldCheck, DollarSign, Users, Target } from 'lucide-react';
import { formatCurrencyVND } from '../utils/formatters';

interface AdminTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeamleadId?: string;
}

export const AdminTargetModal: React.FC<AdminTargetModalProps> = ({
  isOpen,
  onClose,
  initialTeamleadId,
}) => {
  const {
    currentUser,
    teamleads,
    supervisors,
    adminSettings,
    updateAdminSettings,
    getAdminSettingForTeamlead,
  } = useApp();

  // Determine which teamleads this user can edit
  const editableTeamleads = currentUser.role === 'DIRECTOR'
    ? teamleads
    : currentUser.role === 'SUPERVISOR'
    ? teamleads.filter((t) => {
        const sup = supervisors.find((s) => s.userId === currentUser.id);
        return sup ? t.supervisorId === sup.id : false;
      })
    : [];

  const defaultId = initialTeamleadId || editableTeamleads[0]?.id || teamleads[0].id;
  const [selectedTlId, setSelectedTlId] = useState<string>(defaultId);

  const [activeStaff, setActiveStaff] = useState<number>(10);
  const [existingAgents, setExistingAgents] = useState<number>(20);
  const [targetVolume, setTargetVolume] = useState<number>(1500000000);
  const [targetLoans, setTargetLoans] = useState<number>(35);
  const [targetApp, setTargetApp] = useState<number>(90);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTlId) {
      const setting = getAdminSettingForTeamlead(selectedTlId);
      if (setting) {
        setActiveStaff(setting.activeContractStaff || 0);
        setExistingAgents(setting.existingAgents || 0);
        setTargetVolume(setting.targetVolume || 0);
        setTargetLoans(setting.targetLoans || 0);
        setTargetApp(setting.targetApp || 0);
      }
    }
  }, [selectedTlId, isOpen]);

  useEffect(() => {
    if (initialTeamleadId) {
      setSelectedTlId(initialTeamleadId);
    }
  }, [initialTeamleadId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAdminSettings(selectedTlId, {
      activeContractStaff: Number(activeStaff) || 0,
      existingAgents: Number(existingAgents) || 0,
      targetVolume: Number(targetVolume) || 0,
      targetLoans: Number(targetLoans) || 0,
      targetApp: Number(targetApp) || 0,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const currentTl = teamleads.find((t) => t.id === selectedTlId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              Quản Trị: Thiết Lập Mục Tiêu & Code HĐLĐ Active
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dành cho Tôi (Giám đốc) và Giám sát bán hàng nhập chỉ số quản trị
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 grow">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Đã cập nhật chỉ số quản trị thành công!
            </div>
          )}

          {/* Chọn Teamlead để chỉnh sửa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chọn Teamleader cần thiết lập:
            </label>
            <select
              value={selectedTlId}
              onChange={(e) => setSelectedTlId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
            >
              {editableTeamleads.map((tl) => (
                <option key={tl.id} value={tl.id}>
                  {tl.name} ({tl.code}) - Phụ trách bởi {tl.supervisorName} - {tl.region}
                </option>
              ))}
            </select>
          </div>

          {/* Chỉ số Nhân sự quản trị */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              1. Quy Mô Nhân Sự Hiện Hữu
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số code HĐLĐ đang active:
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={activeStaff}
                  onChange={(e) => setActiveStaff(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">Nhân viên chính thức có code</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số lượng CTV hiện hữu:
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={existingAgents}
                  onChange={(e) => setExistingAgents(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">Cộng tác viên mạng lưới</span>
              </div>
            </div>
          </div>

          {/* Chỉ số Mục tiêu tháng */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              2. Mục Tiêu Doanh Số Tháng
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Mục tiêu Doanh số giải ngân tháng (Target Volume - VNĐ):
              </label>
              <input
                type="number"
                min="0"
                step="50000000"
                required
                value={targetVolume}
                onChange={(e) => setTargetVolume(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-mono-numbers font-extrabold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
              />
              <div className="text-right text-xs font-bold text-blue-700 dark:text-blue-400 font-mono-numbers mt-1">
                {formatCurrencyVND(targetVolume)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Mục tiêu số HĐ (Target Loans):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={targetLoans}
                  onChange={(e) => setTargetLoans(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Mục tiêu hồ sơ nộp (Target App):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={targetApp}
                  onChange={(e) => setTargetApp(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-sm transition-colors"
            >
              Cập Nhật Chỉ Số
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

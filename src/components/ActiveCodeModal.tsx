import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  CheckCircle,
  Users,
  ShieldCheck,
  Calendar,
  Plus,
  Minus,
  Save,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDateVN } from '../utils/formatters';

interface ActiveCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeamleadId?: string;
}

export const ActiveCodeModal: React.FC<ActiveCodeModalProps> = ({
  isOpen,
  onClose,
  initialTeamleadId,
}) => {
  const {
    currentUser,
    teamleads,
    supervisors,
    selectedDate,
    dailyActiveCodes,
    updateDailyActiveCodes,
  } = useApp();

  // Filter available teamleads based on role
  const availableTeamleads = currentUser.role === 'TEAMLEAD'
    ? teamleads.filter((t) => t.userId === currentUser.id)
    : currentUser.role === 'SUPERVISOR'
    ? teamleads.filter((t) => {
        const sup = supervisors.find((s) => s.userId === currentUser.id);
        return sup ? t.supervisorId === sup.id : false;
      })
    : teamleads;

  const defaultTlId = initialTeamleadId || availableTeamleads[0]?.id || teamleads[0]?.id;
  const [targetTeamleadId, setTargetTeamleadId] = useState<string>(defaultTlId);
  const [date, setDate] = useState<string>(selectedDate);

  const [activeStaff, setActiveStaff] = useState<number>(0);
  const [activeAgents, setActiveAgents] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Load existing active code entry when teamlead or date changes
  useEffect(() => {
    if (targetTeamleadId && date) {
      const key = `${targetTeamleadId}_${date}`;
      const entry = dailyActiveCodes[key];
      if (entry) {
        setActiveStaff(entry.activeCodeContractStaff || 0);
        setActiveAgents(entry.activeCodeAgents || 0);
        setLastUpdated(entry.updatedAt || '');
        setLastUpdatedBy(entry.updatedBy || '');
      } else {
        setActiveStaff(0);
        setActiveAgents(0);
        setLastUpdated('');
        setLastUpdatedBy('');
      }
    }
  }, [targetTeamleadId, date, dailyActiveCodes, isOpen]);

  useEffect(() => {
    if (initialTeamleadId) {
      setTargetTeamleadId(initialTeamleadId);
    }
  }, [initialTeamleadId]);

  if (!isOpen) return null;

  const selectedTl = teamleads.find((t) => t.id === targetTeamleadId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateDailyActiveCodes(
      targetTeamleadId,
      date,
      Number(activeStaff) || 0,
      Number(activeAgents) || 0
    );

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-indigo-600/10 dark:from-emerald-950/40 dark:via-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 fill-white text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Kiểm Soát Code Kích Hoạt Trong Ngày
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nhập tay số Code HĐLĐ & CTV phát sinh kích hoạt (Teamlead & SM kiểm soát)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 grow">
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Target Teamlead & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Teamleader:
              </label>
              {currentUser.role === 'TEAMLEAD' ? (
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                  {selectedTl?.name} ({selectedTl?.code})
                </div>
              ) : (
                <select
                  value={targetTeamleadId}
                  onChange={(e) => setTargetTeamleadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                >
                  {availableTeamleads.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.name} - {tl.code} ({tl.supervisorName})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Ngày ghi nhận:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Interactive Input Cards */}
          <div className="space-y-3">
            
            {/* 1. Code HĐLĐ kích hoạt */}
            <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <label className="text-xs font-extrabold uppercase tracking-wide text-emerald-900 dark:text-emerald-300">
                    Số Code HĐLĐ Kích Hoạt Hôm Nay:
                  </label>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Nhân viên chính thức
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStaff((v) => Math.max(0, v - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center justify-center font-black text-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min="0"
                  value={activeStaff}
                  onChange={(e) => setActiveStaff(Math.max(0, parseInt(e.target.value) || 0))}
                  className="grow text-center text-2xl font-black font-mono-numbers py-2 rounded-xl border-2 border-emerald-500/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => setActiveStaff((v) => v + 1)}
                  className="w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-black text-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Code CTV kích hoạt */}
            <div className="p-4 rounded-xl border-2 border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                  <label className="text-xs font-extrabold uppercase tracking-wide text-blue-900 dark:text-blue-300">
                    Số Code CTV Kích Hoạt Hôm Nay:
                  </label>
                </div>
                <span className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                  Cộng tác viên bán hàng
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveAgents((v) => Math.max(0, v - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center justify-center font-black text-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min="0"
                  value={activeAgents}
                  onChange={(e) => setActiveAgents(Math.max(0, parseInt(e.target.value) || 0))}
                  className="grow text-center text-2xl font-black font-mono-numbers py-2 rounded-xl border-2 border-blue-500/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => setActiveAgents((v) => v + 1)}
                  className="w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-black text-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Audit trail */}
          {lastUpdated && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Cập nhật gần nhất: {lastUpdated.replace('T', ' ').substring(0, 16)}
              </span>
              <span>Bởi: <strong className="text-slate-700 dark:text-slate-200">{lastUpdatedBy}</strong></span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu Số Code Kích Hoạt
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

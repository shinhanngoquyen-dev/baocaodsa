import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Calendar, UserCheck, DollarSign } from 'lucide-react';
import { formatCurrencyVND } from '../utils/formatters';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeamleadId?: string;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  isOpen,
  onClose,
  initialTeamleadId,
}) => {
  const {
    currentUser,
    teamleads,
    selectedDate,
    submitDailyReport,
    getReportForTeamleadDate,
  } = useApp();

  // If user is teamlead, lock to their id; otherwise use initial or first available
  const availableTeamleads = currentUser.role === 'TEAMLEAD'
    ? teamleads.filter((t) => t.userId === currentUser.id)
    : currentUser.role === 'SUPERVISOR'
    ? teamleads.filter((t) => t.supervisorId === currentUser.managedTeamleadIds?.[0] || t.supervisorName.includes(currentUser.name))
    : teamleads;

  const defaultTlId =
    initialTeamleadId ||
    availableTeamleads[0]?.id ||
    teamleads[0].id;

  const [targetTeamleadId, setTargetTeamleadId] = useState<string>(defaultTlId);
  const [reportDate, setReportDate] = useState<string>(selectedDate);

  const [app, setApp] = useState<number>(0);
  const [loans, setLoans] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [newContractStaff, setNewContractStaff] = useState<number>(0);
  const [newAgents, setNewAgents] = useState<number>(0);
  const [activeCodeContractStaff, setActiveCodeContractStaff] = useState<number>(0);
  const [activeCodeAgents, setActiveCodeAgents] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Load existing report data if already submitted for this day
  useEffect(() => {
    if (targetTeamleadId && reportDate) {
      const existing = getReportForTeamleadDate(targetTeamleadId, reportDate);
      if (existing) {
        setApp(existing.app || 0);
        setLoans(existing.loans || 0);
        setVolume(existing.volume || 0);
        setNewContractStaff(existing.newContractStaff || 0);
        setNewAgents(existing.newAgents || 0);
        setActiveCodeContractStaff(existing.activeCodeContractStaff || 0);
        setActiveCodeAgents(existing.activeCodeAgents || 0);
        setNote(existing.note || '');
      } else {
        setApp(0);
        setLoans(0);
        setVolume(0);
        setNewContractStaff(0);
        setNewAgents(0);
        setActiveCodeContractStaff(0);
        setActiveCodeAgents(0);
        setNote('');
      }
    }
  }, [targetTeamleadId, reportDate, isOpen]);

  useEffect(() => {
    if (initialTeamleadId) {
      setTargetTeamleadId(initialTeamleadId);
    }
  }, [initialTeamleadId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitDailyReport({
      teamleadId: targetTeamleadId,
      date: reportDate,
      app: Number(app) || 0,
      loans: Number(loans) || 0,
      volume: Number(volume) || 0,
      newContractStaff: Number(newContractStaff) || 0,
      newAgents: Number(newAgents) || 0,
      activeCodeContractStaff: Number(activeCodeContractStaff) || 0,
      activeCodeAgents: Number(activeCodeAgents) || 0,
      note,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const selectedTl = teamleads.find((t) => t.id === targetTeamleadId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              Nhập Báo Cáo Doanh Số Hàng Ngày
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dành cho Teamlead báo cáo kết quả App, Loans, Volume, Tuyển mới và Kích hoạt code
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
          
          {isSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              Báo cáo ngày đã được lưu thành công! Dữ liệu MTD tự động cộng dồn.
            </div>
          )}

          {/* Teamlead & Date selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teamleader báo cáo:
              </label>
              {currentUser.role === 'TEAMLEAD' ? (
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                  {selectedTl?.name} ({selectedTl?.code})
                </div>
              ) : (
                <select
                  value={targetTeamleadId}
                  onChange={(e) => setTargetTeamleadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                >
                  {teamleads.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.name} - {tl.code} ({tl.supervisorName})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ngày báo cáo:
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Section: Doanh số kinh doanh */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Doanh Số & Hợp Đồng Trong Ngày
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số lượng hồ sơ (App):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={app === 0 ? '' : app}
                  onChange={(e) => setApp(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số lượng giải ngân (Loans):
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={loans === 0 ? '' : loans}
                  onChange={(e) => setLoans(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Doanh số giải ngân (Volume - VNĐ):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000000"
                  required
                  value={volume === 0 ? '' : volume}
                  onChange={(e) => setVolume(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Ví dụ: 85000000"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
              <div className="text-right text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono-numbers mt-1">
                {formatCurrencyVND(volume)}
              </div>
            </div>
          </div>

          {/* Section: Tuyển dụng & Kích hoạt code */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Tuyển Dụng & Kích Hoạt Code Hôm Nay
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số NV HĐLĐ tuyển mới:
                </label>
                <input
                  type="number"
                  min="0"
                  value={newContractStaff === 0 ? '' : newContractStaff}
                  onChange={(e) => setNewContractStaff(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số NV CTV tuyển mới:
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAgents === 0 ? '' : newAgents}
                  onChange={(e) => setNewAgents(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số HĐLĐ kích hoạt code:
                </label>
                <input
                  type="number"
                  min="0"
                  value={activeCodeContractStaff === 0 ? '' : activeCodeContractStaff}
                  onChange={(e) => setActiveCodeContractStaff(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Số CTV kích hoạt code:
                </label>
                <input
                  type="number"
                  min="0"
                  value={activeCodeAgents === 0 ? '' : activeCodeAgents}
                  onChange={(e) => setActiveCodeAgents(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono-numbers font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Ghi chú hoạt động trong ngày:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú về thị trường, tiến độ hoàn thành, chiến dịch chạy trong ngày..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
            />
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
              className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors"
            >
              Lưu & Chốt Báo Cáo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

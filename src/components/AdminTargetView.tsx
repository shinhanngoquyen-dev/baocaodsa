import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, CheckCircle, Target, Users, ShieldCheck } from 'lucide-react';
import { formatCurrencyShort, formatCurrencyVND } from '../utils/formatters';
import { AdminSettings } from '../types';

interface AdminTargetViewProps {
  onOpenTargetModalForTeamlead: (teamleadId: string) => void;
}

export const AdminTargetView: React.FC<AdminTargetViewProps> = ({
  onOpenTargetModalForTeamlead,
}) => {
  const {
    currentUser,
    teamleads,
    supervisors,
    adminSettings,
    batchUpdateAdminSettings,
  } = useApp();

  // Filter teamleads based on user role
  const editableTeamleads = currentUser.role === 'DIRECTOR'
    ? teamleads
    : currentUser.role === 'SUPERVISOR'
    ? teamleads.filter((t) => {
        const sup = supervisors.find((s) => s.userId === currentUser.id);
        return sup ? t.supervisorId === sup.id : false;
      })
    : [];

  // Local draft state for batch editing
  const [draftSettings, setDraftSettings] = useState<Record<string, {
    activeContractStaff: number;
    existingAgents: number;
    targetVolume: number;
    targetLoans: number;
    targetApp: number;
  }>>(() => {
    const map: any = {};
    adminSettings.forEach((s: AdminSettings) => {
      map[s.teamleadId] = {
        activeContractStaff: s.activeContractStaff,
        existingAgents: s.existingAgents,
        targetVolume: s.targetVolume,
        targetLoans: s.targetLoans,
        targetApp: s.targetApp,
      };
    });
    return map;
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleFieldChange = (teamleadId: string, field: string, val: number) => {
    setDraftSettings((prev) => ({
      ...prev,
      [teamleadId]: {
        ...prev[teamleadId],
        [field]: val,
      },
    }));
  };

  const handleSaveAll = () => {
    const updates = Object.entries(draftSettings).map(([teamleadId, values]) => ({
      teamleadId,
      updates: values,
    }));
    batchUpdateAdminSettings(updates);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden space-y-4">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              Thiết Lập Chỉ Số Quản Trị & Mục Tiêu Tháng
            </h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono-numbers px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              {editableTeamleads.length} Nhóm
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Phân bổ trực tiếp: Số code HĐLĐ đang active, Số CTV hiện hữu, và Mục tiêu doanh số tháng (Volume, Loans, App)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Đã lưu thành công!
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Lưu Toàn Bộ Thay Đổi
          </button>
        </div>
      </div>

      {/* Editable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-3.5 font-bold w-12 text-center">STT</th>
              <th className="py-3 px-3.5 font-bold min-w-[160px]">Teamlead</th>
              <th className="py-3 px-3.5 font-bold min-w-[140px]">Giám Sát Phụ Trách</th>
              <th className="py-3 px-3.5 font-bold text-center min-w-[130px]">
                Số Code HĐLĐ Active
              </th>
              <th className="py-3 px-3.5 font-bold text-center min-w-[130px]">
                Số CTV Hiện Hữu
              </th>
              <th className="py-3 px-3.5 font-bold min-w-[180px]">
                Mục Tiêu Doanh Số (VNĐ)
              </th>
              <th className="py-3 px-3.5 font-bold text-center min-w-[100px]">
                Mục Tiêu Loans
              </th>
              <th className="py-3 px-3.5 font-bold text-center min-w-[100px]">
                Mục Tiêu App
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {editableTeamleads.map((tl, index) => {
              const draft = draftSettings[tl.id] || {
                activeContractStaff: 10,
                existingAgents: 20,
                targetVolume: 1500000000,
                targetLoans: 40,
                targetApp: 100,
              };

              return (
                <tr key={tl.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3.5 text-center text-slate-500 font-mono-numbers">
                    {index + 1}
                  </td>

                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {tl.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {tl.code} · {tl.region}
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5 text-slate-800 dark:text-slate-200">
                    {tl.supervisorName}
                  </td>

                  {/* Active staff */}
                  <td className="py-2.5 px-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={draft.activeContractStaff}
                      onChange={(e) =>
                        handleFieldChange(tl.id, 'activeContractStaff', parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1 text-center font-mono-numbers font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </td>

                  {/* Existing agents */}
                  <td className="py-2.5 px-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={draft.existingAgents}
                      onChange={(e) =>
                        handleFieldChange(tl.id, 'existingAgents', parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1 text-center font-mono-numbers font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </td>

                  {/* Target volume */}
                  <td className="py-2.5 px-3.5">
                    <input
                      type="number"
                      min="0"
                      step="50000000"
                      value={draft.targetVolume}
                      onChange={(e) =>
                        handleFieldChange(tl.id, 'targetVolume', parseInt(e.target.value) || 0)
                      }
                      className="w-36 px-2 py-1 font-mono-numbers font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                    <div className="text-[10px] text-blue-600 font-mono-numbers mt-0.5">
                      {formatCurrencyShort(draft.targetVolume)}
                    </div>
                  </td>

                  {/* Target Loans */}
                  <td className="py-2.5 px-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={draft.targetLoans}
                      onChange={(e) =>
                        handleFieldChange(tl.id, 'targetLoans', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-mono-numbers font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </td>

                  {/* Target App */}
                  <td className="py-2.5 px-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={draft.targetApp}
                      onChange={(e) =>
                        handleFieldChange(tl.id, 'targetApp', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-mono-numbers font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

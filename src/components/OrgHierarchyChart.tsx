import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatCurrencyShort, formatCurrencyVND, formatNumber, formatPercent } from '../utils/formatters';

interface OrgHierarchyChartProps {
  onSelectTeamleadReport?: (teamleadId: string) => void;
}

export const OrgHierarchyChart: React.FC<OrgHierarchyChartProps> = ({ onSelectTeamleadReport }) => {
  const {
    supervisors,
    teamleads,
    allMtdRows,
    allDailyRows,
    switchUser,
    currentUser,
    setActiveView,
    setSelectedSupervisorFilter,
  } = useApp();

  // Track expanded supervisors
  const [expandedSupervisors, setExpandedSupervisors] = useState<Record<string, boolean>>({
    GS01: true,
    GS02: true,
    GS03: true,
    GS04: true,
    GS05: true,
  });

  const toggleSupervisor = (id: string) => {
    setExpandedSupervisors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Grand total for Director
  const grandTotal = allMtdRows.reduce(
    (acc, r) => ({
      amount: acc.amount + r.totalAmountMTD,
      target: acc.target + r.targetVolume,
      loans: acc.loans + r.totalLoansMTD,
      activeStaff: acc.activeStaff + r.activeContractStaff,
      existingAgents: acc.existingAgents + r.existingAgents,
    }),
    { amount: 0, target: 0, loans: 0, activeStaff: 0, existingAgents: 0 }
  );
  const grandCompletionRate = grandTotal.target > 0 ? (grandTotal.amount / grandTotal.target) * 100 : 0;

  return (
    <div className="space-y-6">
      
      {/* Title & explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
            Sơ Đồ Phân Cấp Tổ Chức (3 Cấp Quản Lý)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mô hình: Tôi (Giám đốc) → 5 Giám Sát Bán Hàng → 22 Teamleaders (4–5 Teamlead/Giám sát)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              const allExpanded: Record<string, boolean> = {};
              supervisors.forEach((s) => (allExpanded[s.id] = true));
              setExpandedSupervisors(allExpanded);
            }}
            className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-medium"
          >
            Mở rộng tất cả
          </button>
          <button
            onClick={() => setExpandedSupervisors({})}
            className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-medium"
          >
            Thu gọn tất cả
          </button>
        </div>
      </div>

      {/* Level 1: "Tôi" (Giám đốc Khối) */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl bg-linear-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md border border-emerald-700 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-extrabold text-lg text-emerald-200 border border-white/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Cấp 1: Giám Đốc Kinh Doanh (Tôi)
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Nguyễn Văn Bê
                </h3>
                <div className="text-xs text-emerald-200">
                  Quản lý toàn bộ 5 Giám sát & 22 Teamlead toàn quốc
                </div>
              </div>
            </div>

            <button
              onClick={() => switchUser('user_director')}
              className="text-[11px] bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg text-emerald-100 font-medium transition-colors"
            >
              {currentUser.role === 'DIRECTOR' ? 'Đang kích hoạt' : 'Đăng nhập vai này'}
            </button>
          </div>

          {/* Rollup KPI metrics for Level 1 */}
          <div className="mt-4 pt-3 border-t border-emerald-700/60 grid grid-cols-3 gap-2 text-center">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Doanh Số MTD</div>
              <div className="text-base font-extrabold font-mono-numbers text-white">
                {formatCurrencyShort(grandTotal.amount)}
              </div>
              <div className="text-[10px] text-emerald-200 font-mono-numbers">
                MT: {formatCurrencyShort(grandTotal.target)}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Tiến Độ Kế Hoạch</div>
              <div className="text-base font-extrabold font-mono-numbers text-amber-300">
                {formatPercent(grandCompletionRate)}
              </div>
              <div className="text-[10px] text-emerald-200 font-mono-numbers">
                {formatNumber(grandTotal.loans)} HĐ Giải Ngân
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Quy Mô Nhân Sự</div>
              <div className="text-base font-extrabold font-mono-numbers text-white">
                {grandTotal.activeStaff} HĐLĐ
              </div>
              <div className="text-[10px] text-emerald-200 font-mono-numbers">
                {grandTotal.existingAgents} CTV
              </div>
            </div>
          </div>
        </div>

        {/* Vertical connector line */}
        <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700 my-0"></div>
      </div>

      {/* Level 2 & 3: 5 Giám Sát & Teamleads */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {supervisors.map((gs, gsIndex) => {
            const isExpanded = !!expandedSupervisors[gs.id];
            
            // Teamlead rows belonging to this supervisor
            const supMtdRows = allMtdRows.filter((r) => r.supervisorId === gs.id);
            const supDailyRows = allDailyRows.filter((r) => r.supervisorId === gs.id);

            const supTotalAmount = supMtdRows.reduce((sum, r) => sum + r.totalAmountMTD, 0);
            const supTargetAmount = supMtdRows.reduce((sum, r) => sum + r.targetVolume, 0);
            const supRate = supTargetAmount > 0 ? (supTotalAmount / supTargetAmount) * 100 : 0;
            const supReportedToday = supDailyRows.filter((r) => r.isReported).length;

            return (
              <div
                key={gs.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden flex flex-col"
              >
                {/* Supervisor Node Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      GS{gsIndex + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                          Cấp 2: Giám Sát Bán Hàng
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {gs.code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {gs.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {gs.region} · Quản lý <strong className="text-slate-800 dark:text-slate-200">{gs.teamleadIds.length} Teamlead</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => switchUser(gs.userId)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-md transition-colors"
                      title="Chuyển quyền sang Giám Sát này"
                    >
                      Đăng nhập GS
                    </button>
                    <button
                      onClick={() => toggleSupervisor(gs.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title={isExpanded ? 'Thu gọn' : 'Xem Teamlead'}
                    >
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Supervisor Branch Summary Metrics */}
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Doanh số MTD</span>
                    <div className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                      {formatCurrencyShort(supTotalAmount)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Tiến độ nhánh</span>
                    <div className="font-bold text-emerald-600 font-mono-numbers">
                      {formatPercent(supRate)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Báo cáo ngày</span>
                    <div className="font-bold font-mono-numbers text-slate-700 dark:text-slate-300">
                      {supReportedToday}/{gs.teamleadIds.length} TL
                    </div>
                  </div>
                </div>

                {/* Level 3: Teamlead List under this Supervisor */}
                {isExpanded && (
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 grow">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                      Cấp 3: Danh sách Teamleaders ({supMtdRows.length} Nhóm)
                    </div>

                    {supMtdRows.map((tlRow) => {
                      const daily = supDailyRows.find((d) => d.teamleadId === tlRow.teamleadId);
                      return (
                        <div
                          key={tlRow.teamleadId}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                              TL
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {tlRow.teamleadName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {tlRow.teamleadCode}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {tlRow.region} · {tlRow.activeContractStaff} HĐLĐ active / {tlRow.existingAgents} CTV
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers">
                                {formatCurrencyShort(tlRow.totalAmountMTD)}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono-numbers">
                                {tlRow.totalLoansMTD} Loans · <span className="text-emerald-600 font-semibold">{formatPercent(tlRow.completionRate)}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (onSelectTeamleadReport) {
                                  onSelectTeamleadReport(tlRow.teamleadId);
                                }
                              }}
                              className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition-colors"
                            >
                              Báo cáo
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

    </div>
  );
};

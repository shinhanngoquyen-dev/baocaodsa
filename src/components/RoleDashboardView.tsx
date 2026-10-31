import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Target,
  Trophy,
  Users,
  ShieldCheck,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  formatCurrencyShort,
  formatCurrencyVND,
  formatNumber,
  formatPercent,
  formatDateVN,
} from '../utils/formatters';

interface RoleDashboardViewProps {
  onOpenReportModal: () => void;
  onOpenAdminModal: () => void;
  onNavigateToMtd: () => void;
  onNavigateToDaily: () => void;
  onNavigateToHierarchy: () => void;
}

export const RoleDashboardView: React.FC<RoleDashboardViewProps> = ({
  onOpenReportModal,
  onOpenAdminModal,
  onNavigateToMtd,
  onNavigateToDaily,
  onNavigateToHierarchy,
}) => {
  const {
    currentUser,
    supervisors,
    teamleads,
    allMtdRows,
    allDailyRows,
    filteredMtdRows,
    filteredDailyRows,
    summaryKPIs,
    selectedDate,
    switchUser,
  } = useApp();

  // Dashboard customization state
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showRecruitmentMetrics, setShowRecruitmentMetrics] = useState(true);

  // 1. DÀNH CHO CẤP 1: TÔI (GIÁM ĐỐC KHỐI)
  const renderDirectorDashboard = () => {
    // 5 Supervisors comparison
    const supervisorStats = supervisors.map((s) => {
      const rows = allMtdRows.filter((r) => r.supervisorId === s.id);
      const totalAmount = rows.reduce((acc, r) => acc + r.totalAmountMTD, 0);
      const targetAmount = rows.reduce((acc, r) => acc + r.targetVolume, 0);
      const loans = rows.reduce((acc, r) => acc + r.totalLoansMTD, 0);
      const rate = targetAmount > 0 ? (totalAmount / targetAmount) * 100 : 0;
      const reportedCount = allDailyRows.filter(
        (r) => r.supervisorId === s.id && r.isReported
      ).length;

      return {
        ...s,
        totalAmount,
        targetAmount,
        loans,
        rate,
        reportedCount,
        teamleadCount: rows.length,
      };
    });

    // Top 5 teamleads
    const topTeamleads = [...allMtdRows]
      .sort((a, b) => b.totalAmountMTD - a.totalAmountMTD)
      .slice(0, 5);

    // Bottom teamleads needing support
    const supportTeamleads = [...allMtdRows]
      .sort((a, b) => a.completionRate - b.completionRate)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        
        {/* Banner Quản trị Cấp Cao */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Giao Diện Giám Đốc Kinh Doanh (Tôi)</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Báo Cáo Toàn Diện Khối Kinh Doanh Tài Chính
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Giám sát 5 khu vực, 22 Teamleaders. Tự động tính doanh số MTD, theo dõi tiến độ và kích hoạt code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAdminModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Phân Bổ Mục Tiêu Tháng
            </button>
            <button
              onClick={onNavigateToHierarchy}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Xem Cây Phân Cấp
            </button>
          </div>
        </div>

        {/* So sánh thi đua 5 Giám Sát Bán Hàng */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Tiến Độ Doanh Số 5 Giám Sát Bán Hàng
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bảng xếp hạng hiệu suất MTD của từng giám sát và khu vực phụ trách
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-slate-500">
              5 / 5 Giám Sát
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {supervisorStats.map((s, idx) => {
              const isLead = idx === 0;
              return (
                <div
                  key={s.id}
                  onClick={() => switchUser(s.userId)}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      GS0{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono-numbers">
                      {formatPercent(s.rate)}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 truncate">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {s.region}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers">
                      {formatCurrencyShort(s.totalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {s.loans} Loans · {s.reportedCount}/{s.teamleadCount} Đã báo cáo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Teamlead & Nhóm cần tăng tốc */}
        {showLeaderboard && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top 5 dẫn đầu doanh số */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Top 5 Teamleaders Doanh Số MTD Cao Nhất
                </h4>
                <button
                  onClick={onNavigateToMtd}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  Xem tất cả <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {topTeamleads.map((tl, i) => (
                  <div
                    key={tl.teamleadId}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {tl.teamleadName}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {tl.supervisorName} · {tl.region}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers">
                        {formatCurrencyShort(tl.totalAmountMTD)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold font-mono-numbers">
                        {formatPercent(tl.completionRate)} KPI
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 cần tăng tốc */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Nhóm Cần Đôn Đốc Tiến Độ Doanh Số
                </h4>
                <button
                  onClick={onNavigateToDaily}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  Báo cáo ngày <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {supportTeamleads.map((tl, i) => (
                  <div
                    key={tl.teamleadId}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {tl.teamleadName}
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {tl.supervisorName} · Mục tiêu: {formatCurrencyShort(tl.targetVolume)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers">
                        {formatCurrencyShort(tl.totalAmountMTD)}
                      </div>
                      <div className="text-[10px] text-amber-600 font-bold font-mono-numbers">
                        Đạt {formatPercent(tl.completionRate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    );
  };

  // 2. DÀNH CHO CẤP 2: GIÁM SÁT BÁN HÀNG (SUPERVISOR)
  const renderSupervisorDashboard = () => {
    const currentSup = supervisors.find((s) => s.userId === currentUser.id) || supervisors[0];
    const branchTeamleads = teamleads.filter((t) => t.supervisorId === currentSup.id);
    const branchMtdRows = allMtdRows.filter((r) => r.supervisorId === currentSup.id);
    const branchDailyRows = allDailyRows.filter((r) => r.supervisorId === currentSup.id);

    const branchTotalAmount = branchMtdRows.reduce((sum, r) => sum + r.totalAmountMTD, 0);
    const branchTargetAmount = branchMtdRows.reduce((sum, r) => sum + r.targetVolume, 0);
    const branchRate = branchTargetAmount > 0 ? (branchTotalAmount / branchTargetAmount) * 100 : 0;
    const reportedCount = branchDailyRows.filter((r) => r.isReported).length;

    return (
      <div className="space-y-6">
        
        {/* Banner Supervisor */}
        <div className="bg-linear-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-5 border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <Building2 className="w-4 h-4" />
              <span>Giao Diện Giám Sát Bán Hàng: {currentSup.name} ({currentSup.code})</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Khu Vực Quản Lý: {currentSup.region}
            </h2>
            <p className="text-xs text-blue-200 mt-1">
              Phụ trách trực tiếp {branchTeamleads.length} Teamlead. Bạn có quyền thiết lập mục tiêu và số code HĐLĐ active cho các nhóm của mình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAdminModal}
              className="px-3.5 py-2 bg-white text-blue-900 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-blue-700" />
              Thiết Lập Target & Code Active
            </button>
            <button
              onClick={onNavigateToDaily}
              className="px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Theo Dõi Báo Cáo Ngày
            </button>
          </div>
        </div>

        {/* Branch Teamlead Performance Card List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tiến Độ Các Nhóm Teamlead Trực Thuộc ({branchTeamleads.length} Nhóm)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chốt báo cáo ngày: {reportedCount}/{branchTeamleads.length} nhóm đã gửi số liệu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchMtdRows.map((tl) => {
              const daily = branchDailyRows.find((d) => d.teamleadId === tl.teamleadId);
              return (
                <div
                  key={tl.teamleadId}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {tl.teamleadName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {tl.teamleadCode}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {tl.region} · {tl.activeContractStaff} HĐLĐ active / {tl.existingAgents} CTV
                      </div>
                    </div>

                    <div className="text-right">
                      {daily?.isReported ? (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã chốt ngày
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Chưa báo cáo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Doanh Số MTD</span>
                      <div className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                        {formatCurrencyShort(tl.totalAmountMTD)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Mục Tiêu</span>
                      <div className="font-bold text-slate-600 dark:text-slate-300 font-mono-numbers">
                        {formatCurrencyShort(tl.targetVolume)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Tiến Độ</span>
                      <div className="font-bold text-emerald-600 font-mono-numbers">
                        {formatPercent(tl.completionRate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">
                      Hôm nay: <strong className="font-mono-numbers text-slate-800 dark:text-slate-200">{formatCurrencyVND(daily?.amount || 0)}</strong> ({daily?.loans || 0} Loans)
                    </span>
                    <button
                      onClick={() => switchUser(teamleads.find((t) => t.id === tl.teamleadId)?.userId || '')}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Vào xem góc nhìn TL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  };

  // 3. DÀNH CHO CẤP 3: TEAMLEAD (TRƯỞNG NHÓM BÁN HÀNG)
  const renderTeamleadDashboard = () => {
    const currentTl = teamleads.find((t) => t.userId === currentUser.id) || teamleads[0];
    const myMtd = allMtdRows.find((r) => r.teamleadId === currentTl.id);
    const myDaily = allDailyRows.find((r) => r.teamleadId === currentTl.id);

    return (
      <div className="space-y-6">
        
        {/* Banner Teamleader */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-5 border border-emerald-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <UserCheck className="w-4 h-4" />
              <span>Giao Diện Tác Chiến Teamleader: {currentTl.name} ({currentTl.code})</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Khu Vực: {currentTl.region}
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Trực thuộc Giám Sát: <strong className="text-white">{currentTl.supervisorName}</strong>. Hãy nhập báo cáo đầy đủ hàng ngày trước 18:00.
            </p>
          </div>

          <div>
            <button
              onClick={onOpenReportModal}
              className="px-5 py-2.5 bg-white text-emerald-900 text-xs font-extrabold rounded-lg hover:bg-emerald-50 transition-colors shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              {myDaily?.isReported ? 'Cập Nhật Báo Cáo Hôm Nay' : 'Nhập Báo Cáo Ngày Hôm Nay'}
            </button>
          </div>
        </div>

        {/* Thẻ Kết quả nhóm mình */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lũy kế MTD của nhóm */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tiến Độ Doanh Số Tháng Của Nhóm Bạn
              </h3>
              <span className="text-xs font-bold text-emerald-600 font-mono-numbers">
                Đạt {formatPercent(myMtd?.completionRate || 0)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Doanh số thực đạt:</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                  {formatCurrencyVND(myMtd?.totalAmountMTD || 0)}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Mục tiêu giao từ Giám sát:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono-numbers">
                  {formatCurrencyVND(myMtd?.targetVolume || 0)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, myMtd?.completionRate || 0)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded">
                <div className="text-[10px] text-slate-400">Tổng App</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {formatNumber(myMtd?.totalAppMTD || 0)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded">
                <div className="text-[10px] text-slate-400">Tổng Loans</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {formatNumber(myMtd?.totalLoansMTD || 0)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded">
                <div className="text-[10px] text-slate-400">Tỷ Lệ Duyệt</div>
                <div className="font-bold text-emerald-600 font-mono-numbers">
                  {formatPercent(myMtd?.loanConversionRate || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Báo cáo ngày hôm nay */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Báo Cáo Ngày ({formatDateVN(selectedDate)})
              </h3>
              {myDaily?.isReported ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã nộp báo cáo
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Chưa nộp hôm nay
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Doanh số ngày (Amount)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono-numbers block mt-1">
                  {formatCurrencyVND(myDaily?.amount || 0)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Hợp đồng giải ngân (Loans)</span>
                <span className="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono-numbers block mt-1">
                  {formatNumber(myDaily?.loans || 0)} Loans / {formatNumber(myDaily?.app || 0)} App
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Số HĐLĐ kích hoạt code hôm nay:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {myDaily?.activeCodeContractStaff || 0} Code
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số CTV kích hoạt code hôm nay:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {myDaily?.activeCodeAgents || 0} Code
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tuyển mới hôm nay:</span>
                <span className="font-bold text-emerald-600 font-mono-numbers">
                  +{myDaily?.newContractStaffToday || 0} HĐLĐ / +{myDaily?.newAgentsToday || 0} CTV
                </span>
              </div>
            </div>

            {myDaily?.note && (
              <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded border border-amber-200/50 dark:border-amber-900/40">
                "{myDaily.note}"
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6">
      {currentUser.role === 'DIRECTOR' && renderDirectorDashboard()}
      {currentUser.role === 'SUPERVISOR' && renderSupervisorDashboard()}
      {currentUser.role === 'TEAMLEAD' && renderTeamleadDashboard()}
    </div>
  );
};

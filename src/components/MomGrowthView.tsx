import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  HardDriveDownload,
  Users,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatCurrencyShort,
  formatNumber,
} from '../utils/formatters';

interface MomGrowthViewProps {
  onOpenMonthEndModal: () => void;
}

export const MomGrowthView: React.FC<MomGrowthViewProps> = ({
  onOpenMonthEndModal,
}) => {
  const {
    momGrowthRows,
    previousMonthData,
    supervisors,
    selectedSupervisorFilter,
    setSelectedSupervisorFilter,
    searchTerm,
    setSearchTerm,
    currentUser,
  } = useApp();

  const [activeMetricTab, setActiveMetricTab] = useState<'ALL' | 'AMOUNT' | 'LOANS' | 'APP'>('ALL');
  const [supervisorScope, setSupervisorScope] = useState<'MY_BRANCH' | 'ALL'>('MY_BRANCH');

  // Filter rows
  const filteredRows = useMemo(() => {
    let rows = momGrowthRows;

    if (currentUser.role === 'SUPERVISOR') {
      if (supervisorScope === 'MY_BRANCH') {
        const sup = supervisors.find((s) => s.userId === currentUser.id);
        if (sup) {
          rows = rows.filter((r) => r.supervisorName.toLowerCase().includes(sup.name.toLowerCase()));
        }
      }
    } else if (currentUser.role === 'DIRECTOR' && selectedSupervisorFilter !== 'ALL') {
      const targetSup = supervisors.find((s) => s.id === selectedSupervisorFilter);
      if (targetSup) {
        rows = rows.filter((r) => r.supervisorName.toLowerCase().includes(targetSup.name.toLowerCase()));
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.teamleadName.toLowerCase().includes(q) ||
          r.teamleadCode.toLowerCase().includes(q) ||
          r.supervisorName.toLowerCase().includes(q) ||
          r.region.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [momGrowthRows, currentUser, supervisors, selectedSupervisorFilter, searchTerm]);

  // Aggregate totals
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.curAmount += r.currentAmount;
        acc.prevAmount += r.previousAmount;
        acc.curLoans += r.currentLoans;
        acc.prevLoans += r.previousLoans;
        acc.curApp += r.currentApp;
        acc.prevApp += r.previousApp;
        acc.curNewStaff += r.currentNewStaff;
        acc.prevNewStaff += r.previousNewStaff;
        return acc;
      },
      {
        curAmount: 0,
        prevAmount: 0,
        curLoans: 0,
        prevLoans: 0,
        curApp: 0,
        prevApp: 0,
        curNewStaff: 0,
        prevNewStaff: 0,
      }
    );
  }, [filteredRows]);

  const totalAmountDiff = totals.curAmount - totals.prevAmount;
  const totalAmountGrowthPct = totals.prevAmount > 0 ? (totalAmountDiff / totals.prevAmount) * 100 : 0;

  const totalLoansDiff = totals.curLoans - totals.prevLoans;
  const totalLoansGrowthPct = totals.prevLoans > 0 ? (totalLoansDiff / totals.prevLoans) * 100 : 0;

  const totalAppDiff = totals.curApp - totals.prevApp;
  const totalAppGrowthPct = totals.prevApp > 0 ? (totalAppDiff / totals.prevApp) * 100 : 0;

  const totalNewStaffDiff = totals.curNewStaff - totals.prevNewStaff;
  const totalNewStaffGrowthPct = totals.prevNewStaff > 0 ? (totalNewStaffDiff / totals.prevNewStaff) * 100 : 0;

  // Export CSV MoM
  const exportMomToCsv = () => {
    const headers = [
      'STT',
      'Teamlead',
      'Mã TL',
      'Giám Sát Phụ Trách',
      'Khu Vực',
      `Doanh Số ${previousMonthData.monthLabel} (VNĐ)`,
      'Doanh Số Tháng Này MTD (VNĐ)',
      'Chênh Lệch Doanh Số (VNĐ)',
      '% Tăng Trưởng Doanh Số',
      `Loans ${previousMonthData.monthLabel}`,
      'Loans Tháng Này MTD',
      '% Tăng Trưởng Loans',
      `App ${previousMonthData.monthLabel}`,
      'App Tháng Này MTD',
      '% Tăng Trưởng App',
      'Tuyển Mới Tháng Trước',
      'Tuyển Mới Tháng Này',
    ];

    const rows = filteredRows.map((r, i) => [
      i + 1,
      `"${r.teamleadName}"`,
      `"${r.teamleadCode}"`,
      `"${r.supervisorName}"`,
      `"${r.region}"`,
      r.previousAmount,
      r.currentAmount,
      r.amountDiff,
      `${r.amountGrowthPct.toFixed(1)}%`,
      r.previousLoans,
      r.currentLoans,
      `${r.loansGrowthPct.toFixed(1)}%`,
      r.previousApp,
      r.currentApp,
      `${r.appGrowthPct.toFixed(1)}%`,
      r.previousNewStaff,
      r.currentNewStaff,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Tang_Truong_MoM_${previousMonthData.monthLabel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-indigo-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-700/60">
                MoM Analysis · So Sánh Cùng Kỳ
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {previousMonthData.monthLabel} ➔ Tháng Hiện Tại
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
              Bảng So Sánh Mức Độ Tăng Trưởng Doanh Số Cùng Kỳ
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Đối chiếu trực quan tốc độ tăng trưởng Doanh số Volume, Số hợp đồng Loans, Hồ sơ App và Nhân sự tuyển mới giữa 2 chu kỳ tháng của từng Teamleader.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === 'DIRECTOR' && (
              <button
                onClick={onOpenMonthEndModal}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>Chốt Tháng / Import Tháng Trước</span>
              </button>
            )}

            <button
              onClick={exportMomToCsv}
              className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Báo Cáo MoM (Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Thẻ KPI Tăng Trưởng Tổng Thể */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Doanh số Volume MoM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Doanh Số Volume MoM
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                totalAmountGrowthPct >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {totalAmountGrowthPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{totalAmountGrowthPct >= 0 ? '+' : ''}{totalAmountGrowthPct.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatCurrencyVND(totals.curAmount)}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{previousMonthData.monthLabel}: {formatCurrencyShort(totals.prevAmount)}</span>
            <span className={`font-mono-numbers font-bold ${totalAmountDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalAmountDiff >= 0 ? '+' : ''}{formatCurrencyShort(totalAmountDiff)}
            </span>
          </div>
        </div>

        {/* 2. Số HĐ Loans MoM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Hợp Đồng Loans MoM
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                totalLoansGrowthPct >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {totalLoansGrowthPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{totalLoansGrowthPct >= 0 ? '+' : ''}{totalLoansGrowthPct.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono-numbers tracking-tight">
            {totals.curLoans} HĐ
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{previousMonthData.monthLabel}: {totals.prevLoans} HĐ</span>
            <span className={`font-mono-numbers font-bold ${totalLoansDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalLoansDiff >= 0 ? '+' : ''}{totalLoansDiff} HĐ
            </span>
          </div>
        </div>

        {/* 3. Hồ Sơ App MoM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Hồ Sơ Nộp App MoM
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                totalAppGrowthPct >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {totalAppGrowthPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{totalAppGrowthPct >= 0 ? '+' : ''}{totalAppGrowthPct.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400 font-mono-numbers tracking-tight">
            {totals.curApp} App
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{previousMonthData.monthLabel}: {totals.prevApp} App</span>
            <span className={`font-mono-numbers font-bold ${totalAppDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalAppDiff >= 0 ? '+' : ''}{totalAppDiff} App
            </span>
          </div>
        </div>

        {/* 4. Tuyển Mới MoM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Nhân Sự Tuyển Mới MoM
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                totalNewStaffGrowthPct >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {totalNewStaffGrowthPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{totalNewStaffGrowthPct >= 0 ? '+' : ''}{totalNewStaffGrowthPct.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 font-mono-numbers tracking-tight">
            {totals.curNewStaff} Tuyển Mới
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{previousMonthData.monthLabel}: {totals.prevNewStaff} NS</span>
            <span className={`font-mono-numbers font-bold ${totalNewStaffDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalNewStaffDiff >= 0 ? '+' : ''}{totalNewStaffDiff} NS
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {currentUser.role === 'DIRECTOR' && (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSupervisorFilter}
                onChange={(e) => setSelectedSupervisorFilter(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Toàn Bộ 3 Nhánh Giám Sát</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentUser.role === 'SUPERVISOR' && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <select
                value={supervisorScope}
                onChange={(e) => setSupervisorScope(e.target.value as 'MY_BRANCH' | 'ALL')}
                className="bg-transparent text-blue-900 dark:text-blue-200 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="MY_BRANCH">Nhánh Của Tôi ({supervisors.find((s) => s.userId === currentUser.id)?.name})</option>
                <option value="ALL">Toàn Bộ 3 Nhánh (Đối sánh toàn vùng)</option>
              </select>
            </div>
          )}

          <div className="relative grow sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm Teamlead, mã TL..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Hiển thị <strong>{filteredRows.length}</strong> / {momGrowthRows.length} Teamlead
        </div>
      </div>

      {/* BẢNG SO SÁNH TĂNG TRƯỞNG CHI TIẾT */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Header cấp 1 */}
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th colSpan={4} className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] border-r border-slate-200 dark:border-slate-700">
                  Thông Tin Đơn Vị
                </th>
                <th colSpan={4} className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-center bg-emerald-50/70 dark:bg-emerald-950/40 border-r border-slate-200 dark:border-slate-700 text-emerald-900 dark:text-emerald-200">
                  Doanh Số Giải Ngân (Volume VNĐ)
                </th>
                <th colSpan={3} className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-center bg-blue-50/70 dark:bg-blue-950/40 border-r border-slate-200 dark:border-slate-700 text-blue-900 dark:text-blue-200">
                  Hợp Đồng Loans
                </th>
                <th colSpan={3} className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px] text-center bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200">
                  Hồ Sơ Nộp App
                </th>
              </tr>

              {/* Header cấp 2 */}
              <tr className="bg-slate-50/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <th className="py-2.5 px-3 text-center w-12 font-bold">STT</th>
                <th className="py-2.5 px-3 min-w-[150px] font-bold">Teamlead</th>
                <th className="py-2.5 px-3 min-w-[130px] font-bold">Giám Sát</th>
                <th className="py-2.5 px-3 min-w-[130px] font-bold border-r border-slate-200 dark:border-slate-700">Khu Vực</th>

                {/* Amount columns */}
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/20">
                  {previousMonthData.monthLabel}
                </th>
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/20">
                  Tháng Này MTD
                </th>
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/20">
                  Chênh Lệch
                </th>
                <th className="py-2.5 px-3 text-center font-bold whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/20 border-r border-slate-200 dark:border-slate-700">
                  % MoM
                </th>

                {/* Loans columns */}
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/20">
                  Tháng Trước
                </th>
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/20">
                  Tháng Này
                </th>
                <th className="py-2.5 px-3 text-center font-bold whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-700">
                  % MoM
                </th>

                {/* App columns */}
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-purple-50/30 dark:bg-purple-950/20">
                  Tháng Trước
                </th>
                <th className="py-2.5 px-3 text-right font-bold whitespace-nowrap bg-purple-50/30 dark:bg-purple-950/20">
                  Tháng Này
                </th>
                <th className="py-2.5 px-3 text-center font-bold whitespace-nowrap bg-purple-50/30 dark:bg-purple-950/20">
                  % MoM
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.map((r, index) => {
                const isAmountPositive = r.amountDiff >= 0;
                const isLoansPositive = r.loansDiff >= 0;
                const isAppPositive = r.appDiff >= 0;

                return (
                  <tr
                    key={r.teamleadId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      <div>{r.teamleadName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{r.teamleadCode}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {r.supervisorName.replace('Giám Sát ', '')}
                    </td>

                    <td className="py-3 px-3 text-slate-500 border-r border-slate-200 dark:border-slate-800">
                      {r.region}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-mono-numbers text-slate-500">
                      {formatCurrencyVND(r.previousAmount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                      {formatCurrencyVND(r.currentAmount)}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono-numbers font-semibold ${isAmountPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isAmountPositive ? '+' : ''}{formatCurrencyShort(r.amountDiff)}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-black font-mono-numbers ${
                          isAmountPositive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}
                      >
                        {isAmountPositive ? '↗' : '↘'} {isAmountPositive ? '+' : ''}{r.amountGrowthPct.toFixed(1)}%
                      </span>
                    </td>

                    {/* Loans */}
                    <td className="py-3 px-3 text-right font-mono-numbers text-slate-500">
                      {r.previousLoans}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-emerald-600 dark:text-emerald-400">
                      {r.currentLoans}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-numbers ${
                          isLoansPositive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {isLoansPositive ? '+' : ''}{r.loansGrowthPct.toFixed(1)}%
                      </span>
                    </td>

                    {/* App */}
                    <td className="py-3 px-3 text-right font-mono-numbers text-slate-500">
                      {r.previousApp}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-blue-600 dark:text-blue-400">
                      {r.currentApp}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-numbers ${
                          isAppPositive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {isAppPositive ? '+' : ''}{r.appGrowthPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Hàng Tổng Cộng Toàn Vùng Sale North 1 */}
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold border-t-2 border-slate-300 dark:border-slate-600">
                <td colSpan={4} className="py-3.5 px-3.5 uppercase tracking-wider text-xs border-r border-slate-200 dark:border-slate-700">
                  TỔNG CỘNG TOÀN VÙNG ({filteredRows.length} TEAM)
                </td>

                {/* Amount Totals */}
                <td className="py-3.5 px-3 text-right font-mono-numbers text-slate-500">
                  {formatCurrencyVND(totals.prevAmount)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono-numbers text-emerald-700 dark:text-emerald-300 text-sm">
                  {formatCurrencyVND(totals.curAmount)}
                </td>
                <td className={`py-3.5 px-3 text-right font-mono-numbers ${totalAmountDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalAmountDiff >= 0 ? '+' : ''}{formatCurrencyShort(totalAmountDiff)}
                </td>
                <td className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-700">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-mono-numbers shadow-xs ${
                      totalAmountGrowthPct >= 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {totalAmountGrowthPct >= 0 ? '↗ +' : '↘ '}{totalAmountGrowthPct.toFixed(1)}%
                  </span>
                </td>

                {/* Loans Totals */}
                <td className="py-3.5 px-3 text-right font-mono-numbers text-slate-500">
                  {totals.prevLoans} HĐ
                </td>
                <td className="py-3.5 px-3 text-right font-mono-numbers text-emerald-600 text-sm">
                  {totals.curLoans} HĐ
                </td>
                <td className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-700">
                  <span className="font-mono-numbers font-bold text-emerald-600">
                    {totalLoansGrowthPct >= 0 ? '+' : ''}{totalLoansGrowthPct.toFixed(1)}%
                  </span>
                </td>

                {/* App Totals */}
                <td className="py-3.5 px-3 text-right font-mono-numbers text-slate-500">
                  {totals.prevApp} App
                </td>
                <td className="py-3.5 px-3 text-right font-mono-numbers text-blue-600 text-sm">
                  {totals.curApp} App
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="font-mono-numbers font-bold text-blue-600">
                    {totalAppGrowthPct >= 0 ? '+' : ''}{totalAppGrowthPct.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};

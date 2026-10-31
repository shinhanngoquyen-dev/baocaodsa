import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Settings,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatCurrencyShort,
  formatNumber,
  formatPercent,
  formatDateVN,
} from '../utils/formatters';
import { UnifiedDashboardRow } from '../types';

interface UnifiedDashboardTableProps {
  onOpenReportModalForTeamlead?: (teamleadId: string) => void;
  onOpenAdminModalForTeamlead?: (teamleadId: string) => void;
}

type FilterWarningType = 'ALL' | 'WARNING_ONLY' | 'OK_ONLY';

export const UnifiedDashboardTable: React.FC<UnifiedDashboardTableProps> = ({
  onOpenReportModalForTeamlead,
  onOpenAdminModalForTeamlead,
}) => {
  const {
    unifiedDashboardRows,
    currentUser,
    supervisors,
    selectedSupervisorFilter,
    setSelectedSupervisorFilter,
    searchTerm,
    setSearchTerm,
    selectedDate,
    exportToCsv,
    summaryKPIs,
  } = useApp();

  const [warningFilter, setWarningFilter] = useState<FilterWarningType>('ALL');
  const [sortField, setSortField] = useState<keyof UnifiedDashboardRow>('totalAmountMTD');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof UnifiedDashboardRow) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredRows = useMemo(() => {
    let list = [...unifiedDashboardRows];

    // Filter by warning type
    if (warningFilter === 'WARNING_ONLY') {
      list = list.filter((r) => r.warningStatus !== 'OK');
    } else if (warningFilter === 'OK_ONLY') {
      list = list.filter((r) => r.warningStatus === 'OK');
    }

    // Sort
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [unifiedDashboardRows, warningFilter, sortField, sortDirection]);

  // Aggregate footer totals
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        activeStaff: acc.activeStaff + r.activeContractStaff,
        existingAgents: acc.existingAgents + r.existingAgents,
        newStaff: acc.newStaff + r.newContractStaffMTD,
        newAgents: acc.newAgents + r.newAgentsMTD,
        appMTD: acc.appMTD + r.totalAppMTD,
        loansMTD: acc.loansMTD + r.totalLoansMTD,
        amountMTD: acc.amountMTD + r.totalAmountMTD,
        targetMTD: acc.targetMTD + r.targetVolume,
        todayApp: acc.todayApp + r.todayApp,
        todayLoans: acc.todayLoans + r.todayLoans,
        todayAmount: acc.todayAmount + r.todayAmount,
        todayActiveHld: acc.todayActiveHld + r.todayActiveCodeHld,
        todayActiveCtv: acc.todayActiveCtv + r.todayActiveCodeCtv,
        warningCount: acc.warningCount + (r.warningStatus !== 'OK' ? 1 : 0),
      }),
      {
        activeStaff: 0,
        existingAgents: 0,
        newStaff: 0,
        newAgents: 0,
        appMTD: 0,
        loansMTD: 0,
        amountMTD: 0,
        targetMTD: 0,
        todayApp: 0,
        todayLoans: 0,
        todayAmount: 0,
        todayActiveHld: 0,
        todayActiveCtv: 0,
        warningCount: 0,
      }
    );
  }, [filteredRows]);

  const totalCompletionRate = totals.targetMTD > 0 ? (totals.amountMTD / totals.targetMTD) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Bảng Tổng Hợp Doanh Số: MTD & Trong Ngày (2 Ca Báo Cáo)
              </h2>
              <span className="text-xs bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono-numbers px-2 py-0.5 rounded">
                Ngày {formatDateVN(selectedDate)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Theo dõi đồng bộ: Doanh số MTD, Doanh số ngày, và Cảnh báo báo cáo 2 ca (Ca 1: trước 12h · Ca 2: trước 19h)
            </p>
          </div>

          {/* Quick Warning Summary Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setWarningFilter('ALL')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                warningFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tất cả ({unifiedDashboardRows.length})
            </button>

            <button
              onClick={() => setWarningFilter('WARNING_ONLY')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                warningFilter === 'WARNING_ONLY'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Cảnh báo chưa nộp ({summaryKPIs.missingShift1Count + summaryKPIs.missingShift2Count} ca)
            </button>

            <button
              onClick={() => setWarningFilter('OK_ONLY')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                warningFilter === 'OK_ONLY'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đủ 2 ca ({summaryKPIs.fullyReportedCount})
            </button>

            <button
              onClick={exportToCsv}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
          {currentUser.role === 'DIRECTOR' && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSupervisorFilter}
                onChange={(e) => setSelectedSupervisorFilter(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Toàn Bộ 5 Giám Sát</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm Teamlead, Mã TL, Giám Sát..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden w-48 sm:w-64"
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Ca 1: Trước 12h
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Ca 2: Trước 19h
            </span>
          </div>
        </div>
      </div>

      {/* Main Table with Double Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {/* Top Super Headers */}
            <tr className="bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider">
              <th colSpan={3} className="py-2 px-3 text-center border-r border-slate-300 dark:border-slate-700">
                Thông Tin Teamleader
              </th>
              <th colSpan={6} className="py-2 px-3 text-center border-r border-slate-300 dark:border-slate-700 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300">
                Doanh Số Lũy Kế Tháng (MTD)
              </th>
              <th colSpan={5} className="py-2 px-3 text-center border-r border-slate-300 dark:border-slate-700 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300">
                Doanh Số Trong Ngày
              </th>
              <th colSpan={3} className="py-2 px-3 text-center bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">
                Báo Cáo 2 Ca & Cảnh Báo
              </th>
              <th className="py-2 px-2 text-center w-14">
                Thao Tác
              </th>
            </tr>

            {/* Sub Columns */}
            <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 select-none text-[11px]">
              {/* Info */}
              <th
                onClick={() => handleSort('stt')}
                className="py-2.5 px-3 font-bold cursor-pointer text-center w-10"
              >
                STT
              </th>
              <th
                onClick={() => handleSort('teamleadName')}
                className="py-2.5 px-3 font-bold cursor-pointer min-w-[150px]"
              >
                <div className="flex items-center gap-1">
                  Teamlead
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('supervisorName')}
                className="py-2.5 px-3 font-bold cursor-pointer min-w-[130px] border-r border-slate-200 dark:border-slate-800"
              >
                Giám Sát
              </th>

              {/* MTD Columns */}
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[110px]">
                Code HĐLĐ
                <div className="text-[10px] text-slate-400 font-normal">Active / Tuyển MTD</div>
              </th>
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[110px]">
                Code CTV
                <div className="text-[10px] text-slate-400 font-normal">Hiện hữu / Tuyển MTD</div>
              </th>
              <th
                onClick={() => handleSort('totalAppMTD')}
                className="py-2.5 px-2.5 font-bold cursor-pointer text-right whitespace-nowrap"
              >
                App MTD
              </th>
              <th
                onClick={() => handleSort('totalLoansMTD')}
                className="py-2.5 px-2.5 font-bold cursor-pointer text-right whitespace-nowrap"
              >
                Loans MTD
              </th>
              <th
                onClick={() => handleSort('totalAmountMTD')}
                className="py-2.5 px-3 font-bold cursor-pointer text-right whitespace-nowrap min-w-[130px]"
              >
                <div className="flex items-center justify-end gap-1">
                  Amount MTD
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('completionRate')}
                className="py-2.5 px-2.5 font-bold cursor-pointer text-center whitespace-nowrap min-w-[90px] border-r border-slate-200 dark:border-slate-800"
              >
                Tiến Độ %
              </th>

              {/* Daily Columns */}
              <th className="py-2.5 px-2.5 font-bold text-right whitespace-nowrap">
                App Ngày
              </th>
              <th className="py-2.5 px-2.5 font-bold text-right whitespace-nowrap">
                Loans Ngày
              </th>
              <th
                onClick={() => handleSort('todayAmount')}
                className="py-2.5 px-3 font-bold cursor-pointer text-right whitespace-nowrap min-w-[130px]"
              >
                <div className="flex items-center justify-end gap-1">
                  Amount Ngày
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[100px]">
                Kích Hoạt HĐLĐ
              </th>
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[100px] border-r border-slate-200 dark:border-slate-800">
                Kích Hoạt CTV
              </th>

              {/* 2 Shifts & Warnings */}
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[100px]">
                Ca 1 (Trước 12h)
              </th>
              <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap min-w-[100px]">
                Ca 2 (Trước 19h)
              </th>
              <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap min-w-[150px]">
                Cảnh Báo Báo Cáo
              </th>

              <th className="py-2.5 px-2 font-bold text-center">
                Nhập
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-xs">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-8 text-center text-slate-500">
                  Không tìm thấy teamlead nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const hasWarning = row.warningStatus !== 'OK';
                const isMissingBoth = row.warningStatus === 'MISSING_BOTH';
                const isMissing12h = row.warningStatus === 'MISSING_12H';
                const isMissing19h = row.warningStatus === 'MISSING_19H';

                return (
                  <tr
                    key={row.teamleadId}
                    className={`transition-colors ${
                      hasWarning
                        ? 'bg-amber-50/40 dark:bg-amber-950/15 hover:bg-amber-50/70 dark:hover:bg-amber-950/30'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* STT */}
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono-numbers">
                      {index + 1}
                    </td>

                    {/* Teamlead */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {row.teamleadName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {row.teamleadCode} · {row.region}
                      </div>
                    </td>

                    {/* Supervisor */}
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                      {row.supervisorName}
                    </td>

                    {/* Code HĐLĐ (Active / Tuyển MTD) */}
                    <td className="py-2.5 px-2.5 text-center font-mono-numbers whitespace-nowrap">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {row.activeContractStaff}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold ml-1">
                        (+{row.newContractStaffMTD})
                      </span>
                    </td>

                    {/* Code CTV (Hiện hữu / Tuyển MTD) */}
                    <td className="py-2.5 px-2.5 text-center font-mono-numbers whitespace-nowrap">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {row.existingAgents}
                      </span>
                      <span className="text-[11px] text-blue-600 font-semibold ml-1">
                        (+{row.newAgentsMTD})
                      </span>
                    </td>

                    {/* App MTD */}
                    <td className="py-2.5 px-2.5 text-right font-mono-numbers text-slate-800 dark:text-slate-200">
                      {formatNumber(row.totalAppMTD)}
                    </td>

                    {/* Loans MTD */}
                    <td className="py-2.5 px-2.5 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                      {formatNumber(row.totalLoansMTD)}
                    </td>

                    {/* Amount MTD */}
                    <td className="py-2.5 px-3 text-right font-mono-numbers">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatCurrencyVND(row.totalAmountMTD)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-numbers">
                        MT: {formatCurrencyShort(row.targetVolume)}
                      </div>
                    </td>

                    {/* Tiến độ % MTD */}
                    <td className="py-2.5 px-2.5 text-center font-mono-numbers border-r border-slate-200 dark:border-slate-800">
                      <span
                        className={`font-bold ${
                          row.completionRate >= 100
                            ? 'text-emerald-600'
                            : row.completionRate < 80
                            ? 'text-amber-600'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {formatPercent(row.completionRate)}
                      </span>
                    </td>

                    {/* App Ngày */}
                    <td className="py-2.5 px-2.5 text-right font-mono-numbers text-slate-700 dark:text-slate-300">
                      {formatNumber(row.todayApp)}
                    </td>

                    {/* Loans Ngày */}
                    <td className="py-2.5 px-2.5 text-right font-mono-numbers font-bold text-blue-700 dark:text-blue-400">
                      {formatNumber(row.todayLoans)}
                    </td>

                    {/* Amount Ngày */}
                    <td className="py-2.5 px-3 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                      {formatCurrencyVND(row.todayAmount)}
                    </td>

                    {/* HĐLĐ kích hoạt ngày */}
                    <td className="py-2.5 px-2.5 text-center font-mono-numbers">
                      {row.todayActiveCodeHld > 0 ? (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {row.todayActiveCodeHld} Code
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* CTV kích hoạt ngày */}
                    <td className="py-2.5 px-2.5 text-center font-mono-numbers border-r border-slate-200 dark:border-slate-800">
                      {row.todayActiveCodeCtv > 0 ? (
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          {row.todayActiveCodeCtv} Code
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Ca 1 (Trước 12h) */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      {row.shift1Reported ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {row.shift1Time ? row.shift1Time.split(' ')[1] : 'Đã nộp'}
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Chưa nộp
                        </span>
                      )}
                    </td>

                    {/* Ca 2 (Trước 19h) */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      {row.shift2Reported ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {row.shift2Time ? row.shift2Time.split(' ')[1] : 'Đã nộp'}
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Chưa nộp
                        </span>
                      )}
                    </td>

                    {/* CẢNH BÁO HIỆN TRÊN BẢNG */}
                    <td className="py-2.5 px-3 text-center">
                      {isMissingBoth && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          ⚠️ Thiếu 2 ca (12h & 19h)
                        </span>
                      )}
                      {isMissing12h && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          ⚠️ Chưa nộp ca 12h
                        </span>
                      )}
                      {isMissing19h && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          ⚠️ Chưa nộp ca 19h
                        </span>
                      )}
                      {!hasWarning && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đủ 2 ca
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => onOpenReportModalForTeamlead && onOpenReportModalForTeamlead(row.teamleadId)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
                          hasWarning
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {hasWarning ? 'Báo Cáo' : 'Sửa'}
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: TỔNG CỘNG */}
          {filteredRows.length > 0 && (
            <tfoot>
              <tr className="bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                <td className="py-3 px-3 text-center">Σ</td>
                <td className="py-3 px-3 uppercase tracking-wide">
                  Tổng ({filteredRows.length} Nhóm)
                </td>
                <td className="border-r border-slate-300 dark:border-slate-700"></td>

                {/* MTD Totals */}
                <td className="py-3 px-2.5 text-center font-mono-numbers">
                  <span className="text-emerald-700 dark:text-emerald-400">{totals.activeStaff}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold ml-1">(+{totals.newStaff})</span>
                </td>
                <td className="py-3 px-2.5 text-center font-mono-numbers">
                  <span>{totals.existingAgents}</span>
                  <span className="text-[11px] text-blue-600 font-semibold ml-1">(+{totals.newAgents})</span>
                </td>
                <td className="py-3 px-2.5 text-right font-mono-numbers">
                  {formatNumber(totals.appMTD)}
                </td>
                <td className="py-3 px-2.5 text-right font-mono-numbers">
                  {formatNumber(totals.loansMTD)}
                </td>
                <td className="py-3 px-3 text-right font-mono-numbers text-emerald-700 dark:text-emerald-400">
                  {formatCurrencyVND(totals.amountMTD)}
                </td>
                <td className="py-3 px-2.5 text-center font-mono-numbers border-r border-slate-300 dark:border-slate-700 text-emerald-600 font-bold">
                  {formatPercent(totalCompletionRate)}
                </td>

                {/* Daily Totals */}
                <td className="py-3 px-2.5 text-right font-mono-numbers">
                  {formatNumber(totals.todayApp)}
                </td>
                <td className="py-3 px-2.5 text-right font-mono-numbers text-blue-700 dark:text-blue-400">
                  {formatNumber(totals.todayLoans)}
                </td>
                <td className="py-3 px-3 text-right font-mono-numbers text-emerald-700 dark:text-emerald-400">
                  {formatCurrencyVND(totals.todayAmount)}
                </td>
                <td className="py-3 px-2.5 text-center font-mono-numbers">
                  {totals.todayActiveHld} Code
                </td>
                <td className="py-3 px-2.5 text-center font-mono-numbers border-r border-slate-300 dark:border-slate-700">
                  {totals.todayActiveCtv} Code
                </td>

                {/* Warnings summary */}
                <td colSpan={3} className="py-3 px-3 text-center text-xs">
                  {totals.warningCount > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Còn {totals.warningCount} nhóm chưa nộp đủ 2 ca
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% các nhóm đã hoàn thành 2 ca báo cáo
                    </span>
                  )}
                </td>

                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};

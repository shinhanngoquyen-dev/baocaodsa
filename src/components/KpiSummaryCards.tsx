import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Users,
  UserPlus,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Target,
} from 'lucide-react';
import { formatCurrencyShort, formatCurrencyVND, formatNumber, formatPercent } from '../utils/formatters';

export const KpiSummaryCards: React.FC = () => {
  const { summaryKPIs, selectedDate, currentUser } = useApp();

  const isWarningPace = summaryKPIs.completionRate < 80;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Doanh số Lũy kế MTD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Doanh Số Lũy Kế (MTD)
          </span>
          <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-2.5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatCurrencyShort(summaryKPIs.totalVolumeMTD)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mục tiêu: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono-numbers">{formatCurrencyShort(summaryKPIs.totalTargetVolume)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500 dark:text-slate-400">Tiến độ đạt</span>
            <span className={`font-bold font-mono-numbers ${isWarningPace ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatPercent(summaryKPIs.completionRate)}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isWarningPace ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, summaryKPIs.completionRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Doanh số trong ngày (Daily Sales) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Doanh Số Trong Ngày
          </span>
          <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-2.5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatCurrencyShort(summaryKPIs.todayVolume)}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
            <span>
              App: <strong className="font-mono-numbers">{formatNumber(summaryKPIs.todayApp)}</strong>
            </span>
            <span>·</span>
            <span>
              Loans: <strong className="font-mono-numbers text-blue-700 dark:text-blue-400">{formatNumber(summaryKPIs.todayLoans)}</strong>
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Kích hoạt code hôm nay:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
            {summaryKPIs.todayActiveCodeContractStaff} HĐLĐ / {summaryKPIs.todayActiveCodeAgents} CTV
          </span>
        </div>
      </div>

      {/* Card 3: Quy mô Nhân Sự & Tuyển Mới MTD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Mạng Lưới Nhân Sự
          </span>
          <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-3">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
              {formatNumber(summaryKPIs.totalActiveContractStaff)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">HĐLĐ Active</div>
          </div>
          <div className="text-slate-300 dark:text-slate-700 text-lg">/</div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
              {formatNumber(summaryKPIs.totalExistingAgents)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">CTV Hiện Hữu</div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tuyển mới MTD:</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono-numbers">
            +{summaryKPIs.totalNewContractStaffMTD} HĐLĐ / +{summaryKPIs.totalNewAgentsMTD} CTV
          </span>
        </div>
      </div>

      {/* Card 4: Tổng Loans MTD & Tình Trạng Báo Cáo */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Hợp Đồng Giải Ngân MTD
          </span>
          <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <FileCheck2 className="w-4 h-4" />
          </span>
        </div>

        <div className="mt-2.5">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formatNumber(summaryKPIs.totalLoansMTD)} <span className="text-xs font-medium text-slate-500">HĐ</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tổng nộp (App MTD): <span className="font-semibold font-mono-numbers text-slate-700 dark:text-slate-300">{formatNumber(summaryKPIs.totalAppMTD)}</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Ca 1 (Trước 12h):</span>
            <span className={`font-semibold font-mono-numbers ${summaryKPIs.missingShift1Count > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {summaryKPIs.totalTeamleadsCount - summaryKPIs.missingShift1Count}/{summaryKPIs.totalTeamleadsCount} Đã nộp
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Ca 2 (Trước 19h):</span>
            <span className={`font-semibold font-mono-numbers ${summaryKPIs.missingShift2Count > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {summaryKPIs.totalTeamleadsCount - summaryKPIs.missingShift2Count}/{summaryKPIs.totalTeamleadsCount} Đã nộp
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

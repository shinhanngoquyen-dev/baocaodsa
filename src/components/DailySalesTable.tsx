import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Zap,
  Edit2,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatNumber,
  formatDateVN,
} from '../utils/formatters';

interface DailySalesTableProps {
  onOpenReportModalForTeamlead?: (teamleadId: string) => void;
  onOpenActiveCodeModal?: (teamleadId?: string) => void;
}

export const DailySalesTable: React.FC<DailySalesTableProps> = ({
  onOpenReportModalForTeamlead,
  onOpenActiveCodeModal,
}) => {
  const { filteredDailyRows, selectedDate, currentUser } = useApp();

  const totals = useMemo(() => {
    return filteredDailyRows.reduce(
      (acc, r) => ({
        app: acc.app + r.app,
        loans: acc.loans + r.loans,
        amount: acc.amount + r.amount,
        activeCodeHld: acc.activeCodeHld + r.activeCodeContractStaff,
        activeCodeCtv: acc.activeCodeCtv + r.activeCodeAgents,
        newHld: acc.newHld + r.newContractStaffToday,
        newCtv: acc.newCtv + r.newAgentsToday,
        reportedCount: acc.reportedCount + (r.isReported ? 1 : 0),
        warningCount: acc.warningCount + (r.warningStatus !== 'OK' ? 1 : 0),
      }),
      {
        app: 0,
        loans: 0,
        amount: 0,
        activeCodeHld: 0,
        activeCodeCtv: 0,
        newHld: 0,
        newCtv: 0,
        reportedCount: 0,
        warningCount: 0,
      }
    );
  }, [filteredDailyRows]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Bảng Doanh Số Trong Ngày ({formatDateVN(selectedDate)})
            </h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono-numbers px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              {totals.reportedCount}/{filteredDailyRows.length} Nhóm Đã Báo Cáo
            </span>
            {totals.warningCount > 0 && (
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {totals.warningCount} Nhóm Cần Đôn Đốc
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Báo cáo 2 ca: Lần 1 trước 12h00 trưa · Lần 2 trước 19h00 tối. Tự động cảnh báo các nhóm chưa hoàn thành.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'TEAMLEAD' && (
            <button
              onClick={() => onOpenReportModalForTeamlead && onOpenReportModalForTeamlead(filteredDailyRows[0]?.teamleadId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Nộp Báo Cáo Ca Hôm Nay
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-3.5 font-bold text-center w-12">STT</th>
              <th className="py-3 px-3.5 font-bold min-w-[160px]">Teamlead</th>
              <th className="py-3 px-3.5 font-bold min-w-[140px]">Giám Sát Phụ Trách</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">App Ngày</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">Loans Ngày</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap min-w-[140px]">
                Amount (Doanh Số Ngày)
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[130px]">
                Kích Hoạt HĐLĐ
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[130px]">
                Kích Hoạt CTV
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[110px]">
                Ca 1 (Trước 12h)
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[110px]">
                Ca 2 (Trước 19h)
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[160px]">
                Cảnh Báo Báo Cáo
              </th>
              <th className="py-3 px-3.5 font-bold text-center w-20">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {filteredDailyRows.map((row, index) => {
              const hasWarning = row.warningStatus !== 'OK';

              return (
                <tr
                  key={row.teamleadId}
                  className={`transition-colors ${
                    hasWarning
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 dark:hover:bg-amber-950/40'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3.5 text-center text-slate-500 font-mono-numbers">
                    {index + 1}
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {row.teamleadName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {row.teamleadCode}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-slate-800 dark:text-slate-200">
                    {row.supervisorName}
                  </td>

                  {/* App ngày */}
                  <td className="py-3 px-3.5 text-right font-mono-numbers text-slate-800 dark:text-slate-200">
                    {formatNumber(row.app)}
                  </td>

                  {/* Loans ngày */}
                  <td className="py-3 px-3.5 text-right font-mono-numbers font-semibold text-blue-700 dark:text-blue-400">
                    {formatNumber(row.loans)}
                  </td>

                  {/* Amount ngày */}
                  <td className="py-3 px-3.5 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                    {formatCurrencyVND(row.amount)}
                  </td>

                  {/* Số HĐLĐ kích hoạt code (Nhập tay kiểm soát) */}
                  <td className="py-3 px-3.5 text-center font-mono-numbers">
                    {onOpenActiveCodeModal ? (
                      <button
                        onClick={() => onOpenActiveCodeModal(row.teamleadId)}
                        title="Click để nhập tay số Code HĐLĐ kích hoạt (Teamlead & SM kiểm soát)"
                        className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-transparent hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors cursor-pointer"
                      >
                        {row.activeCodeContractStaff > 0 ? (
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            {row.activeCodeContractStaff} Code
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-emerald-600">0</span>
                        )}
                        <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      row.activeCodeContractStaff > 0 ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {row.activeCodeContractStaff} Code
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )
                    )}
                  </td>

                  {/* Số CTV kích hoạt code (Nhập tay kiểm soát) */}
                  <td className="py-3 px-3.5 text-center font-mono-numbers">
                    {onOpenActiveCodeModal ? (
                      <button
                        onClick={() => onOpenActiveCodeModal(row.teamleadId)}
                        title="Click để nhập tay số Code CTV kích hoạt (Teamlead & SM kiểm soát)"
                        className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-transparent hover:border-blue-300 dark:hover:border-blue-800 transition-colors cursor-pointer"
                      >
                        {row.activeCodeAgents > 0 ? (
                          <span className="font-bold text-blue-700 dark:text-blue-400">
                            {row.activeCodeAgents} Code
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-blue-600">0</span>
                        )}
                        <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      row.activeCodeAgents > 0 ? (
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          {row.activeCodeAgents} Code
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )
                    )}
                  </td>

                  {/* Ca 1: Trước 12h */}
                  <td className="py-3 px-3.5 text-center">
                    {row.shift1Reported ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {row.shift1SubmittedAt ? row.shift1SubmittedAt.split(' ')[1] : 'Đã nộp'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Chưa nộp
                      </span>
                    )}
                  </td>

                  {/* Ca 2: Trước 19h */}
                  <td className="py-3 px-3.5 text-center">
                    {row.shift2Reported ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {row.shift2SubmittedAt ? row.shift2SubmittedAt.split(' ')[1] : 'Đã nộp'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Chưa nộp
                      </span>
                    )}
                  </td>

                  {/* Cảnh báo trên bảng doanh số */}
                  <td className="py-3 px-3.5 text-center">
                    {row.warningStatus === 'MISSING_BOTH' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        ⚠️ Thiếu 2 ca (12h & 19h)
                      </span>
                    )}
                    {row.warningStatus === 'MISSING_12H' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        ⚠️ Chưa nộp ca 12h
                      </span>
                    )}
                    {row.warningStatus === 'MISSING_19H' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        ⚠️ Chưa nộp ca 19h
                      </span>
                    )}
                    {row.warningStatus === 'OK' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đủ 2 ca
                      </span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => onOpenReportModalForTeamlead && onOpenReportModalForTeamlead(row.teamleadId)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        hasWarning
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {hasWarning ? 'Báo Cáo' : 'Sửa'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer tổng cộng ngày */}
          <tfoot>
            <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
              <td className="py-3 px-3.5 text-center">Σ</td>
              <td className="py-3 px-3.5 uppercase tracking-wide text-xs">
                Tổng Ngày ({filteredDailyRows.length} Nhóm)
              </td>
              <td></td>
              <td className="py-3 px-3.5 text-right font-mono-numbers">
                {formatNumber(totals.app)}
              </td>
              <td className="py-3 px-3.5 text-right font-mono-numbers text-blue-700 dark:text-blue-400">
                {formatNumber(totals.loans)}
              </td>
              <td className="py-3 px-3.5 text-right font-mono-numbers text-emerald-700 dark:text-emerald-400">
                {formatCurrencyVND(totals.amount)}
              </td>
              <td className="py-3 px-3.5 text-center font-mono-numbers text-emerald-700 dark:text-emerald-400">
                {totals.activeCodeHld} Code
              </td>
              <td className="py-3 px-3.5 text-center font-mono-numbers text-blue-700 dark:text-blue-400">
                {totals.activeCodeCtv} Code
              </td>
              <td colSpan={3} className="py-3 px-3.5 text-center text-xs">
                {totals.warningCount > 0 ? (
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    Còn {totals.warningCount} nhóm chưa hoàn thành 2 ca
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold">
                    100% các nhóm đã hoàn thành 2 ca
                  </span>
                )}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

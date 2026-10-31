import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  PlusCircle,
  Edit3,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatNumber,
  formatDateVN,
} from '../utils/formatters';

interface DailySalesTableProps {
  onOpenReportModalForTeamlead?: (teamleadId: string) => void;
}

export const DailySalesTable: React.FC<DailySalesTableProps> = ({
  onOpenReportModalForTeamlead,
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
      }
    );
  }, [filteredDailyRows]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Doanh Số Trong Ngày ({formatDateVN(selectedDate)})
            </h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono-numbers px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              {totals.reportedCount}/{filteredDailyRows.length} Nhóm Đã Báo Cáo
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chi tiết các chỉ số: App, Loans, Amount, Kích hoạt code HĐLĐ và CTV trong ngày
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'TEAMLEAD' && (
            <button
              onClick={() => onOpenReportModalForTeamlead && onOpenReportModalForTeamlead(filteredDailyRows[0]?.teamleadId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Nộp / Cập Nhật Báo Cáo Ngày
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
              <th className="py-3 px-3.5 font-bold min-w-[170px]">Teamlead</th>
              <th className="py-3 px-3.5 font-bold min-w-[150px]">Giám Sát Phụ Trách</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">App Ngày</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap">Loans Ngày</th>
              <th className="py-3 px-3.5 font-bold text-right whitespace-nowrap min-w-[140px]">
                Amount (Doanh Số Ngày)
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[150px]">
                HĐLĐ Kích Hoạt Code
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[150px]">
                CTV Kích Hoạt Code
              </th>
              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[130px]">
                Trạng Thái Báo Cáo
              </th>
              <th className="py-3 px-3.5 font-bold text-center w-20">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {filteredDailyRows.map((row, index) => {
              return (
                <tr
                  key={row.teamleadId}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
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
                  <td className="py-3 px-3.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                    {formatNumber(row.loans)}
                  </td>

                  {/* Amount ngày */}
                  <td className="py-3 px-3.5 text-right font-mono-numbers font-bold text-slate-900 dark:text-white">
                    {formatCurrencyVND(row.amount)}
                  </td>

                  {/* Số HĐLĐ kích hoạt code */}
                  <td className="py-3 px-3.5 text-center font-mono-numbers">
                    {row.activeCodeContractStaff > 0 ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {row.activeCodeContractStaff} Code
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  {/* Số CTV kích hoạt code */}
                  <td className="py-3 px-3.5 text-center font-mono-numbers">
                    {row.activeCodeAgents > 0 ? (
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {row.activeCodeAgents} Code
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  {/* Trạng thái báo cáo */}
                  <td className="py-3 px-3.5 text-center">
                    {row.isReported ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã chốt
                        {row.submittedAt && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {row.submittedAt.split(' ')[1]}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Chưa báo cáo
                      </span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => onOpenReportModalForTeamlead && onOpenReportModalForTeamlead(row.teamleadId)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        row.isReported
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {row.isReported ? 'Sửa' : 'Nhập'}
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
              <td className="py-3 px-3.5 text-right font-mono-numbers">
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
              <td className="py-3 px-3.5 text-center text-xs">
                {totals.reportedCount} Hoàn thành
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

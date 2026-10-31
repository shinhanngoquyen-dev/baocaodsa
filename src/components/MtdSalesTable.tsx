import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  TrendingUp,
  Settings,
  HelpCircle,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatCurrencyShort,
  formatNumber,
  formatPercent,
} from '../utils/formatters';
import { MtdSalesRow } from '../types';

interface MtdSalesTableProps {
  onOpenAdminModalForTeamlead?: (teamleadId: string) => void;
}

type SortField = 'stt' | 'teamleadName' | 'supervisorName' | 'activeContractStaff' | 'totalAppMTD' | 'totalLoansMTD' | 'totalAmountMTD' | 'completionRate';

export const MtdSalesTable: React.FC<MtdSalesTableProps> = ({ onOpenAdminModalForTeamlead }) => {
  const {
    filteredMtdRows,
    currentUser,
    supervisors,
    selectedSupervisorFilter,
    setSelectedSupervisorFilter,
    searchTerm,
    setSearchTerm,
    exportToCsv,
    selectedDate,
  } = useApp();

  const [sortField, setSortField] = useState<SortField>('totalAmountMTD');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedRows = useMemo(() => {
    const list = [...filteredMtdRows];
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
  }, [filteredMtdRows, sortField, sortDirection]);

  // Aggregate totals
  const totals = useMemo(() => {
    return filteredMtdRows.reduce(
      (acc, r) => ({
        activeStaff: acc.activeStaff + r.activeContractStaff,
        existingAgents: acc.existingAgents + r.existingAgents,
        newStaff: acc.newStaff + r.newContractStaffMTD,
        newAgents: acc.newAgents + r.newAgentsMTD,
        app: acc.app + r.totalAppMTD,
        loans: acc.loans + r.totalLoansMTD,
        amount: acc.amount + r.totalAmountMTD,
        target: acc.target + r.targetVolume,
      }),
      {
        activeStaff: 0,
        existingAgents: 0,
        newStaff: 0,
        newAgents: 0,
        app: 0,
        loans: 0,
        amount: 0,
        target: 0,
      }
    );
  }, [filteredMtdRows]);

  const totalCompletionRate = totals.target > 0 ? (totals.amount / totals.target) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Bảng Doanh Số Lũy Kế (MTD)
            </h2>
            <span className="text-xs text-slate-500 font-mono-numbers bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded">
              {filteredMtdRows.length} Nhóm
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Doanh số tự động cộng dồn từ ngày 01 đến ngày {selectedDate.split('-')[2]}/{selectedDate.split('-')[1]}/{selectedDate.split('-')[0]}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'DIRECTOR' && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-xs">
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
              placeholder="Tìm Teamlead, Giám sát..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden w-48 sm:w-56"
            />
          </div>

          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 select-none">
              <th
                onClick={() => handleSort('stt')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-center w-12 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  STT
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('teamleadName')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap min-w-[170px]"
              >
                <div className="flex items-center gap-1">
                  Teamlead
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('supervisorName')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap min-w-[150px]"
              >
                <div className="flex items-center gap-1">
                  Giám Sát Phụ Trách
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('activeContractStaff')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-center whitespace-nowrap min-w-[140px]"
              >
                <div className="flex items-center justify-center gap-1">
                  HĐLĐ Active, CTV Hiện Hữu
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold text-center whitespace-nowrap min-w-[150px]">
                Tuyển Mới Trong Tháng
                <div className="text-[10px] font-normal text-slate-500">HĐLĐ / CTV</div>
              </th>

              <th
                onClick={() => handleSort('totalAppMTD')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  App (MTD)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('totalLoansMTD')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  Loans (MTD)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('totalAmountMTD')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-right whitespace-nowrap min-w-[140px]"
              >
                <div className="flex items-center justify-end gap-1">
                  Amount (Doanh Số)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('completionRate')}
                className="py-3 px-3.5 font-bold cursor-pointer hover:text-slate-900 text-center whitespace-nowrap min-w-[140px]"
              >
                <div className="flex items-center justify-center gap-1">
                  Tiến Độ Mục Tiêu
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {(currentUser.role === 'DIRECTOR' || currentUser.role === 'SUPERVISOR') && (
                <th className="py-3 px-3 font-bold text-center w-14">
                  Sửa
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 text-xs">
                  Không có dữ liệu phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => {
                const isOver100 = row.completionRate >= 100;
                const isPaceLow = row.completionRate < 80;

                return (
                  <tr
                    key={row.teamleadId}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. STT */}
                    <td className="py-3 px-3.5 text-center text-slate-500 font-mono-numbers">
                      {index + 1}
                    </td>

                    {/* 2. Teamlead */}
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {row.teamleadName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {row.teamleadCode} · {row.region}
                      </div>
                    </td>

                    {/* 3. Thuộc Giám sát nào */}
                    <td className="py-3 px-3.5">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {row.supervisorName}
                      </span>
                    </td>

                    {/* 4. HĐLĐ active, CTV hiện hữu */}
                    <td className="py-3 px-3.5 text-center font-mono-numbers">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {row.activeContractStaff}
                      </span>
                      <span className="text-slate-400 mx-1">HĐLĐ /</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {row.existingAgents}
                      </span>
                      <span className="text-slate-400 ml-1">CTV</span>
                    </td>

                    {/* 5. Số HĐLĐ, CTV tuyển mới trong tháng */}
                    <td className="py-3 px-3.5 text-center font-mono-numbers">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        +{row.newContractStaffMTD}
                      </span>
                      <span className="text-slate-400 mx-1">HĐLĐ /</span>
                      <span className="text-blue-700 dark:text-blue-400 font-semibold">
                        +{row.newAgentsMTD}
                      </span>
                      <span className="text-slate-400 ml-1">CTV</span>
                    </td>

                    {/* 6. App (Tổng MTD) */}
                    <td className="py-3 px-3.5 text-right font-mono-numbers text-slate-800 dark:text-slate-200">
                      {formatNumber(row.totalAppMTD)}
                    </td>

                    {/* 7. Loans (Tổng MTD) */}
                    <td className="py-3 px-3.5 text-right font-mono-numbers font-semibold text-slate-900 dark:text-white">
                      {formatNumber(row.totalLoansMTD)}
                    </td>

                    {/* 8. Amount (Doanh số MTD VNĐ) */}
                    <td className="py-3 px-3.5 text-right font-mono-numbers">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatCurrencyVND(row.totalAmountMTD)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        MT: {formatCurrencyShort(row.targetVolume)}
                      </div>
                    </td>

                    {/* Completion rate progress */}
                    <td className="py-3 px-3.5">
                      <div className="w-28 mx-auto">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-mono-numbers">
                          <span className={`font-bold ${isOver100 ? 'text-emerald-600' : isPaceLow ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>
                            {formatPercent(row.completionRate)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOver100 ? 'bg-emerald-600' : isPaceLow ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, row.completionRate)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Admin Action button */}
                    {(currentUser.role === 'DIRECTOR' || currentUser.role === 'SUPERVISOR') && (
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onOpenAdminModalForTeamlead && onOpenAdminModalForTeamlead(row.teamleadId)}
                          title="Điều chỉnh mục tiêu & số code HĐLĐ active"
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Tổng Cộng Toàn Bộ */}
          {sortedRows.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                <td className="py-3 px-3.5 text-center">Σ</td>
                <td className="py-3 px-3.5 uppercase tracking-wide text-xs">
                  Tổng Cộng ({filteredMtdRows.length} Nhóm)
                </td>
                <td className="py-3 px-3.5 text-slate-500 text-xs font-normal">
                  {currentUser.role === 'DIRECTOR' ? '5 Giám Sát' : 'Nhánh phụ trách'}
                </td>
                <td className="py-3 px-3.5 text-center font-mono-numbers">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    {formatNumber(totals.activeStaff)}
                  </span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="font-bold">
                    {formatNumber(totals.existingAgents)}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-center font-mono-numbers">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    +{formatNumber(totals.newStaff)}
                  </span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-blue-700 dark:text-blue-400 font-bold">
                    +{formatNumber(totals.newAgents)}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-right font-mono-numbers">
                  {formatNumber(totals.app)}
                </td>
                <td className="py-3 px-3.5 text-right font-mono-numbers">
                  {formatNumber(totals.loans)}
                </td>
                <td className="py-3 px-3.5 text-right font-mono-numbers text-emerald-700 dark:text-emerald-400">
                  {formatCurrencyVND(totals.amount)}
                </td>
                <td className="py-3 px-3.5 text-center font-mono-numbers">
                  <span className="text-xs font-bold text-emerald-600">
                    {formatPercent(totalCompletionRate)}
                  </span>
                </td>
                {(currentUser.role === 'DIRECTOR' || currentUser.role === 'SUPERVISOR') && (
                  <td></td>
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  Upload,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  FileSpreadsheet,
  FileJson,
  CheckCircle,
  AlertTriangle,
  History,
  HardDriveDownload,
  TrendingUp,
} from 'lucide-react';
import { formatCurrencyVND } from '../utils/formatters';

interface MonthEndDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMom?: () => void;
}

export const MonthEndDataModal: React.FC<MonthEndDataModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMom,
}) => {
  const {
    currentUser,
    summaryKPIs,
    reports,
    lastMonthResetInfo,
    exportCurrentMonthDataBackup,
    resetMonthSales,
    exportToCsv,
    previousMonthData,
    importPreviousMonthData,
    reloadDefaultPreviousMonthData,
  } = useApp();

  const [confirmText, setConfirmText] = useState('');
  const [activeTab, setActiveTab] = useState<'BACKUP_RESET' | 'IMPORT_PREV'>('BACKUP_RESET');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Xử lý nút 1-Click: Tải Sao Lưu & Reset Ngay
  const handleBackupAndReset = () => {
    if (currentUser.role !== 'DIRECTOR') return;
    const res = resetMonthSales(true);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setConfirmText('');
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Xử lý Reset thủ công sau khi gõ xác nhận RESET
  const handleManualReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role !== 'DIRECTOR') return;
    if (confirmText.trim().toUpperCase() !== 'RESET') {
      setFeedbackMessage({ type: 'error', text: 'Vui lòng nhập chính xác chữ "RESET" để xác nhận thao tác!' });
      return;
    }
    const res = resetMonthSales(false);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setConfirmText('');
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Xử lý đọc file JSON import tháng trước
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        
        // Hỗ trợ cả 2 định dạng: File backup tháng của hệ thống hoặc File dataset chuẩn
        let datasetToImport = null;
        if (raw.records && Array.isArray(raw.records)) {
          datasetToImport = raw;
        } else if (raw.teamleadsSummary && Array.isArray(raw.teamleadsSummary)) {
          datasetToImport = {
            monthLabel: raw.monthLabel || 'Tháng trước',
            importedAt: new Date().toISOString(),
            importedBy: currentUser.name,
            records: raw.teamleadsSummary.map((t: any) => ({
              teamleadId: t.teamleadId,
              teamleadName: t.teamleadName,
              teamleadCode: t.teamleadCode,
              supervisorName: t.supervisorName,
              amount: t.totalAmountMTD || 0,
              loans: t.totalLoansMTD || 0,
              app: t.totalAppMTD || 0,
              newContractStaff: t.newContractStaffMTD || 0,
              newAgents: t.newAgentsMTD || 0,
            })),
          };
        }

        if (datasetToImport) {
          const res = importPreviousMonthData(datasetToImport);
          setFeedbackMessage({ type: res.success ? 'success' : 'error', text: res.message });
        } else {
          setFeedbackMessage({
            type: 'error',
            text: 'Cấu trúc file không đúng định dạng sao lưu của Sale North 1. Vui lòng kiểm tra lại!',
          });
        }
      } catch (err) {
        setFeedbackMessage({
          type: 'error',
          text: 'Không thể đọc file JSON. Vui lòng kiểm tra file có hợp lệ hay không!',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-200 border border-white/20">
              <HardDriveDownload className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60">
                Quyền Hạn SM (Admin)
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Chốt Dữ Liệu Cuối Tháng & So Sánh Tăng Trưởng
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('BACKUP_RESET');
              setFeedbackMessage(null);
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'BACKUP_RESET'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            Tải Dữ Liệu & Reset Cuối Tháng
          </button>

          <button
            onClick={() => {
              setActiveTab('IMPORT_PREV');
              setFeedbackMessage(null);
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'IMPORT_PREV'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Nhập Dữ Liệu Tháng Trước (MoM)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 grow">
          
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* TAB 1: TẢI DỮ LIỆU & RESET THỦ CÔNG */}
          {activeTab === 'BACKUP_RESET' && (
            <div className="space-y-5">
              
              {/* Tóm tắt tình trạng tháng hiện tại */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Dữ liệu hiện tại (Tháng 10/2026)
                  </span>
                  <span className="font-mono">{reports.length} bản ghi báo cáo ca</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Doanh Số MTD</span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono-numbers mt-0.5">
                      {formatCurrencyVND(summaryKPIs.totalVolumeMTD)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">HĐ Loans MTD</span>
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numbers mt-0.5">
                      {summaryKPIs.totalLoansMTD} HĐ
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Hồ Sơ App MTD</span>
                    <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers mt-0.5">
                      {summaryKPIs.totalAppMTD} App
                    </div>
                  </div>
                </div>
              </div>

              {/* BƯỚC 1: TẢI DỮ LIỆU VỀ MÁY */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Tải Dữ Liệu Tháng Này Về Máy (Sao Lưu An Toàn)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tải toàn bộ số liệu MTD và chi tiết báo cáo ca của 11 Teamlead về máy tính để lưu trữ vĩnh viễn hoặc dùng import vào tháng sau:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={exportCurrentMonthDataBackup}
                    className="p-3 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 dark:border-emerald-800 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileJson className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 group-hover:underline">
                        Tải Bản Sao Lưu (.JSON)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Chuẩn cấu trúc, có thể dùng import so sánh MoM
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={exportToCsv}
                    className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:underline">
                        Xuất File Excel (.CSV)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Mở xem trực tiếp bằng Microsoft Excel / Google Sheets
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* BƯỚC 2: RESET THỦ CÔNG VỀ 0 */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Reset Dữ Liệu Về 0 Để Mở Chu Kỳ Mới (Thủ Công)
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Chế độ thủ công an toàn:</strong> Hệ thống không bao giờ tự động xóa số liệu khi hết tháng nếu bạn chưa thao tác. Khi ngày cuối tháng bạn bận, số liệu vẫn được bảo toàn nguyên vẹn cho tới khi bạn vào chốt.
                  </div>
                </div>

                {/* NÚT KHUYẾN NGHỊ: 1-CLICK TẢI SAO LƯU & RESET */}
                <div className="p-4 rounded-xl bg-linear-to-r from-emerald-900 to-teal-950 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                      ★ Khuyến nghị an toàn nhất (1-Click)
                    </span>
                    <span className="text-[11px] text-emerald-200">Không lo mất số</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Hệ thống sẽ <strong>tự động tải file sao lưu đầy đủ về máy tính trước</strong>, sau đó mới tiến hành reset doanh số các team về 0 để đón chu kỳ mới.
                  </p>
                  <button
                    onClick={handleBackupAndReset}
                    className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <HardDriveDownload className="w-4 h-4" />
                    <span>Tải Sao Lưu Về Máy & Reset Doanh Số Về 0 Ngay</span>
                  </button>
                </div>

                {/* XÁC NHẬN RESET THỦ CÔNG NẾU ĐÃ CÓ BẢN SAO LƯU */}
                <form onSubmit={handleManualReset} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    Hoặc chỉ Reset về 0 (nếu bạn đã tải file sao lưu ở Bước 1):
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder='Nhập chữ "RESET" để xác nhận...'
                      className="grow px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      disabled={confirmText.trim().toUpperCase() !== 'RESET'}
                      className="py-2 px-3.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Xác Nhận Reset
                    </button>
                  </div>
                </form>

                {/* Lịch sử reset gần nhất */}
                {lastMonthResetInfo && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Lần reset gần nhất: <strong>{lastMonthResetInfo.resetAt}</strong> bởi <strong>{lastMonthResetInfo.resetBy}</strong> ({lastMonthResetInfo.backupDownloaded ? 'Đã tải bản sao lưu' : 'Reset trực tiếp'})
                    </span>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: IMPORT DỮ LIỆU THÁNG TRƯỚC (MoM) */}
          {activeTab === 'IMPORT_PREV' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    Bộ Dữ Liệu Tháng Trước Đang Lưu Trữ
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold px-2 py-0.5 rounded">
                    {previousMonthData.monthLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Dữ liệu này được dùng làm thước đo chuẩn so sánh tăng trưởng MoM (Month over Month) với tháng này của 11 Teamlead.
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-200/60 dark:border-indigo-800/60">
                  <span>Số Teamlead trong tệp: <strong>{previousMonthData.records.length} Teamlead</strong></span>
                  <span>Cập nhật: {previousMonthData.importedAt}</span>
                </div>
              </div>

              {/* Nạp file JSON sao lưu tháng trước */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors text-center space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Chọn tệp sao lưu JSON của tháng trước để nạp
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Chấp nhận file JSON xuất ra từ tính năng "Tải bản sao lưu" cuối tháng
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="import-month-file-input"
                />
                <label
                  htmlFor="import-month-file-input"
                  className="inline-flex items-center gap-1.5 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs mt-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn Tệp JSON Từ Máy Tính</span>
                </label>
              </div>

              {/* Nạp lại dữ liệu mẫu Tháng 09/2026 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">
                    Nạp lại bộ số liệu mẫu Tháng 09/2026
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Khôi phục bộ số liệu chuẩn gồm 11 Teamlead để kiểm tra tính năng so sánh ngay
                  </div>
                </div>
                <button
                  onClick={() => {
                    reloadDefaultPreviousMonthData();
                    setFeedbackMessage({
                      type: 'success',
                      text: 'Đã nạp lại bộ dữ liệu chuẩn Tháng 09/2026 thành công!',
                    });
                  }}
                  className="py-1.5 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Nạp Dữ Liệu Mẫu
                </button>
              </div>

              {/* Nút xem bảng so sánh tăng trưởng */}
              {onNavigateToMom && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToMom();
                  }}
                  className="w-full py-2.5 px-4 bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Mở Bảng So Sánh Tăng Trưởng Cùng Kỳ (MoM Growth)</span>
                </button>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Hệ thống Sale North 1 · Thao tác thủ công bảo vệ toàn vẹn dữ liệu
          </div>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

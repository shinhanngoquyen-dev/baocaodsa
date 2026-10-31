import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Settings,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Flame,
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
  onNavigateToHierarchy,
}) => {
  const {
    currentUser,
    supervisors,
    teamleads,
    allMtdRows,
    allDailyRows,
    selectedDate,
    switchUser,
  } = useApp();

  // 1. DÀNH CHO CẤP 1: TÔI (SM - SALES MANAGER)
  const renderDirectorDashboard = () => {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Giao Diện SM - Sales Manager (Tôi)</span>
              <span className="text-[11px] text-emerald-400 font-medium">· Toàn Vùng Sale North 1 ({supervisors.length} Giám Sát · {teamleads.length} Teamlead)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bảng theo dõi hợp nhất: Doanh số MTD, Doanh số ngày, và Cảnh báo 2 ca báo cáo (trước 12h & 19h)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdminModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            Mục Tiêu Tháng
          </button>
          <button
            onClick={onNavigateToHierarchy}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            Sơ Đồ Phân Cấp
          </button>
        </div>
      </div>
    );
  };

  // 2. DÀNH CHO CẤP 2: GIÁM SÁT BÁN HÀNG (SUPERVISOR)
  const renderSupervisorDashboard = () => {
    const currentSup = supervisors.find((s) => s.userId === currentUser.id) || supervisors[0];
    const branchTeamleads = teamleads.filter((t) => t.supervisorId === currentSup.id);

    return (
      <div className="bg-linear-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-4 border border-blue-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Giám Sát: {currentSup.name} ({currentSup.code})</span>
              <span className="text-[11px] text-blue-300 font-medium">· {currentSup.region}</span>
            </div>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Quản lý trực tiếp {branchTeamleads.length} Teamlead. Bạn có quyền điều chỉnh mục tiêu và số code HĐLĐ active cho nhánh của mình.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdminModal}
            className="px-3 py-1.5 bg-white text-blue-900 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-blue-700" />
            Mục Tiêu Nhánh
          </button>
        </div>
      </div>
    );
  };

  // 3. DÀNH CHO CẤP 3: TEAMLEAD (TRƯỞNG NHÓM BÁN HÀNG)
  const renderTeamleadDashboard = () => {
    const currentTl = teamleads.find((t) => t.userId === currentUser.id) || teamleads[0];
    const myDaily = allDailyRows.find((r) => r.teamleadId === currentTl.id);

    return (
      <div className="space-y-2">
        <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-4 border border-emerald-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Teamleader: {currentTl.name} ({currentTl.code})</span>
                <span className="text-[11px] text-emerald-300 font-medium">· Giám Sát: {currentTl.supervisorName}</span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                Quy định báo cáo 2 ca: Ca 1 trước 12h00 trưa · Ca 2 trước 19h00 tối.
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-white text-emerald-900 text-xs font-extrabold rounded-lg hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              {myDaily?.isReported ? 'Cập Nhật Báo Cáo Ngày' : 'Nhập Báo Cáo Ca Hôm Nay'}
            </button>
          </div>
        </div>

        {/* Khẩu hiệu từ SM */}
        <div className="bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 rounded-lg px-3.5 py-2 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Flame className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold">Khẩu hiệu từ SM:</span>
          <span className="italic font-semibold">“Nếu 1 buổi trôi qua tất cả mọi thứ đều là 0 thì điều đó thật tệ!”</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {currentUser.role === 'DIRECTOR' && renderDirectorDashboard()}
      {currentUser.role === 'SUPERVISOR' && renderSupervisorDashboard()}
      {currentUser.role === 'TEAMLEAD' && renderTeamleadDashboard()}
    </div>
  );
};

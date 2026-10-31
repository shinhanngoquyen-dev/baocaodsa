import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Calendar,
  Download,
  Users,
  BarChart3,
  GitBranch,
  FileSpreadsheet,
  PlusCircle,
  Settings,
  RefreshCw,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatDateVN } from '../utils/formatters';

interface NavbarProps {
  onOpenReportModal: () => void;
  onOpenAdminModal: () => void;
  onOpenUserSwitcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReportModal,
  onOpenAdminModal,
  onOpenUserSwitcher,
}) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    selectedDate,
    setSelectedDate,
    exportToCsv,
    resetToDefaultData,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'DIRECTOR':
        return {
          title: 'Giám Đốc Khối (Tôi)',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" />,
        };
      case 'SUPERVISOR':
        return {
          title: 'Giám Sát Bán Hàng',
          bg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
          icon: <Building2 className="w-3.5 h-3.5 mr-1" />,
        };
      case 'TEAMLEAD':
        return {
          title: 'Teamleader',
          bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          icon: <UserCheck className="w-3.5 h-3.5 mr-1" />,
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wide">
              SFH
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap block">
                Sales Finance Hub
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block whitespace-nowrap -mt-0.5">
                Báo Cáo Doanh Số 3 Cấp
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Tổng Quan
            </button>

            <button
              onClick={() => setActiveView('mtd_table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'mtd_table'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Bảng Lũy Kế MTD
            </button>

            <button
              onClick={() => setActiveView('daily_table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'daily_table'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Doanh Số Ngày
            </button>

            <button
              onClick={() => setActiveView('hierarchy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'hierarchy'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Sơ Đồ Phân Cấp
            </button>

            {(currentUser.role === 'DIRECTOR' || currentUser.role === 'SUPERVISOR') && (
              <button
                onClick={() => setActiveView('admin_targets')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeView === 'admin_targets'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Quản Trị Mục Tiêu
              </button>
            )}
          </nav>

          {/* Zone 3: Date picker, CTA, User Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick date selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
                title="Chọn ngày báo cáo"
              />
            </div>

            {/* Quick action: Submit report for Teamlead */}
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nhập Báo Cáo</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={exportToCsv}
              title="Xuất file Excel/CSV"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* User Profile & Switcher Button */}
            <button
              onClick={onOpenUserSwitcher}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-none max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {badge.title}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeView === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Tổng Quan
          </button>
          <button
            onClick={() => setActiveView('mtd_table')}
            className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeView === 'mtd_table' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Bảng MTD
          </button>
          <button
            onClick={() => setActiveView('daily_table')}
            className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeView === 'daily_table' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Doanh Số Ngày
          </button>
          <button
            onClick={() => setActiveView('hierarchy')}
            className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeView === 'hierarchy' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sơ Đồ Phân Cấp
          </button>
          {(currentUser.role === 'DIRECTOR' || currentUser.role === 'SUPERVISOR') && (
            <button
              onClick={() => setActiveView('admin_targets')}
              className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
                activeView === 'admin_targets' ? 'bg-slate-900 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Mục Tiêu
            </button>
          )}
          <button
            onClick={onOpenReportModal}
            className="px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap ml-auto"
          >
            + Nhập Báo Cáo
          </button>
        </div>

      </div>
    </header>
  );
};

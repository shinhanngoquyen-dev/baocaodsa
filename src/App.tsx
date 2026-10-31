import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { UnifiedDashboardTable } from './components/UnifiedDashboardTable';
import { DailyHonorBoard } from './components/DailyHonorBoard';
import { MtdSalesTable } from './components/MtdSalesTable';
import { DailySalesTable } from './components/DailySalesTable';
import { OrgHierarchyChart } from './components/OrgHierarchyChart';
import { RoleDashboardView } from './components/RoleDashboardView';
import { AdminTargetView } from './components/AdminTargetView';
import { DailyReportModal } from './components/DailyReportModal';
import { AdminTargetModal } from './components/AdminTargetModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { UserManagementModal } from './components/UserManagementModal';
import { TeamleadProfileModal } from './components/TeamleadProfileModal';

function DashboardContent() {
  const { activeView, setActiveView, currentUser } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isTeamleadProfileOpen, setIsTeamleadProfileOpen] = useState(false);

  const [targetTeamleadForReport, setTargetTeamleadForReport] = useState<string | undefined>(undefined);
  const [targetTeamleadForAdmin, setTargetTeamleadForAdmin] = useState<string | undefined>(undefined);

  const handleOpenReportModal = (teamleadId?: string) => {
    setTargetTeamleadForReport(teamleadId);
    setIsReportModalOpen(true);
  };

  const handleOpenAdminModal = (teamleadId?: string) => {
    setTargetTeamleadForAdmin(teamleadId);
    setIsAdminModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Top Bar Contract Header */}
      <Navbar
        onOpenReportModal={() => handleOpenReportModal()}
        onOpenAdminModal={() => handleOpenAdminModal()}
        onOpenUserSwitcher={() => setIsUserSwitcherOpen(true)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        onOpenTeamleadProfile={() => setIsTeamleadProfileOpen(true)}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        
        {/* KPI Strip */}
        <KpiSummaryCards />

        {/* View Switcher Content */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <RoleDashboardView
              onOpenReportModal={() => handleOpenReportModal()}
              onOpenAdminModal={() => handleOpenAdminModal()}
              onNavigateToMtd={() => setActiveView('mtd_table')}
              onNavigateToDaily={() => setActiveView('daily_table')}
              onNavigateToHierarchy={() => setActiveView('hierarchy')}
            />

            {/* BẢNG TỔNG HỢP DOANH SỐ DASHBOARD: TEAMLEAD, MTD SALES, DAILY SALES, 2 CA & CẢNH BÁO */}
            <UnifiedDashboardTable
              onOpenReportModalForTeamlead={(tlId) => handleOpenReportModal(tlId)}
              onOpenAdminModalForTeamlead={(tlId) => handleOpenAdminModal(tlId)}
            />

            {/* VINH DANH CÁC TEAMLEAD BÁN TỐT TRONG NGÀY (NẰM DƯỚI BẢNG DOANH SỐ) */}
            <DailyHonorBoard />
          </div>
        )}

        {activeView === 'mtd_table' && (
          <div className="space-y-6">
            <MtdSalesTable
              onOpenAdminModalForTeamlead={(tlId) => handleOpenAdminModal(tlId)}
            />
          </div>
        )}

        {activeView === 'daily_table' && (
          <div className="space-y-6">
            <DailySalesTable
              onOpenReportModalForTeamlead={(tlId) => handleOpenReportModal(tlId)}
            />
            
            {/* Honor board also in daily table view */}
            <DailyHonorBoard />
          </div>
        )}

        {activeView === 'hierarchy' && (
          <div className="space-y-6">
            <OrgHierarchyChart
              onSelectTeamleadReport={(tlId) => handleOpenReportModal(tlId)}
            />
          </div>
        )}

        {activeView === 'admin_targets' && (
          <div className="space-y-6">
            <AdminTargetView
              onOpenTargetModalForTeamlead={(tlId) => handleOpenAdminModal(tlId)}
            />
          </div>
        )}

      </main>

      {/* Footnote */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Sale North 1 Report · Hệ thống quản lý và báo cáo kinh doanh 3 cấp (Vĩnh Phúc, Thái Nguyên, Hà Nội 1)
          </div>
          <div className="flex items-center gap-2">
            <span>Đang đăng nhập: <strong>{currentUser.name}</strong></span>
            <span>·</span>
            <button
              onClick={() => setIsUserSwitcherOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Đổi vai trò
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DailyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialTeamleadId={targetTeamleadForReport}
      />

      <AdminTargetModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        initialTeamleadId={targetTeamleadForAdmin}
      />

      <UserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        onOpenTeamleadProfile={() => setIsTeamleadProfileOpen(true)}
      />

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />

      <TeamleadProfileModal
        isOpen={isTeamleadProfileOpen}
        onClose={() => setIsTeamleadProfileOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

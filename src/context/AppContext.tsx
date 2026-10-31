import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  SupervisorInfo,
  TeamleadInfo,
  DailyReport,
  AdminSettings,
  MtdSalesRow,
  DailySalesRow,
  SummaryKPIs,
} from '../types';
import {
  INITIAL_SUPERVISORS,
  INITIAL_TEAMLEADS,
  INITIAL_USERS,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_REPORTS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  supervisors: SupervisorInfo[];
  teamleads: TeamleadInfo[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSupervisorFilter: string;
  setSelectedSupervisorFilter: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeView: 'dashboard' | 'mtd_table' | 'daily_table' | 'hierarchy' | 'admin_targets' | 'submit_report';
  setActiveView: (view: 'dashboard' | 'mtd_table' | 'daily_table' | 'hierarchy' | 'admin_targets' | 'submit_report') => void;
  
  reports: DailyReport[];
  adminSettings: AdminSettings[];

  // Data actions
  submitDailyReport: (report: Omit<DailyReport, 'id' | 'submittedAt' | 'submittedBy'>) => void;
  updateAdminSettings: (teamleadId: string, updates: Partial<AdminSettings>) => void;
  batchUpdateAdminSettings: (updates: { teamleadId: string; updates: Partial<AdminSettings> }[]) => void;
  switchUser: (userId: string) => void;
  resetToDefaultData: () => void;
  exportToCsv: () => void;
  
  // Computed data
  allMtdRows: MtdSalesRow[];
  allDailyRows: DailySalesRow[];
  filteredMtdRows: MtdSalesRow[];
  filteredDailyRows: DailySalesRow[];
  summaryKPIs: SummaryKPIs;
  getReportForTeamleadDate: (teamleadId: string, date: string) => DailyReport | undefined;
  getAdminSettingForTeamlead: (teamleadId: string) => AdminSettings | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sales_hub_current_user_id_v1',
  REPORTS: 'sales_hub_reports_v1',
  ADMIN_SETTINGS: 'sales_hub_admin_settings_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Users and static hierarchy
  const users = INITIAL_USERS;
  const supervisors = INITIAL_SUPERVISORS;
  const teamleads = INITIAL_TEAMLEADS;

  // Selected date: default to 2026-10-30
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [selectedSupervisorFilter, setSelectedSupervisorFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeView, setActiveView] = useState<'dashboard' | 'mtd_table' | 'daily_table' | 'hierarchy' | 'admin_targets' | 'submit_report'>('dashboard');

  // Stored state: Reports
  const [reports, setReports] = useState<DailyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved reports from localStorage', e);
    }
    return INITIAL_REPORTS;
  });

  // Stored state: Admin settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin settings from localStorage', e);
    }
    return INITIAL_ADMIN_SETTINGS;
  });

  // Current logged in user
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (saved && users.some((u) => u.id === saved)) return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'user_director'; // Default: "Tôi" (Giám đốc kinh doanh)
  });

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(adminSettings));
    } catch (e) {
      console.error(e);
    }
  }, [adminSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  const switchUser = (userId: string) => {
    if (users.some((u) => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  const resetToDefaultData = () => {
    setReports(INITIAL_REPORTS);
    setAdminSettings(INITIAL_ADMIN_SETTINGS);
    setCurrentUserId('user_director');
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  };

  // Helper to get admin settings
  const getAdminSettingForTeamlead = (teamleadId: string): AdminSettings | undefined => {
    return adminSettings.find((s) => s.teamleadId === teamleadId);
  };

  // Helper to get daily report
  const getReportForTeamleadDate = (teamleadId: string, date: string): DailyReport | undefined => {
    return reports.find((r) => r.teamleadId === teamleadId && r.date === date);
  };

  // Submit or update daily report
  const submitDailyReport = (newReport: Omit<DailyReport, 'id' | 'submittedAt' | 'submittedBy'>) => {
    const existingIndex = reports.findIndex(
      (r) => r.teamleadId === newReport.teamleadId && r.date === newReport.date
    );

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const tl = teamleads.find((t) => t.id === newReport.teamleadId);
    const submitterName = currentUser.name || tl?.name || 'Teamlead';

    if (existingIndex >= 0) {
      const updatedReports = [...reports];
      updatedReports[existingIndex] = {
        ...updatedReports[existingIndex],
        ...newReport,
        submittedAt: nowStr,
        submittedBy: submitterName,
      };
      setReports(updatedReports);
    } else {
      const createdReport: DailyReport = {
        ...newReport,
        id: `rep_${newReport.teamleadId}_${newReport.date}_${Date.now()}`,
        submittedAt: nowStr,
        submittedBy: submitterName,
      };
      setReports((prev) => [createdReport, ...prev]);
    }
  };

  // Update admin settings for a teamlead (active contract staff, existing agents, target volume/loans/app)
  const updateAdminSettings = (teamleadId: string, updates: Partial<AdminSettings>) => {
    setAdminSettings((prev) => {
      const index = prev.findIndex((s) => s.teamleadId === teamleadId);
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
      if (index >= 0) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          ...updates,
          updatedAt: nowStr,
          updatedBy: currentUser.name,
        };
        return next;
      } else {
        const newSetting: AdminSettings = {
          teamleadId,
          activeContractStaff: updates.activeContractStaff ?? 10,
          existingAgents: updates.existingAgents ?? 20,
          targetVolume: updates.targetVolume ?? 1500000000,
          targetLoans: updates.targetLoans ?? 40,
          targetApp: updates.targetApp ?? 100,
          updatedAt: nowStr,
          updatedBy: currentUser.name,
        };
        return [...prev, newSetting];
      }
    });
  };

  const batchUpdateAdminSettings = (updatesList: { teamleadId: string; updates: Partial<AdminSettings> }[]) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAdminSettings((prev) => {
      const map = new Map(prev.map((s) => [s.teamleadId, s]));
      updatesList.forEach(({ teamleadId, updates }) => {
        const current = map.get(teamleadId);
        if (current) {
          map.set(teamleadId, {
            ...current,
            ...updates,
            updatedAt: nowStr,
            updatedBy: currentUser.name,
          });
        }
      });
      return Array.from(map.values());
    });
  };

  // Compute MTD sales rows from day 1 of current month to selectedDate
  const allMtdRows: MtdSalesRow[] = useMemo(() => {
    const selectedMonth = selectedDate.slice(0, 7); // e.g. "2026-10"

    return teamleads.map((tl, index) => {
      const setting = adminSettings.find((s) => s.teamleadId === tl.id) || {
        activeContractStaff: 10,
        existingAgents: 20,
        targetVolume: 1500000000,
        targetLoans: 40,
        targetApp: 100,
      };

      // Filter reports in the same month up to selectedDate
      const mtdReports = reports.filter(
        (r) =>
          r.teamleadId === tl.id &&
          r.date.startsWith(selectedMonth) &&
          r.date <= selectedDate
      );

      const totalAppMTD = mtdReports.reduce((sum, r) => sum + (r.app || 0), 0);
      const totalLoansMTD = mtdReports.reduce((sum, r) => sum + (r.loans || 0), 0);
      const totalAmountMTD = mtdReports.reduce((sum, r) => sum + (r.volume || 0), 0);
      const newContractStaffMTD = mtdReports.reduce((sum, r) => sum + (r.newContractStaff || 0), 0);
      const newAgentsMTD = mtdReports.reduce((sum, r) => sum + (r.newAgents || 0), 0);

      const completionRate =
        setting.targetVolume > 0 ? (totalAmountMTD / setting.targetVolume) * 100 : 0;
      const loanConversionRate =
        totalAppMTD > 0 ? (totalLoansMTD / totalAppMTD) * 100 : 0;

      return {
        stt: index + 1,
        teamleadId: tl.id,
        teamleadName: tl.name,
        teamleadCode: tl.code,
        supervisorId: tl.supervisorId,
        supervisorName: tl.supervisorName,
        region: tl.region,
        activeContractStaff: setting.activeContractStaff,
        existingAgents: setting.existingAgents,
        newContractStaffMTD,
        newAgentsMTD,
        totalAppMTD,
        totalLoansMTD,
        totalAmountMTD,
        targetVolume: setting.targetVolume,
        targetLoans: setting.targetLoans,
        targetApp: setting.targetApp,
        completionRate,
        loanConversionRate,
      };
    });
  }, [teamleads, reports, adminSettings, selectedDate]);

  // Compute Daily sales rows for selectedDate
  const allDailyRows: DailySalesRow[] = useMemo(() => {
    return teamleads.map((tl) => {
      const dailyRep = reports.find(
        (r) => r.teamleadId === tl.id && r.date === selectedDate
      );

      if (dailyRep) {
        return {
          teamleadId: tl.id,
          teamleadName: tl.name,
          teamleadCode: tl.code,
          supervisorId: tl.supervisorId,
          supervisorName: tl.supervisorName,
          app: dailyRep.app || 0,
          loans: dailyRep.loans || 0,
          amount: dailyRep.volume || 0,
          activeCodeContractStaff: dailyRep.activeCodeContractStaff || 0,
          activeCodeAgents: dailyRep.activeCodeAgents || 0,
          newContractStaffToday: dailyRep.newContractStaff || 0,
          newAgentsToday: dailyRep.newAgents || 0,
          isReported: true,
          submittedAt: dailyRep.submittedAt,
          note: dailyRep.note,
        };
      }

      return {
        teamleadId: tl.id,
        teamleadName: tl.name,
        teamleadCode: tl.code,
        supervisorId: tl.supervisorId,
        supervisorName: tl.supervisorName,
        app: 0,
        loans: 0,
        amount: 0,
        activeCodeContractStaff: 0,
        activeCodeAgents: 0,
        newContractStaffToday: 0,
        newAgentsToday: 0,
        isReported: false,
      };
    });
  }, [teamleads, reports, selectedDate]);

  // Filter rows based on Current User Role and UI filters
  const filteredMtdRows = useMemo(() => {
    let rows = allMtdRows;

    // 1. Role-based scoping
    if (currentUser.role === 'SUPERVISOR') {
      const sup = supervisors.find((s) => s.userId === currentUser.id);
      if (sup) {
        rows = rows.filter((r) => r.supervisorId === sup.id);
      }
    } else if (currentUser.role === 'TEAMLEAD') {
      const tl = teamleads.find((t) => t.userId === currentUser.id);
      if (tl) {
        rows = rows.filter((r) => r.teamleadId === tl.id);
      }
    }

    // 2. Supervisor filter in UI (for Director)
    if (currentUser.role === 'DIRECTOR' && selectedSupervisorFilter !== 'ALL') {
      rows = rows.filter((r) => r.supervisorId === selectedSupervisorFilter);
    }

    // 3. Search query
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

    // Recalculate STT for filtered view
    return rows.map((r, i) => ({ ...r, stt: i + 1 }));
  }, [allMtdRows, currentUser, supervisors, teamleads, selectedSupervisorFilter, searchTerm]);

  const filteredDailyRows = useMemo(() => {
    let rows = allDailyRows;

    // 1. Role-based scoping
    if (currentUser.role === 'SUPERVISOR') {
      const sup = supervisors.find((s) => s.userId === currentUser.id);
      if (sup) {
        rows = rows.filter((r) => r.supervisorId === sup.id);
      }
    } else if (currentUser.role === 'TEAMLEAD') {
      const tl = teamleads.find((t) => t.userId === currentUser.id);
      if (tl) {
        rows = rows.filter((r) => r.teamleadId === tl.id);
      }
    }

    // 2. Supervisor filter in UI
    if (currentUser.role === 'DIRECTOR' && selectedSupervisorFilter !== 'ALL') {
      rows = rows.filter((r) => r.supervisorId === selectedSupervisorFilter);
    }

    // 3. Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.teamleadName.toLowerCase().includes(q) ||
          r.teamleadCode.toLowerCase().includes(q) ||
          r.supervisorName.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [allDailyRows, currentUser, supervisors, teamleads, selectedSupervisorFilter, searchTerm]);

  // Overall KPI summary based on filtered rows
  const summaryKPIs: SummaryKPIs = useMemo(() => {
    const totalVolumeMTD = filteredMtdRows.reduce((sum, r) => sum + r.totalAmountMTD, 0);
    const totalLoansMTD = filteredMtdRows.reduce((sum, r) => sum + r.totalLoansMTD, 0);
    const totalAppMTD = filteredMtdRows.reduce((sum, r) => sum + r.totalAppMTD, 0);
    const totalTargetVolume = filteredMtdRows.reduce((sum, r) => sum + r.targetVolume, 0);
    const completionRate = totalTargetVolume > 0 ? (totalVolumeMTD / totalTargetVolume) * 100 : 0;
    const totalActiveContractStaff = filteredMtdRows.reduce((sum, r) => sum + r.activeContractStaff, 0);
    const totalExistingAgents = filteredMtdRows.reduce((sum, r) => sum + r.existingAgents, 0);
    const totalNewContractStaffMTD = filteredMtdRows.reduce((sum, r) => sum + r.newContractStaffMTD, 0);
    const totalNewAgentsMTD = filteredMtdRows.reduce((sum, r) => sum + r.newAgentsMTD, 0);

    const todayVolume = filteredDailyRows.reduce((sum, r) => sum + r.amount, 0);
    const todayLoans = filteredDailyRows.reduce((sum, r) => sum + r.loans, 0);
    const todayApp = filteredDailyRows.reduce((sum, r) => sum + r.app, 0);
    const todayActiveCodeContractStaff = filteredDailyRows.reduce((sum, r) => sum + r.activeCodeContractStaff, 0);
    const todayActiveCodeAgents = filteredDailyRows.reduce((sum, r) => sum + r.activeCodeAgents, 0);
    const reportedTeamleadsCount = filteredDailyRows.filter((r) => r.isReported).length;
    const totalTeamleadsCount = filteredDailyRows.length;

    return {
      totalVolumeMTD,
      totalLoansMTD,
      totalAppMTD,
      totalTargetVolume,
      completionRate,
      totalActiveContractStaff,
      totalExistingAgents,
      totalNewContractStaffMTD,
      totalNewAgentsMTD,
      todayVolume,
      todayLoans,
      todayApp,
      todayActiveCodeContractStaff,
      todayActiveCodeAgents,
      reportedTeamleadsCount,
      totalTeamleadsCount,
    };
  }, [filteredMtdRows, filteredDailyRows]);

  // Export to Excel / CSV with UTF-8 BOM
  const exportToCsv = () => {
    const headers = [
      'STT',
      'Teamlead',
      'Mã TL',
      'Giám Sát Phụ Trách',
      'Khu Vực',
      'HĐLĐ Active',
      'CTV Hiện Hữu',
      'Tuyển Mới HĐLĐ (MTD)',
      'Tuyển Mới CTV (MTD)',
      'Tổng App (MTD)',
      'Tổng Loans (MTD)',
      'Doanh Số MTD (VNĐ)',
      'Mục Tiêu Tháng (VNĐ)',
      '% Hoàn Thành',
      'App Ngày',
      'Loans Ngày',
      'Doanh Số Ngày (VNĐ)',
      'HĐLĐ Kích Hoạt Code Ngày',
      'CTV Kích Hoạt Code Ngày',
      'Trạng Thái Báo Cáo Ngày',
    ];

    const rows = filteredMtdRows.map((mtd) => {
      const daily = filteredDailyRows.find((d) => d.teamleadId === mtd.teamleadId);
      return [
        mtd.stt,
        `"${mtd.teamleadName}"`,
        `"${mtd.teamleadCode}"`,
        `"${mtd.supervisorName}"`,
        `"${mtd.region}"`,
        mtd.activeContractStaff,
        mtd.existingAgents,
        mtd.newContractStaffMTD,
        mtd.newAgentsMTD,
        mtd.totalAppMTD,
        mtd.totalLoansMTD,
        mtd.totalAmountMTD,
        mtd.targetVolume,
        `${mtd.completionRate.toFixed(1)}%`,
        daily?.app ?? 0,
        daily?.loans ?? 0,
        daily?.amount ?? 0,
        daily?.activeCodeContractStaff ?? 0,
        daily?.activeCodeAgents ?? 0,
        daily?.isReported ? 'Đã báo cáo' : 'Chưa báo cáo',
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Doanh_So_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        supervisors,
        teamleads,
        selectedDate,
        setSelectedDate,
        selectedSupervisorFilter,
        setSelectedSupervisorFilter,
        searchTerm,
        setSearchTerm,
        activeView,
        setActiveView,
        submitDailyReport,
        updateAdminSettings,
        batchUpdateAdminSettings,
        switchUser,
        resetToDefaultData,
        exportToCsv,
        reports,
        adminSettings,
        allMtdRows,
        allDailyRows,
        filteredMtdRows,
        filteredDailyRows,
        summaryKPIs,
        getReportForTeamleadDate,
        getAdminSettingForTeamlead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

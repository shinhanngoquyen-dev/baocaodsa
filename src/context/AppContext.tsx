import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  SupervisorInfo,
  TeamleadInfo,
  DailyReport,
  AdminSettings,
  MtdSalesRow,
  DailySalesRow,
  UnifiedDashboardRow,
  SummaryKPIs,
  ReportShift,
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
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateTeamleadSelfProfile: (userId: string, birthday: string, phone: string) => void;
  createNewSupervisor: (data: {
    name: string;
    username: string;
    code: string;
    region: string;
    birthday?: string;
    phone?: string;
    password?: string;
  }) => { success: boolean; message: string; supervisorId?: string };
  createNewTeamlead: (data: {
    name: string;
    username: string;
    code: string;
    region: string;
    supervisorId: string;
    birthday?: string;
    phone?: string;
    password?: string;
    targetVolume?: number;
    activeContractStaff?: number;
  }) => { success: boolean; message: string; teamleadId?: string };
  loginWithCredentials: (username: string, password?: string) => { success: boolean; message?: string };
  switchUser: (userId: string) => void;
  resetMonthSales: () => { success: boolean; message: string };
  resetToDefaultData: () => void;
  exportToCsv: () => void;
  
  // Computed data
  allMtdRows: MtdSalesRow[];
  allDailyRows: DailySalesRow[];
  filteredMtdRows: MtdSalesRow[];
  filteredDailyRows: DailySalesRow[];
  unifiedDashboardRows: UnifiedDashboardRow[];
  summaryKPIs: SummaryKPIs;
  getReportForTeamleadDateShift: (teamleadId: string, date: string, shift: ReportShift) => DailyReport | undefined;
  getAdminSettingForTeamlead: (teamleadId: string) => AdminSettings | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sales_hub_current_user_v4',
  USERS: 'sales_hub_users_v4',
  SUPERVISORS: 'sales_hub_supervisors_v4',
  TEAMLEADS: 'sales_hub_teamleads_v4',
  REPORTS: 'sales_hub_reports_v4',
  ADMIN_SETTINGS: 'sales_hub_admin_settings_v4',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supervisors, setSupervisors] = useState<SupervisorInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPERVISORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_SUPERVISORS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_USERS;
  });

  const [teamleads, setTeamleads] = useState<TeamleadInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAMLEADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_TEAMLEADS;
  });

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [selectedSupervisorFilter, setSelectedSupervisorFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeView, setActiveView] = useState<'dashboard' | 'mtd_table' | 'daily_table' | 'hierarchy' | 'admin_targets' | 'submit_report'>('dashboard');

  const [reports, setReports] = useState<DailyReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved reports from localStorage', e);
    }
    return INITIAL_REPORTS;
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin settings from localStorage', e);
    }
    return INITIAL_ADMIN_SETTINGS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (saved && users.some((u) => u.id === saved)) return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'user_admin';
  });

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(supervisors));
    } catch (e) {
      console.error(e);
    }
  }, [supervisors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAMLEADS, JSON.stringify(teamleads));
    } catch (e) {
      console.error(e);
    }
  }, [teamleads]);

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

  // Đăng nhập bằng username / password (ví dụ admin / duchai168, vinhphuc, thainguyen, hanoi1)
  const loginWithCredentials = (username: string, password?: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const target = users.find((u) => u.username.toLowerCase() === cleanUser || u.code.toLowerCase() === cleanUser);

    if (!target) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống.' };
    }

    if (cleanUser === 'admin') {
      if (password !== 'duchai168' && password !== target.password) {
        return { success: false, message: 'Mật khẩu admin không đúng (Mật khẩu mặc định: duchai168)' };
      }
    } else if (target.password && password && target.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác.' };
    }

    setCurrentUserId(target.id);
    return { success: true };
  };

  // Admin cập nhật thông tin nhân viên: Họ và tên, Ngày sinh nhật, SĐT, Mã, Khu vực, Mật khẩu...
  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers((prevUsers) => {
      return prevUsers.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            ...updates,
          };
        }
        return u;
      });
    });

    // Đồng bộ sang teamleads nếu người dùng là Teamlead
    setTeamleads((prevTLs) => {
      return prevTLs.map((tl) => {
        if (tl.userId === userId) {
          const sup = updates.supervisorId ? supervisors.find((s) => s.id === updates.supervisorId) : undefined;
          return {
            ...tl,
            name: updates.name ?? tl.name,
            birthday: updates.birthday ?? tl.birthday,
            phone: updates.phone ?? tl.phone,
            code: updates.code ?? tl.code,
            region: updates.region ?? tl.region,
            supervisorId: updates.supervisorId ?? tl.supervisorId,
            supervisorName: sup ? sup.name : tl.supervisorName,
          };
        }
        return tl;
      });
    });

    // Đồng bộ sang supervisors nếu người dùng là Giám Sát
    setSupervisors((prevSups) => {
      return prevSups.map((s) => {
        if (s.userId === userId) {
          return {
            ...s,
            name: updates.name ?? s.name,
            code: updates.code ?? s.code,
            region: updates.region ?? s.region,
          };
        }
        return s;
      });
    });
  };

  // Admin tạo thêm Giám Sát mới
  const createNewSupervisor = (data: {
    name: string;
    username: string;
    code: string;
    region: string;
    birthday?: string;
    phone?: string;
    password?: string;
  }): { success: boolean; message: string; supervisorId?: string } => {
    if (currentUser.role !== 'DIRECTOR') {
      return { success: false, message: 'Chỉ SM (Admin) mới có quyền tạo thêm Giám Sát.' };
    }

    const cleanUsername = data.username.trim().toLowerCase();
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return {
        success: false,
        message: `Tên đăng nhập "${cleanUsername}" đã được sử dụng. Vui lòng chọn tên đăng nhập khác.`,
      };
    }

    const supId = 'sup_' + Date.now();
    const userId = 'user_gs_' + Date.now();

    const newSupervisor: SupervisorInfo = {
      id: supId,
      userId,
      username: cleanUsername,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      region: data.region.trim(),
      teamleadIds: [],
    };

    const newUser: User = {
      id: userId,
      username: cleanUsername,
      password: data.password?.trim() || '123',
      name: data.name.trim(),
      birthday: data.birthday,
      phone: data.phone || '',
      email: `${cleanUsername}@salenorth1.vn`,
      code: data.code.trim().toUpperCase(),
      role: 'SUPERVISOR',
      region: data.region.trim(),
      managedTeamleadIds: [],
    };

    setSupervisors((prev) => [...prev, newSupervisor]);
    setUsers((prev) => [...prev, newUser]);

    return {
      success: true,
      message: `Đã tạo thêm Giám Sát "${data.name}" (${newSupervisor.code} - ${newSupervisor.region}) thành công!`,
      supervisorId: supId,
    };
  };

  // Admin tạo thêm Teamlead mới với chọn line báo cáo Giám Sát
  const createNewTeamlead = (data: {
    name: string;
    username: string;
    code: string;
    region: string;
    supervisorId: string;
    birthday?: string;
    phone?: string;
    password?: string;
    targetVolume?: number;
    activeContractStaff?: number;
  }): { success: boolean; message: string; teamleadId?: string } => {
    if (currentUser.role !== 'DIRECTOR') {
      return { success: false, message: 'Chỉ SM (Admin) mới có quyền tạo thêm Teamlead.' };
    }

    const cleanUsername = data.username.trim().toLowerCase();
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return {
        success: false,
        message: `Tên đăng nhập "${cleanUsername}" đã được sử dụng. Vui lòng chọn tên khác.`,
      };
    }

    const sup = supervisors.find((s) => s.id === data.supervisorId);
    if (!sup) {
      return { success: false, message: 'Giám sát được chọn không tồn tại trong hệ thống.' };
    }

    const tlId = 'tl_' + Date.now();
    const userId = 'user_tl_' + Date.now();

    const newTeamlead: TeamleadInfo = {
      id: tlId,
      userId,
      username: cleanUsername,
      name: data.name.trim(),
      birthday: data.birthday,
      phone: data.phone || '',
      code: data.code.trim().toUpperCase(),
      supervisorId: data.supervisorId,
      supervisorName: sup.name,
      region: data.region.trim(),
    };

    const newUser: User = {
      id: userId,
      username: cleanUsername,
      password: data.password?.trim() || '123',
      name: data.name.trim(),
      birthday: data.birthday,
      phone: data.phone || '',
      email: `${cleanUsername}@salenorth1.vn`,
      code: data.code.trim().toUpperCase(),
      role: 'TEAMLEAD',
      region: data.region.trim(),
      supervisorId: data.supervisorId,
    };

    const newAdminSetting: AdminSettings = {
      teamleadId: tlId,
      activeContractStaff: data.activeContractStaff || 4,
      existingAgents: 6,
      targetVolume: data.targetVolume || 1500000000,
      targetLoans: 30,
      targetApp: 40,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.name || 'Admin',
    };

    // Cập nhật danh sách teamlead của Giám sát
    setSupervisors((prev) =>
      prev.map((s) => (s.id === data.supervisorId ? { ...s, teamleadIds: [...s.teamleadIds, tlId] } : s))
    );

    setTeamleads((prev) => [...prev, newTeamlead]);
    setUsers((prev) => [...prev, newUser]);
    setAdminSettings((prev) => [...prev, newAdminSetting]);

    return {
      success: true,
      message: `Đã tạo thêm Teamlead "${data.name}" (${newTeamlead.code}) thuộc line Giám Sát ${sup.name} (${sup.region}) thành công!`,
      teamleadId: tlId,
    };
  };

  // Teamlead tự cập nhật ngày sinh nhật và số điện thoại của mình
  const updateTeamleadSelfProfile = (userId: string, birthday: string, phone: string) => {
    updateUserProfile(userId, { birthday, phone });
  };

  // Cuối tháng: Chỉ Admin mới có quyền reset doanh số về 0 để mở chu kỳ mới
  const resetMonthSales = (): { success: boolean; message: string } => {
    if (currentUser.role !== 'DIRECTOR') {
      return {
        success: false,
        message: 'Chỉ SM (Admin) mới có quyền reset doanh số cuối tháng.',
      };
    }
    setReports([]);
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    return {
      success: true,
      message: 'Đã reset toàn bộ doanh số 11 team về 0 để mở chu kỳ tháng mới thành công!',
    };
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setSupervisors(INITIAL_SUPERVISORS);
    setTeamleads(INITIAL_TEAMLEADS);
    setReports(INITIAL_REPORTS);
    setAdminSettings(INITIAL_ADMIN_SETTINGS);
    setCurrentUserId('user_admin');
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SUPERVISORS);
    localStorage.removeItem(STORAGE_KEYS.TEAMLEADS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  };

  const getAdminSettingForTeamlead = (teamleadId: string): AdminSettings | undefined => {
    return adminSettings.find((s) => s.teamleadId === teamleadId);
  };

  const getReportForTeamleadDateShift = (
    teamleadId: string,
    date: string,
    shift: ReportShift
  ): DailyReport | undefined => {
    return reports.find(
      (r) => r.teamleadId === teamleadId && r.date === date && r.shift === shift
    );
  };

  const submitDailyReport = (newReport: Omit<DailyReport, 'id' | 'submittedAt' | 'submittedBy'>) => {
    const existingIndex = reports.findIndex(
      (r) =>
        r.teamleadId === newReport.teamleadId &&
        r.date === newReport.date &&
        r.shift === newReport.shift
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
        id: `rep_${newReport.teamleadId}_${newReport.date}_${newReport.shift}_${Date.now()}`,
        submittedAt: nowStr,
        submittedBy: submitterName,
      };
      setReports((prev) => [createdReport, ...prev]);
    }
  };

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

  // Compute MTD sales rows from day 1 of current month to selectedDate for 11 teamleads
  const allMtdRows: MtdSalesRow[] = useMemo(() => {
    const selectedMonth = selectedDate.slice(0, 7);

    return teamleads.map((tl, index) => {
      const setting = adminSettings.find((s) => s.teamleadId === tl.id) || {
        activeContractStaff: 10,
        existingAgents: 20,
        targetVolume: 1500000000,
        targetLoans: 40,
        targetApp: 100,
      };

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

  // Compute Daily sales rows for 11 teamleads
  const allDailyRows: DailySalesRow[] = useMemo(() => {
    return teamleads.map((tl) => {
      const shift1Rep = reports.find(
        (r) => r.teamleadId === tl.id && r.date === selectedDate && r.shift === 'SHIFT_12H'
      );
      const shift2Rep = reports.find(
        (r) => r.teamleadId === tl.id && r.date === selectedDate && r.shift === 'SHIFT_19H'
      );

      const shift1Reported = !!shift1Rep;
      const shift2Reported = !!shift2Rep;

      let warningStatus: 'OK' | 'MISSING_12H' | 'MISSING_19H' | 'MISSING_BOTH' = 'OK';
      let warningMessage = 'Đã nộp đủ 2 ca';

      if (!shift1Reported && !shift2Reported) {
        warningStatus = 'MISSING_BOTH';
        warningMessage = 'Chưa nộp cả 2 ca (12h & 19h)';
      } else if (!shift1Reported) {
        warningStatus = 'MISSING_12H';
        warningMessage = 'Chưa nộp ca 1 (trước 12h)';
      } else if (!shift2Reported) {
        warningStatus = 'MISSING_19H';
        warningMessage = 'Chưa nộp ca 2 (trước 19h)';
      }

      const totalApp = (shift1Rep?.app || 0) + (shift2Rep?.app || 0);
      const totalLoans = (shift1Rep?.loans || 0) + (shift2Rep?.loans || 0);
      const totalAmount = (shift1Rep?.volume || 0) + (shift2Rep?.volume || 0);
      const totalActiveHld = (shift1Rep?.activeCodeContractStaff || 0) + (shift2Rep?.activeCodeContractStaff || 0);
      const totalActiveCtv = (shift1Rep?.activeCodeAgents || 0) + (shift2Rep?.activeCodeAgents || 0);
      const totalNewHld = (shift1Rep?.newContractStaff || 0) + (shift2Rep?.newContractStaff || 0);
      const totalNewCtv = (shift1Rep?.newAgents || 0) + (shift2Rep?.newAgents || 0);

      const latestSubmittedAt = shift2Rep?.submittedAt || shift1Rep?.submittedAt;
      const latestNote = shift2Rep?.note || shift1Rep?.note;

      return {
        teamleadId: tl.id,
        teamleadName: tl.name,
        teamleadCode: tl.code,
        supervisorId: tl.supervisorId,
        supervisorName: tl.supervisorName,
        app: totalApp,
        loans: totalLoans,
        amount: totalAmount,
        activeCodeContractStaff: totalActiveHld,
        activeCodeAgents: totalActiveCtv,
        newContractStaffToday: totalNewHld,
        newAgentsToday: totalNewCtv,
        isReported: shift1Reported || shift2Reported,
        shift1Reported,
        shift1SubmittedAt: shift1Rep?.submittedAt,
        shift1Amount: shift1Rep?.volume || 0,
        shift1Loans: shift1Rep?.loans || 0,
        shift1App: shift1Rep?.app || 0,
        shift2Reported,
        shift2SubmittedAt: shift2Rep?.submittedAt,
        shift2Amount: shift2Rep?.volume || 0,
        shift2Loans: shift2Rep?.loans || 0,
        shift2App: shift2Rep?.app || 0,
        warningStatus,
        warningMessage,
        submittedAt: latestSubmittedAt,
        note: latestNote,
      };
    });
  }, [teamleads, reports, selectedDate]);

  const filteredMtdRows = useMemo(() => {
    let rows = allMtdRows;

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

    if (currentUser.role === 'DIRECTOR' && selectedSupervisorFilter !== 'ALL') {
      rows = rows.filter((r) => r.supervisorId === selectedSupervisorFilter);
    }

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

    return rows.map((r, i) => ({ ...r, stt: i + 1 }));
  }, [allMtdRows, currentUser, supervisors, teamleads, selectedSupervisorFilter, searchTerm]);

  const filteredDailyRows = useMemo(() => {
    let rows = allDailyRows;

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

    if (currentUser.role === 'DIRECTOR' && selectedSupervisorFilter !== 'ALL') {
      rows = rows.filter((r) => r.supervisorId === selectedSupervisorFilter);
    }

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

  const unifiedDashboardRows: UnifiedDashboardRow[] = useMemo(() => {
    return filteredMtdRows.map((mtd, index) => {
      const daily = filteredDailyRows.find((d) => d.teamleadId === mtd.teamleadId);

      return {
        stt: index + 1,
        teamleadId: mtd.teamleadId,
        teamleadName: mtd.teamleadName,
        teamleadCode: mtd.teamleadCode,
        supervisorId: mtd.supervisorId,
        supervisorName: mtd.supervisorName,
        region: mtd.region,

        activeContractStaff: mtd.activeContractStaff,
        existingAgents: mtd.existingAgents,
        newContractStaffMTD: mtd.newContractStaffMTD,
        newAgentsMTD: mtd.newAgentsMTD,
        totalAppMTD: mtd.totalAppMTD,
        totalLoansMTD: mtd.totalLoansMTD,
        totalAmountMTD: mtd.totalAmountMTD,
        targetVolume: mtd.targetVolume,
        completionRate: mtd.completionRate,

        todayApp: daily?.app || 0,
        todayLoans: daily?.loans || 0,
        todayAmount: daily?.amount || 0,
        todayActiveCodeHld: daily?.activeCodeContractStaff || 0,
        todayActiveCodeCtv: daily?.activeCodeAgents || 0,

        shift1Reported: daily?.shift1Reported || false,
        shift1Time: daily?.shift1SubmittedAt,
        shift2Reported: daily?.shift2Reported || false,
        shift2Time: daily?.shift2SubmittedAt,
        warningStatus: daily?.warningStatus || 'MISSING_BOTH',
        warningMessage: daily?.warningMessage || 'Chưa nộp',
        isReported: daily?.isReported || false,
      };
    });
  }, [filteredMtdRows, filteredDailyRows]);

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

    const missingShift1Count = filteredDailyRows.filter((r) => !r.shift1Reported).length;
    const missingShift2Count = filteredDailyRows.filter((r) => !r.shift2Reported).length;
    const fullyReportedCount = filteredDailyRows.filter((r) => r.shift1Reported && r.shift2Reported).length;

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
      missingShift1Count,
      missingShift2Count,
      fullyReportedCount,
    };
  }, [filteredMtdRows, filteredDailyRows]);

  const exportToCsv = () => {
    const headers = [
      'STT',
      'Teamlead',
      'Mã TL',
      'Giám Sát Phụ Trách',
      'Khu Vực',
      'Code HĐLĐ Active',
      'Code CTV Hiện Hữu',
      'Tuyển Mới HĐLĐ (MTD)',
      'Tuyển Mới CTV (MTD)',
      'Tổng App (MTD)',
      'Tổng Loans (MTD)',
      'Doanh Số MTD (VNĐ)',
      'Mục Tiêu Tháng (VNĐ)',
      '% Hoàn Thành MTD',
      'App Ngày',
      'Loans Ngày',
      'Doanh Số Ngày (VNĐ)',
      'HĐLĐ Kích Hoạt Code Ngày',
      'CTV Kích Hoạt Code Ngày',
      'Ca 1 (Trước 12h)',
      'Ca 2 (Trước 19h)',
      'Cảnh Báo Báo Cáo',
    ];

    const rows = unifiedDashboardRows.map((r) => [
      r.stt,
      `"${r.teamleadName}"`,
      `"${r.teamleadCode}"`,
      `"${r.supervisorName}"`,
      `"${r.region}"`,
      r.activeContractStaff,
      r.existingAgents,
      r.newContractStaffMTD,
      r.newAgentsMTD,
      r.totalAppMTD,
      r.totalLoansMTD,
      r.totalAmountMTD,
      r.targetVolume,
      `${r.completionRate.toFixed(1)}%`,
      r.todayApp,
      r.todayLoans,
      r.todayAmount,
      r.todayActiveCodeHld,
      r.todayActiveCodeCtv,
      r.shift1Reported ? `Đã nộp (${r.shift1Time?.split(' ')[1] || ''})` : 'Chưa nộp',
      r.shift2Reported ? `Đã nộp (${r.shift2Time?.split(' ')[1] || ''})` : 'Chưa nộp',
      `"${r.warningMessage}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Doanh_So_11_Team_${selectedDate}.csv`);
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
        updateUserProfile,
        updateTeamleadSelfProfile,
        createNewSupervisor,
        createNewTeamlead,
        loginWithCredentials,
        switchUser,
        resetMonthSales,
        resetToDefaultData,
        exportToCsv,
        reports,
        adminSettings,
        allMtdRows,
        allDailyRows,
        filteredMtdRows,
        filteredDailyRows,
        unifiedDashboardRows,
        summaryKPIs,
        getReportForTeamleadDateShift,
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

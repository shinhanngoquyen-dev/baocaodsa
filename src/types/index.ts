export type UserRole = 'DIRECTOR' | 'SUPERVISOR' | 'TEAMLEAD';
export type ReportShift = 'SHIFT_12H' | 'SHIFT_19H';

export interface User {
  id: string;
  username: string; // username đăng nhập: admin, vinhphuc, thainguyen, hanoi1, tl01...
  password?: string; // mật khẩu: admin là duchai168
  name: string;
  birthday?: string; // Ngày sinh nhật (YYYY-MM-DD)
  email: string;
  code: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  supervisorId?: string; // Nếu là Teamlead thì thuộc Giám sát này
  managedSupervisorIds?: string[]; // Dành cho Director quản lý 3 GS
  managedTeamleadIds?: string[]; // Dành cho Giám sát quản lý TL
  region?: string;
}

export interface SupervisorInfo {
  id: string;
  userId: string;
  username: string;
  name: string;
  code: string;
  region: string;
  teamleadIds: string[];
}

export interface TeamleadInfo {
  id: string;
  userId: string;
  username: string;
  name: string;
  birthday?: string;
  phone?: string;
  code: string;
  supervisorId: string;
  supervisorName: string;
  region: string;
}

// Báo cáo hàng ngày do Teamlead nhập theo Ca (Ca 1 trước 12h, Ca 2 trước 19h)
export interface DailyReport {
  id: string;
  teamleadId: string;
  date: string; // YYYY-MM-DD
  shift: ReportShift; // SHIFT_12H | SHIFT_19H
  app: number; // Số lượng hồ sơ nộp
  loans: number; // Số lượng hợp đồng giải ngân
  volume: number; // Doanh số giải ngân (VNĐ)
  newContractStaff: number; // Số nhân viên HĐLĐ tuyển mới
  newAgents: number; // Số nhân viên CTV tuyển mới
  activeCodeContractStaff: number; // Số HĐLĐ kích hoạt code trong ca
  activeCodeAgents: number; // Số CTV kích hoạt code trong ca
  note?: string;
  submittedAt: string;
  submittedBy: string;
}

// Chỉ số quản trị do Tôi & Giám sát thiết lập
export interface AdminSettings {
  teamleadId: string;
  activeContractStaff: number; // Số code HĐLĐ đang active
  existingAgents: number; // Số CTV hiện hữu
  targetVolume: number; // Mục tiêu doanh số tháng (VNĐ)
  targetLoans: number; // Mục tiêu số lượng giải ngân
  targetApp: number; // Mục tiêu số hồ sơ nộp
  updatedAt: string;
  updatedBy: string;
}

// Hàng dữ liệu Bảng Doanh số Lũy kế MTD (từ đầu tháng đến ngày hiện tại)
export interface MtdSalesRow {
  stt: number;
  teamleadId: string;
  teamleadName: string;
  teamleadCode: string;
  supervisorId: string;
  supervisorName: string;
  region: string;
  activeContractStaff: number; // HĐLĐ active
  existingAgents: number; // CTV hiện hữu
  newContractStaffMTD: number; // Số HĐLĐ tuyển mới trong tháng
  newAgentsMTD: number; // Số CTV tuyển mới trong tháng
  totalAppMTD: number; // App lũy kế MTD
  totalLoansMTD: number; // Loans lũy kế MTD
  totalAmountMTD: number; // Amount/Volume lũy kế MTD
  targetVolume: number; // Mục tiêu tháng (Amount)
  targetLoans: number;
  targetApp: number;
  completionRate: number; // Tỷ lệ % hoàn thành Volume
  loanConversionRate: number; // Tỷ lệ Loans / App
}

// Hàng dữ liệu Bảng Doanh số trong ngày (Daily Sales) với 2 ca báo cáo
export interface DailySalesRow {
  teamleadId: string;
  teamleadName: string;
  teamleadCode: string;
  supervisorId: string;
  supervisorName: string;
  app: number;
  loans: number;
  amount: number; // Volume tổng trong ngày
  activeCodeContractStaff: number; // Số HĐLĐ kích hoạt code hôm nay
  activeCodeAgents: number; // Số CTV kích hoạt code hôm nay
  newContractStaffToday: number;
  newAgentsToday: number;
  isReported: boolean;
  
  // Chi tiết 2 ca báo cáo trong ngày
  shift1Reported: boolean; // Ca 1: Trước 12h
  shift1SubmittedAt?: string;
  shift1Amount: number;
  shift1Loans: number;
  shift1App: number;

  shift2Reported: boolean; // Ca 2: Trước 19h
  shift2SubmittedAt?: string;
  shift2Amount: number;
  shift2Loans: number;
  shift2App: number;

  warningStatus: 'OK' | 'MISSING_12H' | 'MISSING_19H' | 'MISSING_BOTH';
  warningMessage: string;
  submittedAt?: string;
  note?: string;
}

// Hàng dữ liệu bảng Dashboard Hợp Nhất (Unified Dashboard: Teamlead, Doanh số MTD, Doanh số Ngày, Cảnh báo 2 ca)
export interface UnifiedDashboardRow {
  stt: number;
  teamleadId: string;
  teamleadName: string;
  teamleadCode: string;
  supervisorId: string;
  supervisorName: string;
  region: string;

  // 1. Doanh số MTD
  activeContractStaff: number; // Code HDLD
  existingAgents: number; // Code CTV
  newContractStaffMTD: number; // HĐLĐ tuyển mới MTD
  newAgentsMTD: number; // CTV tuyển mới MTD
  totalAppMTD: number; // App MTD
  totalLoansMTD: number; // Loans MTD
  totalAmountMTD: number; // Amount MTD
  targetVolume: number;
  completionRate: number;

  // 2. Doanh số trong ngày
  todayApp: number;
  todayLoans: number;
  todayAmount: number;
  todayActiveCodeHld: number;
  todayActiveCodeCtv: number;

  // 3. Hai lần báo cáo trong ngày & Cảnh báo
  shift1Reported: boolean;
  shift1Time?: string;
  shift2Reported: boolean;
  shift2Time?: string;
  warningStatus: 'OK' | 'MISSING_12H' | 'MISSING_19H' | 'MISSING_BOTH';
  warningMessage: string;
  isReported: boolean;
}

export interface SummaryKPIs {
  totalVolumeMTD: number;
  totalLoansMTD: number;
  totalAppMTD: number;
  totalTargetVolume: number;
  completionRate: number;
  totalActiveContractStaff: number;
  totalExistingAgents: number;
  totalNewContractStaffMTD: number;
  totalNewAgentsMTD: number;
  // Daily metrics
  todayVolume: number;
  todayLoans: number;
  todayApp: number;
  todayActiveCodeContractStaff: number;
  todayActiveCodeAgents: number;
  reportedTeamleadsCount: number;
  totalTeamleadsCount: number;
  // Shift warning counts
  missingShift1Count: number;
  missingShift2Count: number;
  fullyReportedCount: number;
}

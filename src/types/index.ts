export type UserRole = 'DIRECTOR' | 'SUPERVISOR' | 'TEAMLEAD';

export interface User {
  id: string;
  name: string;
  email: string;
  code: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  supervisorId?: string; // Nếu là Teamlead thì thuộc Giám sát này
  managedSupervisorIds?: string[]; // Dành cho Director quản lý 5 GS
  managedTeamleadIds?: string[]; // Dành cho Giám sát quản lý 4-5 TL
  region?: string;
}

export interface SupervisorInfo {
  id: string;
  userId: string;
  name: string;
  code: string;
  region: string;
  teamleadIds: string[];
}

export interface TeamleadInfo {
  id: string;
  userId: string;
  name: string;
  code: string;
  supervisorId: string;
  supervisorName: string;
  region: string;
}

// Báo cáo hàng ngày do Teamlead nhập
export interface DailyReport {
  id: string;
  teamleadId: string;
  date: string; // YYYY-MM-DD
  app: number; // Số lượng hồ sơ nộp
  loans: number; // Số lượng hợp đồng giải ngân
  volume: number; // Doanh số giải ngân (VNĐ)
  newContractStaff: number; // Số nhân viên HĐLĐ tuyển mới
  newAgents: number; // Số nhân viên CTV tuyển mới
  activeCodeContractStaff: number; // Số HĐLĐ kích hoạt code trong ngày
  activeCodeAgents: number; // Số CTV kích hoạt code trong ngày
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

// Hàng dữ liệu Bảng Doanh số trong ngày (Daily Sales)
export interface DailySalesRow {
  teamleadId: string;
  teamleadName: string;
  teamleadCode: string;
  supervisorId: string;
  supervisorName: string;
  app: number;
  loans: number;
  amount: number; // Volume trong ngày
  activeCodeContractStaff: number; // Số HĐLĐ kích hoạt code hôm nay
  activeCodeAgents: number; // Số CTV kích hoạt code hôm nay
  newContractStaffToday: number;
  newAgentsToday: number;
  isReported: boolean;
  submittedAt?: string;
  note?: string;
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
}

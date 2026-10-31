import { User, SupervisorInfo, TeamleadInfo, AdminSettings, DailyReport } from '../types';

export const INITIAL_SUPERVISORS: SupervisorInfo[] = [
  {
    id: 'GS01',
    userId: 'user_gs01',
    name: 'Trần Hoàng Nam',
    code: 'GS-HCM-01',
    region: 'Khu vực TP. Hồ Chí Minh 1',
    teamleadIds: ['TL01', 'TL02', 'TL03', 'TL04', 'TL05'],
  },
  {
    id: 'GS02',
    userId: 'user_gs02',
    name: 'Lê Thị Mai Hương',
    code: 'GS-HCM-02',
    region: 'Khu vực TP. Hồ Chí Minh 2',
    teamleadIds: ['TL06', 'TL07', 'TL08', 'TL09'],
  },
  {
    id: 'GS03',
    userId: 'user_gs03',
    name: 'Phạm Quốc Tuấn',
    code: 'GS-MKB-01',
    region: 'Khu vực Tây Nam Bộ (Mekong)',
    teamleadIds: ['TL10', 'TL11', 'TL12', 'TL13'],
  },
  {
    id: 'GS04',
    userId: 'user_gs04',
    name: 'Nguyễn Văn Đức',
    code: 'GS-DNB-01',
    region: 'Khu vực Đông Nam Bộ',
    teamleadIds: ['TL14', 'TL15', 'TL16', 'TL17', 'TL18'],
  },
  {
    id: 'GS05',
    userId: 'user_gs05',
    name: 'Hoàng Minh Khang',
    code: 'GS-MTN-01',
    region: 'Khu vực Miền Trung & Tây Nguyên',
    teamleadIds: ['TL19', 'TL20', 'TL21', 'TL22'],
  },
];

export const INITIAL_TEAMLEADS: TeamleadInfo[] = [
  // GS01: HCM 1 (5 TL)
  { id: 'TL01', userId: 'user_tl01', name: 'Đặng Minh Tâm', code: 'TL-Q1-01', supervisorId: 'GS01', supervisorName: 'Trần Hoàng Nam', region: 'Quận 1 & Quận 3' },
  { id: 'TL02', userId: 'user_tl02', name: 'Vũ Thị Ngọc Ánh', code: 'TL-Q10-02', supervisorId: 'GS01', supervisorName: 'Trần Hoàng Nam', region: 'Quận 10 & Quận 11' },
  { id: 'TL03', userId: 'user_tl03', name: 'Trịnh Hoàng Long', code: 'TL-TB-03', supervisorId: 'GS01', supervisorName: 'Trần Hoàng Nam', region: 'Tân Bình & Tân Phú' },
  { id: 'TL04', userId: 'user_tl04', name: 'Bùi Thị Thanh Hằng', code: 'TL-PN-04', supervisorId: 'GS01', supervisorName: 'Trần Hoàng Nam', region: 'Phú Nhuận & Bình Thạnh' },
  { id: 'TL05', userId: 'user_tl05', name: 'Ngô Kiến Huy', code: 'TL-GV-05', supervisorId: 'GS01', supervisorName: 'Trần Hoàng Nam', region: 'Gò Vấp & Quận 12' },

  // GS02: HCM 2 (4 TL)
  { id: 'TL06', userId: 'user_tl06', name: 'Đỗ Thị Kim Oanh', code: 'TL-TD-06', supervisorId: 'GS02', supervisorName: 'Lê Thị Mai Hương', region: 'TP. Thủ Đức Bắc' },
  { id: 'TL07', userId: 'user_tl07', name: 'Dương Văn Trọng', code: 'TL-TD-07', supervisorId: 'GS02', supervisorName: 'Lê Thị Mai Hương', region: 'TP. Thủ Đức Nam' },
  { id: 'TL08', userId: 'user_tl08', name: 'Lý Gia Thành', code: 'TL-Q7-08', supervisorId: 'GS02', supervisorName: 'Lê Thị Mai Hương', region: 'Quận 7 & Nhà Bè' },
  { id: 'TL09', userId: 'user_tl09', name: 'Phan Bảo Châu', code: 'TL-Q8-09', supervisorId: 'GS02', supervisorName: 'Lê Thị Mai Hương', region: 'Quận 8 & Bình Chánh' },

  // GS03: Tây Nam Bộ (4 TL)
  { id: 'TL10', userId: 'user_tl10', name: 'Lâm Văn Phước', code: 'TL-CT-10', supervisorId: 'GS03', supervisorName: 'Phạm Quốc Tuấn', region: 'Cần Thơ & Hậu Giang' },
  { id: 'TL11', userId: 'user_tl11', name: 'Huỳnh Thảo Vy', code: 'TL-AG-11', supervisorId: 'GS03', supervisorName: 'Phạm Quốc Tuấn', region: 'An Giang & Kiên Giang' },
  { id: 'TL12', userId: 'user_tl12', name: 'Tạ Minh Triết', code: 'TL-TG-12', supervisorId: 'GS03', supervisorName: 'Phạm Quốc Tuấn', region: 'Tiền Giang & Bến Tre' },
  { id: 'TL13', userId: 'user_tl13', name: 'Nguyễn Tấn Đạt', code: 'TL-DT-13', supervisorId: 'GS03', supervisorName: 'Phạm Quốc Tuấn', region: 'Đồng Tháp & Vĩnh Long' },

  // GS04: Đông Nam Bộ (5 TL)
  { id: 'TL14', userId: 'user_tl14', name: 'Võ Minh Thuận', code: 'TL-BD-14', supervisorId: 'GS04', supervisorName: 'Nguyễn Văn Đức', region: 'Bình Dương (Thủ Dầu Một)' },
  { id: 'TL15', userId: 'user_tl15', name: 'Hồ Mỹ Duyên', code: 'TL-BD-15', supervisorId: 'GS04', supervisorName: 'Nguyễn Văn Đức', region: 'Bình Dương (Thuận An - Dĩ An)' },
  { id: 'TL16', userId: 'user_tl16', name: 'Cao Đình Sang', code: 'TL-DN-16', supervisorId: 'GS04', supervisorName: 'Nguyễn Văn Đức', region: 'Đồng Nai (Biên Hòa)' },
  { id: 'TL17', userId: 'user_tl17', name: 'Đoàn Thu Hà', code: 'TL-DN-17', supervisorId: 'GS04', supervisorName: 'Nguyễn Văn Đức', region: 'Đồng Nai (Long Thành - Nhơn Trạch)' },
  { id: 'TL18', userId: 'user_tl18', name: 'Mai Trọng Hiếu', code: 'TL-VT-18', supervisorId: 'GS04', supervisorName: 'Nguyễn Văn Đức', region: 'Bà Rịa - Vũng Tàu' },

  // GS05: Miền Trung & Tây Nguyên (4 TL)
  { id: 'TL19', userId: 'user_tl19', name: 'Đinh Quốc Cường', code: 'TL-DN-19', supervisorId: 'GS05', supervisorName: 'Hoàng Minh Khang', region: 'Đà Nẵng & Quảng Nam' },
  { id: 'TL20', userId: 'user_tl20', name: 'Phùng Bích Ngọc', code: 'TL-KH-20', supervisorId: 'GS05', supervisorName: 'Hoàng Minh Khang', region: 'Khánh Hòa (Nha Trang)' },
  { id: 'TL21', userId: 'user_tl21', name: 'Lê Văn Hùng', code: 'TL-DL-21', supervisorId: 'GS05', supervisorName: 'Hoàng Minh Khang', region: 'Đắk Lắk (Buôn Ma Thuột)' },
  { id: 'TL22', userId: 'user_tl22', name: 'Trần Gia Bảo', code: 'TL-GL-22', supervisorId: 'GS05', supervisorName: 'Hoàng Minh Khang', region: 'Gia Lai & Kon Tum' },
];

export const INITIAL_USERS: User[] = [
  // Cấp 1: "Tôi" (Giám đốc kinh doanh / Head of Sales)
  {
    id: 'user_director',
    name: 'Nguyễn Văn Bê (Tôi)',
    email: 'director.be@salesfinance.vn',
    code: 'HEAD-001',
    role: 'DIRECTOR',
    phone: '0903 888 999',
    region: 'Toàn Quốc (Khối Kinh Doanh Tài Chính)',
    managedSupervisorIds: ['GS01', 'GS02', 'GS03', 'GS04', 'GS05'],
  },
  // Cấp 2: 5 Giám sát bán hàng
  ...INITIAL_SUPERVISORS.map((gs) => ({
    id: gs.userId,
    name: gs.name,
    email: `${gs.code.toLowerCase()}@salesfinance.vn`,
    code: gs.code,
    role: 'SUPERVISOR' as const,
    phone: '0912 345 678',
    region: gs.region,
    managedTeamleadIds: gs.teamleadIds,
  })),
  // Cấp 3: 22 Teamlead
  ...INITIAL_TEAMLEADS.map((tl) => ({
    id: tl.userId,
    name: tl.name,
    email: `${tl.code.toLowerCase()}@salesfinance.vn`,
    code: tl.code,
    role: 'TEAMLEAD' as const,
    phone: '0988 123 456',
    region: tl.region,
    supervisorId: tl.supervisorId,
  })),
];

// Thiết lập ban đầu các chỉ số Quản trị:
// - Số code HĐLĐ đang active
// - Số CTV hiện hữu
// - Mục tiêu doanh số tháng (Target Volume VNĐ, Target Loans, Target App)
export const INITIAL_ADMIN_SETTINGS: AdminSettings[] = INITIAL_TEAMLEADS.map((tl, index) => {
  // Phân bổ hợp lý theo khu vực và quy mô nhóm
  const baseActiveStaff = 10 + (index % 5) * 2; // 10 - 18 HĐLĐ active
  const baseExistingAgents = 18 + (index % 6) * 3; // 18 - 33 CTV hiện hữu
  const targetLoans = 35 + (index % 5) * 5; // 35 - 55 HĐ giải ngân
  const targetVolume = targetLoans * 45000000; // ~1.575 tỷ - 2.475 tỷ VNĐ
  const targetApp = Math.round(targetLoans * 2.5); // Tỷ lệ duyệt giải ngân ~40%

  return {
    teamleadId: tl.id,
    activeContractStaff: baseActiveStaff,
    existingAgents: baseExistingAgents,
    targetVolume: targetVolume,
    targetLoans: targetLoans,
    targetApp: targetApp,
    updatedAt: '2026-10-01 08:30:00',
    updatedBy: 'Nguyễn Văn Bê (Tôi)',
  };
});

// Sinh bộ dữ liệu báo cáo phong phú cho tháng hiện tại (2026-10)
export function generateInitialReports(): DailyReport[] {
  const reports: DailyReport[] = [];
  const currentDateStr = '2026-10-30'; // Ngày hôm nay theo hệ thống
  const daysInMonthToGenerate = 30;

  INITIAL_TEAMLEADS.forEach((tl, tlIndex) => {
    // Mỗi teamlead có hiệu suất khác nhau một chút để bảng thi đua có tính thực tế
    const performanceFactor = 0.85 + (tlIndex % 6) * 0.08; // 0.85 - 1.25

    for (let day = 1; day <= daysInMonthToGenerate; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const reportDate = `2026-10-${dayStr}`;

      // Đối với ngày hôm nay (day 30), giả lập một số teamlead đã báo cáo (khoảng 16/22) và một số chưa báo cáo
      if (day === 30 && tlIndex % 4 === 1 && tlIndex > 10) {
        // Chưa nộp hôm nay để test trạng thái Chưa nộp
        continue;
      }

      // Số liệu báo cáo hàng ngày tiêu biểu
      // App: 1 - 5 hồ sơ / ngày
      // Loans: 1 - 3 hợp đồng / ngày
      // Loan size trung bình ~42 triệu VNĐ
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      const baseApp = isWeekend ? Math.floor(1 + Math.random() * 2) : Math.floor(2 + (tlIndex % 3) + Math.random() * 2);
      const loans = Math.min(baseApp, Math.max(0, Math.floor(baseApp * 0.45 * performanceFactor)));
      const avgLoanAmount = 42000000 + ((tlIndex * 7) % 15) * 1000000;
      const volume = loans * avgLoanAmount;

      // Nhân sự mới & Kích hoạt code: thỉnh thoảng có người mới
      const hasNewHld = day % 8 === (tlIndex % 7) ? 1 : 0;
      const hasNewCtv = day % 5 === (tlIndex % 5) ? Math.floor(1 + Math.random() * 2) : 0;
      const activeCodeHld = loans > 0 && day % 6 === 2 ? 1 : 0;
      const activeCodeCtv = loans > 0 && day % 4 === 1 ? Math.floor(1 + Math.random() * 2) : (hasNewCtv > 0 && Math.random() > 0.5 ? 1 : 0);

      reports.push({
        id: `rep_${tl.id}_${reportDate}`,
        teamleadId: tl.id,
        date: reportDate,
        app: baseApp,
        loans: loans,
        volume: volume,
        newContractStaff: hasNewHld,
        newAgents: hasNewCtv,
        activeCodeContractStaff: activeCodeHld,
        activeCodeAgents: activeCodeCtv,
        note: day === 30 ? 'Báo cáo ngày đạt mục tiêu tiến độ tuần.' : undefined,
        submittedAt: `${reportDate} 17:${15 + (tlIndex % 40)}:00`,
        submittedBy: tl.name,
      });
    }
  });

  return reports;
}

export const INITIAL_REPORTS = generateInitialReports();

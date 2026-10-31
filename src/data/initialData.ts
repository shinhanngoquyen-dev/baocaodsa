import { User, SupervisorInfo, TeamleadInfo, AdminSettings, DailyReport } from '../types';

export const INITIAL_SUPERVISORS: SupervisorInfo[] = [
  {
    id: 'GS01',
    userId: 'user_vinhphuc',
    username: 'vinhphuc',
    name: 'Giám Sát Vĩnh Phúc',
    code: 'GS-VP-01',
    region: 'Khu Vực Vĩnh Phúc',
    teamleadIds: ['TL01', 'TL02', 'TL03', 'TL04'],
  },
  {
    id: 'GS02',
    userId: 'user_thainguyen',
    username: 'thainguyen',
    name: 'Giám Sát Thái Nguyên',
    code: 'GS-TN-02',
    region: 'Khu Vực Thái Nguyên',
    teamleadIds: ['TL05', 'TL06', 'TL07', 'TL08'],
  },
  {
    id: 'GS03',
    userId: 'user_hanoi1',
    username: 'hanoi1',
    name: 'Giám Sát Hà Nội 1',
    code: 'GS-HN-03',
    region: 'Khu Vực Hà Nội 1',
    teamleadIds: ['TL09', 'TL10', 'TL11'],
  },
];

// Đúng chuẩn tròn 11 Teamlead
export const INITIAL_TEAMLEADS: TeamleadInfo[] = [
  // 1. Nhánh Vĩnh Phúc (4 TL)
  {
    id: 'TL01',
    userId: 'user_tl01',
    username: 'tl01',
    name: 'Nguyễn Đức Hùng',
    birthday: '1993-04-12',
    phone: '0981 123 001',
    code: 'TL-VP-01',
    supervisorId: 'GS01',
    supervisorName: 'Giám Sát Vĩnh Phúc',
    region: 'Vĩnh Yên (Vĩnh Phúc)',
  },
  {
    id: 'TL02',
    userId: 'user_tl02',
    username: 'tl02',
    name: 'Trần Thị Lan Anh',
    birthday: '1995-08-25',
    phone: '0981 123 002',
    code: 'TL-VP-02',
    supervisorId: 'GS01',
    supervisorName: 'Giám Sát Vĩnh Phúc',
    region: 'Phúc Yên (Vĩnh Phúc)',
  },
  {
    id: 'TL03',
    userId: 'user_tl03',
    username: 'tl03',
    name: 'Lê Hoàng Nam',
    birthday: '1992-11-03',
    phone: '0981 123 003',
    code: 'TL-VP-03',
    supervisorId: 'GS01',
    supervisorName: 'Giám Sát Vĩnh Phúc',
    region: 'Bình Xuyên (Vĩnh Phúc)',
  },
  {
    id: 'TL04',
    userId: 'user_tl04',
    username: 'tl04',
    name: 'Phạm Thu Trang',
    birthday: '1996-02-19',
    phone: '0981 123 004',
    code: 'TL-VP-04',
    supervisorId: 'GS01',
    supervisorName: 'Giám Sát Vĩnh Phúc',
    region: 'Vĩnh Tường (Vĩnh Phúc)',
  },

  // 2. Nhánh Thái Nguyên (4 TL)
  {
    id: 'TL05',
    userId: 'user_tl05',
    username: 'tl05',
    name: 'Vũ Tuấn Anh',
    birthday: '1991-09-15',
    phone: '0982 456 005',
    code: 'TL-TN-05',
    supervisorId: 'GS02',
    supervisorName: 'Giám Sát Thái Nguyên',
    region: 'TP. Thái Nguyên Trung Tâm',
  },
  {
    id: 'TL06',
    userId: 'user_tl06',
    username: 'tl06',
    name: 'Hoàng Mỹ Linh',
    birthday: '1994-12-08',
    phone: '0982 456 006',
    code: 'TL-TN-06',
    supervisorId: 'GS02',
    supervisorName: 'Giám Sát Thái Nguyên',
    region: 'Sông Công (Thái Nguyên)',
  },
  {
    id: 'TL07',
    userId: 'user_tl07',
    username: 'tl07',
    name: 'Đỗ Minh Quân',
    birthday: '1993-07-22',
    phone: '0982 456 007',
    code: 'TL-TN-07',
    supervisorId: 'GS02',
    supervisorName: 'Giám Sát Thái Nguyên',
    region: 'Phổ Yên (Thái Nguyên)',
  },
  {
    id: 'TL08',
    userId: 'user_tl08',
    username: 'tl08',
    name: 'Bùi Khánh Huyền',
    birthday: '1997-03-30',
    phone: '0982 456 008',
    code: 'TL-TN-08',
    supervisorId: 'GS02',
    supervisorName: 'Giám Sát Thái Nguyên',
    region: 'Đại Từ (Thái Nguyên)',
  },

  // 3. Nhánh Hà Nội 1 (3 TL)
  {
    id: 'TL09',
    userId: 'user_tl09',
    username: 'tl09',
    name: 'Đặng Quang Huy',
    birthday: '1992-06-14',
    phone: '0983 789 009',
    code: 'TL-HN-09',
    supervisorId: 'GS03',
    supervisorName: 'Giám Sát Hà Nội 1',
    region: 'Cầu Giấy & Nam Từ Liêm',
  },
  {
    id: 'TL10',
    userId: 'user_tl10',
    username: 'tl10',
    name: 'Ngô Thị Bích Thảo',
    birthday: '1995-10-18',
    phone: '0983 789 010',
    code: 'TL-HN-10',
    supervisorId: 'GS03',
    supervisorName: 'Giám Sát Hà Nội 1',
    region: 'Đống Đa & Thanh Xuân',
  },
  {
    id: 'TL11',
    userId: 'user_tl11',
    username: 'tl11',
    name: 'Trịnh Đình Dũng',
    birthday: '1990-01-26',
    phone: '0983 789 011',
    code: 'TL-HN-11',
    supervisorId: 'GS03',
    supervisorName: 'Giám Sát Hà Nội 1',
    region: 'Hà Đông & Hoàng Mai',
  },
];

export const INITIAL_USERS: User[] = [
  // Cấp 1: "Tôi" - SM (Sales Manager - Đức Hải)
  {
    id: 'user_admin',
    username: 'admin',
    password: 'duchai168',
    name: 'Đức Hải (SM)',
    birthday: '1988-10-15',
    email: 'admin@salenorth1.vn',
    code: 'SM-001',
    role: 'DIRECTOR',
    phone: '0903 888 168',
    region: 'Toàn Vùng Sale North 1 (Vĩnh Phúc · Thái Nguyên · Hà Nội 1)',
    managedSupervisorIds: ['GS01', 'GS02', 'GS03'],
  },
  // Cấp 2: 3 Giám sát với username: vinhphuc, thainguyen, hanoi1
  ...INITIAL_SUPERVISORS.map((gs) => ({
    id: gs.userId,
    username: gs.username,
    password: '123',
    name: gs.name,
    birthday: '1989-05-20',
    email: `${gs.username}@salesfinance.vn`,
    code: gs.code,
    role: 'SUPERVISOR' as const,
    phone: '0912 345 678',
    region: gs.region,
    managedTeamleadIds: gs.teamleadIds,
  })),
  // Cấp 3: 11 Teamlead
  ...INITIAL_TEAMLEADS.map((tl) => ({
    id: tl.userId,
    username: tl.username,
    password: '123',
    name: tl.name,
    birthday: tl.birthday,
    email: `${tl.username}@salesfinance.vn`,
    code: tl.code,
    role: 'TEAMLEAD' as const,
    phone: tl.phone || '0988 123 456',
    region: tl.region,
    supervisorId: tl.supervisorId,
  })),
];

// Thiết lập ban đầu các chỉ số Quản trị cho 11 Teamlead
export const INITIAL_ADMIN_SETTINGS: AdminSettings[] = INITIAL_TEAMLEADS.map((tl, index) => {
  const baseActiveStaff = 10 + (index % 4) * 2; // 10 - 16 HĐLĐ active
  const baseExistingAgents = 20 + (index % 5) * 3; // 20 - 32 CTV hiện hữu
  const targetLoans = 35 + (index % 4) * 5; // 35 - 50 HĐ giải ngân
  const targetVolume = targetLoans * 45000000; // ~1.575 tỷ - 2.25 tỷ VNĐ
  const targetApp = Math.round(targetLoans * 2.5);

  return {
    teamleadId: tl.id,
    activeContractStaff: baseActiveStaff,
    existingAgents: baseExistingAgents,
    targetVolume: targetVolume,
    targetLoans: targetLoans,
    targetApp: targetApp,
    updatedAt: '2026-10-01 08:30:00',
    updatedBy: 'Đức Hải (Admin)',
  };
});

// Sinh bộ dữ liệu báo cáo 2 ca cho 11 Teamlead
export function generateInitialReports(): DailyReport[] {
  const reports: DailyReport[] = [];
  const daysInMonthToGenerate = 30;

  INITIAL_TEAMLEADS.forEach((tl, tlIndex) => {
    const performanceFactor = 0.9 + (tlIndex % 5) * 0.08;

    for (let day = 1; day <= daysInMonthToGenerate; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const reportDate = `2026-10-${dayStr}`;

      // Đối với ngày hôm nay (day 30):
      // - 7 TL đã nộp đủ cả 2 ca (Ca 1 trước 12h và Ca 2 trước 19h)
      // - 2 TL thiếu Ca 2 (chưa nộp ca 19h: TL04, TL08)
      // - 1 TL thiếu Ca 1 (chưa nộp ca 12h: TL02)
      // - 1 TL thiếu cả 2 ca (TL10)
      let submitShift1 = true;
      let submitShift2 = true;

      if (day === 30) {
        if (tlIndex === 3 || tlIndex === 7) {
          submitShift2 = false; // Thiếu ca 19h
        } else if (tlIndex === 1) {
          submitShift1 = false; // Thiếu ca 12h
        } else if (tlIndex === 9) {
          submitShift1 = false;
          submitShift2 = false; // Thiếu cả 2 ca
        }
      }

      const isWeekend = day % 7 === 0 || day % 7 === 6;
      const baseAppTotal = isWeekend ? Math.floor(1 + Math.random() * 2) : Math.floor(2 + (tlIndex % 3) + Math.random() * 2);
      const totalLoans = Math.min(baseAppTotal, Math.max(0, Math.floor(baseAppTotal * 0.45 * performanceFactor)));
      const avgLoanAmount = 42000000 + ((tlIndex * 7) % 15) * 1000000;
      
      const app1 = Math.floor(baseAppTotal / 2);
      const loans1 = Math.floor(totalLoans / 2);
      const vol1 = loans1 * avgLoanAmount;

      const app2 = baseAppTotal - app1;
      const loans2 = totalLoans - loans1;
      const vol2 = loans2 * avgLoanAmount;

      const hasNewHld = day % 8 === (tlIndex % 7) ? 1 : 0;
      const hasNewCtv = day % 5 === (tlIndex % 5) ? Math.floor(1 + Math.random() * 2) : 0;
      const activeCodeHld = totalLoans > 0 && day % 6 === 2 ? 1 : 0;
      const activeCodeCtv = totalLoans > 0 && day % 4 === 1 ? Math.floor(1 + Math.random() * 2) : (hasNewCtv > 0 && Math.random() > 0.5 ? 1 : 0);

      // Ca 1 (Trước 12h)
      if (submitShift1) {
        reports.push({
          id: `rep_${tl.id}_${reportDate}_shift1`,
          teamleadId: tl.id,
          date: reportDate,
          shift: 'SHIFT_12H',
          app: app1,
          loans: loans1,
          volume: vol1,
          newContractStaff: hasNewHld,
          newAgents: 0,
          activeCodeContractStaff: activeCodeHld,
          activeCodeAgents: 0,
          note: day === 30 ? 'Chốt số ca sáng trước 12h' : undefined,
          submittedAt: `${reportDate} 11:${20 + (tlIndex % 35)}:00`,
          submittedBy: tl.name,
        });
      }

      // Ca 2 (Trước 19h)
      if (submitShift2) {
        reports.push({
          id: `rep_${tl.id}_${reportDate}_shift2`,
          teamleadId: tl.id,
          date: reportDate,
          shift: 'SHIFT_19H',
          app: app2,
          loans: loans2,
          volume: vol2,
          newContractStaff: 0,
          newAgents: hasNewCtv,
          activeCodeContractStaff: 0,
          activeCodeAgents: activeCodeCtv,
          note: day === 30 ? 'Chốt số ca chiều trước 19h' : undefined,
          submittedAt: `${reportDate} 18:${10 + (tlIndex % 45)}:00`,
          submittedBy: tl.name,
        });
      }
    }
  });

  return reports;
}

export const INITIAL_REPORTS = generateInitialReports();

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserCheck,
  Building2,
  ShieldCheck,
  Edit2,
  Save,
  CheckCircle,
  Calendar,
  Phone,
  KeyRound,
  Search,
  UserPlus,
  Plus,
  ArrowLeft,
  AlertCircle,
  Target,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
}) => {
  const {
    users,
    supervisors,
    updateUserProfile,
    createNewSupervisor,
    createNewTeamlead,
  } = useApp();

  // Mode: 'EDIT' (chỉnh sửa nhân sự hiện có) | 'CREATE_TEAMLEAD' | 'CREATE_SUPERVISOR'
  const [mode, setMode] = useState<'EDIT' | 'CREATE_TEAMLEAD' | 'CREATE_SUPERVISOR'>('EDIT');

  const [selectedUser, setSelectedUser] = useState<User | null>(() => {
    if (targetUserId) {
      return users.find((u) => u.id === targetUserId) || null;
    }
    return users.find((u) => u.role === 'TEAMLEAD') || users[0];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleTab, setRoleTab] = useState<'ALL' | UserRole>('ALL');

  // Form edit fields
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [region, setRegion] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [password, setPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Form creation fields
  const [createName, setCreateName] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('123');
  const [createCode, setCreateCode] = useState('');
  const [createRegion, setCreateRegion] = useState('');
  const [createBirthday, setCreateBirthday] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createSupervisorId, setCreateSupervisorId] = useState('');
  const [createTargetVolume, setCreateTargetVolume] = useState('1500000000');
  const [createActiveStaff, setCreateActiveStaff] = useState('4');

  const [createError, setCreateError] = useState('');
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // Default supervisor for new teamleads
  useEffect(() => {
    if (supervisors.length > 0 && !createSupervisorId) {
      setCreateSupervisorId(supervisors[0].id);
    }
  }, [supervisors, createSupervisorId]);

  // When selected user changes, populate the edit form
  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name || '');
      setBirthday(selectedUser.birthday || '');
      setPhone(selectedUser.phone || '');
      setCode(selectedUser.code || '');
      setRegion(selectedUser.region || '');
      setSupervisorId(selectedUser.supervisorId || supervisors[0]?.id || '');
      setPassword(selectedUser.password || '123');
    }
  }, [selectedUser, supervisors]);

  if (!isOpen) return null;

  const handleSelectUser = (u: User) => {
    setSelectedUser(u);
    setMode('EDIT');
    setIsSaved(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateUserProfile(selectedUser.id, {
      name,
      birthday,
      phone,
      code,
      region,
      supervisorId: selectedUser.role === 'TEAMLEAD' ? supervisorId : undefined,
      password,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleCreateTeamleadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccessMsg('');

    if (!createName.trim() || !createUsername.trim() || !createCode.trim()) {
      setCreateError('Vui lòng điền đầy đủ Họ tên, Username và Mã Code cho Teamlead.');
      return;
    }

    if (!createSupervisorId) {
      setCreateError('Vui lòng chọn Giám Sát trực thuộc (Line báo cáo).');
      return;
    }

    const res = createNewTeamlead({
      name: createName,
      username: createUsername,
      code: createCode,
      region: createRegion || 'Miền Bắc',
      supervisorId: createSupervisorId,
      birthday: createBirthday,
      phone: createPhone,
      password: createPassword,
      targetVolume: Number(createTargetVolume) || 1500000000,
      activeContractStaff: Number(createActiveStaff) || 4,
    });

    if (res.success) {
      setCreateSuccessMsg(res.message);
      // Reset form
      setCreateName('');
      setCreateUsername('');
      setCreateCode('');
      setCreateRegion('');
      setCreateBirthday('');
      setCreatePhone('');
      // Switch to edit newly created user
      setTimeout(() => {
        setMode('EDIT');
        setCreateSuccessMsg('');
      }, 2000);
    } else {
      setCreateError(res.message);
    }
  };

  const handleCreateSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccessMsg('');

    if (!createName.trim() || !createUsername.trim() || !createCode.trim()) {
      setCreateError('Vui lòng điền đầy đủ Họ tên, Username và Mã Code cho Giám Sát.');
      return;
    }

    const res = createNewSupervisor({
      name: createName,
      username: createUsername,
      code: createCode,
      region: createRegion || 'Miền Bắc',
      birthday: createBirthday,
      phone: createPhone,
      password: createPassword,
    });

    if (res.success) {
      setCreateSuccessMsg(res.message);
      setCreateName('');
      setCreateUsername('');
      setCreateCode('');
      setCreateRegion('');
      setCreateBirthday('');
      setCreatePhone('');
      setTimeout(() => {
        setMode('EDIT');
        setCreateSuccessMsg('');
      }, 2000);
    } else {
      setCreateError(res.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleTab !== 'ALL' && u.role !== roleTab) return false;
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Quản Trị Nhân Sự: Chỉnh Sửa & Tuyển Thêm Giám Sát, Teamlead
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quyền Admin: Chỉnh sửa thông tin nhân viên hoặc tạo thêm Teamlead & Giám Sát mới với line báo cáo chính xác
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Tabs */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('EDIT');
                setCreateError('');
                setCreateSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'EDIT'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Danh Sách & Sửa Thông Tin ({users.length})
            </button>

            <button
              onClick={() => {
                setMode('CREATE_TEAMLEAD');
                setCreateError('');
                setCreateSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'CREATE_TEAMLEAD'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Tuyển Thêm Teamleader
            </button>

            <button
              onClick={() => {
                setMode('CREATE_SUPERVISOR');
                setCreateError('');
                setCreateSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'CREATE_SUPERVISOR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              + Tuyển Thêm Giám Sát
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Hiện có: <strong className="text-slate-800 dark:text-slate-200">{supervisors.length} Giám Sát</strong> · <strong className="text-slate-800 dark:text-slate-200">{users.filter(u => u.role === 'TEAMLEAD').length} Teamlead</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 grow overflow-hidden">
          
          {/* Left: User List (Visible in EDIT mode) */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col max-h-[350px] md:max-h-none overflow-hidden bg-slate-50/50 dark:bg-slate-950/30">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setRoleTab('ALL')}
                  className={`flex-1 py-1 rounded font-semibold text-center cursor-pointer ${
                    roleTab === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Tất cả ({users.length})
                </button>
                <button
                  onClick={() => setRoleTab('SUPERVISOR')}
                  className={`flex-1 py-1 rounded font-semibold text-center cursor-pointer ${
                    roleTab === 'SUPERVISOR' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Giám Sát ({supervisors.length})
                </button>
                <button
                  onClick={() => setRoleTab('TEAMLEAD')}
                  className={`flex-1 py-1 rounded font-semibold text-center cursor-pointer ${
                    roleTab === 'TEAMLEAD' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Teamlead ({users.filter(u => u.role === 'TEAMLEAD').length})
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, mã..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-y-auto grow p-2 space-y-1">
              {filteredUsers.map((u) => {
                const isSelected = mode === 'EDIT' && selectedUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 dark:bg-slate-800 px-1 py-0.2 rounded">
                          {u.username}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {u.role === 'DIRECTOR'
                          ? 'SM (Admin)'
                          : u.role === 'SUPERVISOR'
                          ? 'Giám Sát'
                          : 'Teamleader'} · {u.code} · {u.region || 'Miền Bắc'}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Conditional Forms */}
          <div className="md:col-span-7 p-6 overflow-y-auto">
            
            {/* VIEW 1: CREATE NEW TEAMLEAD */}
            {mode === 'CREATE_TEAMLEAD' && (
              <form onSubmit={handleCreateTeamleadSubmit} className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-600" />
                    Tuyển Thêm Teamleader Mới (Gán Line Báo Cáo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tạo tài khoản Teamlead mới và chọn Giám Sát trực thuộc để tự động cộng dồn doanh số vào line báo cáo.
                  </p>
                </div>

                {createError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                {createSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{createSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Họ và tên */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Họ và Tên Teamlead (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Văn Nam"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username Đăng Nhập (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createUsername}
                      onChange={(e) => setCreateUsername(e.target.value)}
                      placeholder="Ví dụ: tl12"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mật Khẩu Đăng Nhập:
                    </label>
                    <input
                      type="text"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Mặc định: 123"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Mã Code */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mã Code Quản Lý (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createCode}
                      onChange={(e) => setCreateCode(e.target.value)}
                      placeholder="Ví dụ: TL12 hoặc TL-HN-04"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Khu vực */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Khu Vực Phụ Trách:
                    </label>
                    <input
                      type="text"
                      value={createRegion}
                      onChange={(e) => setCreateRegion(e.target.value)}
                      placeholder="Ví dụ: Cầu Giấy, Vĩnh Tường..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* CHỌN GIÁM SÁT TRỰC THUỘC (LINE BÁO CÁO) */}
                  <div className="sm:col-span-2 p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/80">
                    <label className="block font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Trực Thuộc Giám Sát Nào (Line Báo Cáo *):
                    </label>
                    <select
                      value={createSupervisorId}
                      onChange={(e) => setCreateSupervisorId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-amber-600 cursor-pointer text-xs"
                    >
                      {supervisors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code} · Khu vực: {s.region})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1">
                      💡 <strong>Quan trọng:</strong> Toàn bộ doanh số báo cáo hàng ngày (App, Loans, Volume, Kích hoạt code) của Teamlead này sẽ tự động đổ vào cây phân cấp và bảng tổng hợp của Giám Sát được chọn.
                    </p>
                  </div>

                  {/* Ngày sinh nhật */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Ngày Sinh Nhật:
                    </label>
                    <input
                      type="date"
                      value={createBirthday}
                      onChange={(e) => setCreateBirthday(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* SĐT */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Số Điện Thoại:
                    </label>
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="0981 xxx xxx"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Mục tiêu tháng ban đầu */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      Mục Tiêu Doanh Số Tháng (VNĐ):
                    </label>
                    <input
                      type="number"
                      step="50000000"
                      value={createTargetVolume}
                      onChange={(e) => setCreateTargetVolume(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Số code HĐLĐ ban đầu */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Số Code HĐLĐ Active Ban Đầu:
                    </label>
                    <input
                      type="number"
                      value={createActiveStaff}
                      onChange={(e) => setCreateActiveStaff(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('EDIT')}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Hủy / Về Danh Sách
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Lưu & Kích Hoạt Teamlead Vào Hệ Thống
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 2: CREATE NEW SUPERVISOR */}
            {mode === 'CREATE_SUPERVISOR' && (
              <form onSubmit={handleCreateSupervisorSubmit} className="space-y-4">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Tuyển Thêm Giám Sát Bán Hàng Mới
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tạo tài khoản Giám Sát mới để quản lý khu vực địa bàn và các Teamlead cấp dưới.
                  </p>
                </div>

                {createError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                {createSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{createSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Họ và tên */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Họ và Tên Giám Sát (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Minh Khang"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username Đăng Nhập (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createUsername}
                      onChange={(e) => setCreateUsername(e.target.value)}
                      placeholder="Ví dụ: phutho, bacninh, hanoi2"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mật Khẩu Đăng Nhập:
                    </label>
                    <input
                      type="text"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Mặc định: 123"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  {/* Mã Code */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mã Code Giám Sát (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createCode}
                      onChange={(e) => setCreateCode(e.target.value)}
                      placeholder="Ví dụ: GS04, GS05"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  {/* Khu vực */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Khu Vực Phụ Trách (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={createRegion}
                      onChange={(e) => setCreateRegion(e.target.value)}
                      placeholder="Ví dụ: Khu vực Phú Thọ, Bắc Ninh..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  {/* Ngày sinh nhật */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Ngày Sinh Nhật:
                    </label>
                    <input
                      type="date"
                      value={createBirthday}
                      onChange={(e) => setCreateBirthday(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* SĐT */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Số Điện Thoại:
                    </label>
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="0912 xxx xxx"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('EDIT')}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Hủy / Về Danh Sách
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Lưu & Kích Hoạt Giám Sát Vào Hệ Thống
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 3: EDIT EXISTING STAFF */}
            {mode === 'EDIT' && (
              selectedUser ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Edit2 className="w-4 h-4 text-emerald-600" />
                        Chỉnh Sửa Thông Tin: {selectedUser.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        Username: {selectedUser.username} · Vai trò: {selectedUser.role}
                      </span>
                    </div>

                    {isSaved && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                        <CheckCircle className="w-4 h-4" /> Đã lưu thông tin!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Họ và tên */}
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Họ và Tên Nhân Viên:
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    {/* Ngày sinh nhật */}
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Ngày Sinh Nhật:
                      </label>
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Số Điện Thoại:
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0981 123 456"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    {/* Mã nhân viên */}
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Mã Code Quản Lý:
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="TL-VP-01"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    {/* Mật khẩu đăng nhập */}
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        Mật Khẩu Đăng Nhập:
                      </label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    {/* Khu vực */}
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Khu Vực Phụ Trách:
                      </label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="Vĩnh Yên (Vĩnh Phúc)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    {/* Giám Sát Quản Lý (Line Báo Cáo cho Teamlead) */}
                    {selectedUser.role === 'TEAMLEAD' && (
                      <div className="sm:col-span-2 p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <label className="block font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          Trực Thuộc Giám Sát (Line Báo Cáo):
                        </label>
                        <select
                          value={supervisorId}
                          onChange={(e) => setSupervisorId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 cursor-pointer font-medium"
                        >
                          {supervisors.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.code} · Khu vực: {s.region})
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-1">
                          Chuyển đổi Giám sát sẽ tự động điều chỉnh line báo cáo của Teamlead này trên bảng tổng hợp và sơ đồ hình cây.
                        </p>
                      </div>
                    )}

                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Lưu Thay Đổi Thông Tin
                    </button>
                  </div>

                </form>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Chọn một nhân viên bên trái để xem và sửa thông tin
                </div>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

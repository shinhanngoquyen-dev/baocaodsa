import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Building2,
  UserCheck,
  Check,
  RotateCcw,
  Search,
  KeyRound,
  Calendar,
  Phone,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  RefreshCw,
  User,
} from 'lucide-react';
import { UserRole } from '../types';
import { formatDateVN } from '../utils/formatters';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUserManagement?: () => void;
  onOpenTeamleadProfile?: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  isOpen,
  onClose,
  onOpenUserManagement,
  onOpenTeamleadProfile,
}) => {
  const {
    currentUser,
    users,
    supervisors,
    teamleads,
    switchUser,
    loginWithCredentials,
    resetMonthSales,
    resetToDefaultData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<UserRole | 'LOGIN'>('DIRECTOR');
  const [search, setSearch] = useState('');

  // Admin password verification state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState('');

  // Reset status toast
  const [resetMessage, setResetMessage] = useState('');

  // Login form state for LOGIN tab
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  // Handle direct Admin verification in DIRECTOR tab
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPasswordError('');

    const res = loginWithCredentials('admin', adminPasswordInput);
    if (res.success) {
      setAdminPasswordInput('');
      onClose();
    } else {
      setAdminPasswordError('Mật khẩu Admin không chính xác. Vui lòng thử lại!');
    }
  };

  // Handle Login form submit in LOGIN tab
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = loginWithCredentials(loginUsername, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message || 'Đăng nhập không thành công. Kiểm tra lại tên đăng nhập hoặc mật khẩu.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'LOGIN') return false;
    const matchesTab = u.role === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      (u.region && u.region.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const handleSelectUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    // If selecting Admin and not currently admin, require admin password!
    if (target?.role === 'DIRECTOR' && currentUser.role !== 'DIRECTOR') {
      setActiveTab('DIRECTOR');
      setAdminPasswordError('Vui lòng nhập mật khẩu Admin để truy cập vai trò Quản Trị Viên.');
      return;
    }
    switchUser(id);
    onClose();
  };

  const handleResetMonth = () => {
    if (window.confirm('XÁC NHẬN CUỐI THÁNG:\nBạn có chắc chắn muốn reset toàn bộ số liệu báo cáo doanh số của 11 team về 0 để bắt đầu chu kỳ tháng mới?\n(Chỉ Admin mới có quyền thực hiện thao tác này)')) {
      const res = resetMonthSales();
      if (res.success) {
        setResetMessage(res.message);
        setTimeout(() => setResetMessage(''), 3000);
      }
    }
  };

  const adminUser = users.find((u) => u.role === 'DIRECTOR') || users[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Đăng Nhập & Chuyển Đổi Tài Khoản Phân Quyền
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hệ thống 3 cấp: Tôi (SM - Admin bảo mật), {supervisors.length} Giám sát, và {teamleads.length} Teamlead
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('DIRECTOR');
                setAdminPasswordError('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'DIRECTOR'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tôi (SM)</span>
              {currentUser.role !== 'DIRECTOR' && (
                <Lock className="w-3 h-3 text-amber-500 ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('SUPERVISOR')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SUPERVISOR'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              {supervisors.length} Giám Sát
            </button>
            <button
              onClick={() => setActiveTab('TEAMLEAD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'TEAMLEAD'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              {teamleads.length} Teamleaders
            </button>
            <button
              onClick={() => setActiveTab('LOGIN')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LOGIN'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              Đăng Nhập Mật Khẩu
            </button>
          </div>

          {activeTab !== 'LOGIN' && activeTab !== 'DIRECTOR' && (
            <div className="relative w-full sm:w-48 mt-2 sm:mt-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc mã..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Tab 1: DIRECTOR (TÔI - ADMIN) WITH STRICT PASSWORD PROTECTION */}
        {activeTab === 'DIRECTOR' ? (
          currentUser.role === 'DIRECTOR' ? (
            /* Already logged in as Admin */
            <div className="p-6 grow flex flex-col justify-center max-w-lg mx-auto w-full space-y-5">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {adminUser.name.charAt(0)}
                </div>
                <div className="grow">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {adminUser.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {adminUser.username}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Đang kích hoạt Admin
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex flex-wrap items-center gap-x-2">
                    <span>{adminUser.region}</span>
                    {adminUser.birthday && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono-numbers">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDateVN(adminUser.birthday)}
                        </span>
                      </>
                    )}
                    {adminUser.phone && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {adminUser.phone}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Bạn đang ở phiên làm việc của SM (Sales Manager - Đức Hải). Có toàn quyền quản lý mục tiêu doanh số tháng, điều chỉnh thông tin {teamleads.length} Teamlead & {supervisors.length} Giám sát, và thực hiện reset doanh số cuối tháng.
                  </p>
                </div>
              </div>

              {resetMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                  {resetMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                {onOpenUserManagement && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUserManagement();
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Sửa Thông Tin Nhân Viên
                  </button>
                )}

                <button
                  onClick={handleResetMonth}
                  className="py-2 px-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Chỉ Admin mới có quyền reset doanh số vào cuối tháng"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Doanh Số Cuối Tháng
                </button>

                <button
                  onClick={() => {
                    // Lock session by switching to a teamlead
                    switchUser('tl_01');
                    onClose();
                  }}
                  className="py-2 px-3 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Thoát quyền Admin để tránh teamlead bấm vào thay đổi số liệu khi rời máy"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Khóa Quyền Admin
                </button>
              </div>
            </div>
          ) : (
            /* NON-ADMIN TRYING TO ACCESS ADMIN: MUST REQUIRE PASSWORD (NO HINTS!) */
            <div className="p-6 grow flex flex-col justify-center max-w-md mx-auto w-full">
              <form onSubmit={handleAdminVerify} className="space-y-4">
                <div className="text-center mb-1">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center mb-2 shadow-xs">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Yêu Cầu Mật Khẩu Admin (Tôi)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Vai trò Admin có quyền thay đổi mục tiêu tháng và chỉnh sửa thông tin toàn bộ nhân viên. Vui lòng nhập mật khẩu xác thực để kích hoạt:
                  </p>
                </div>

                {adminPasswordError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminPasswordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu tài khoản <span className="font-bold text-slate-900 dark:text-white">admin</span>:
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        setAdminPasswordError('');
                      }}
                      placeholder="Nhập mật khẩu admin..."
                      className="w-full px-3 py-2.5 pr-10 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Xác Nhận & Mở Quyền Admin
                </button>
              </form>
            </div>
          )
        ) : activeTab === 'LOGIN' ? (
          /* Tab LOGIN: Direct Login Form */
          <div className="p-6 grow flex flex-col justify-center max-w-md mx-auto w-full">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Đăng Nhập Tài Khoản Hệ Thống
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đăng nhập theo tài khoản được phân quyền
                </p>
              </div>

              {loginError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 text-center">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên đăng nhập (Username):
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin, vinhphuc, thainguyen, hanoi1..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Đăng Nhập
              </button>
            </form>
          </div>
        ) : (
          /* User list for 3 Giám Sát or 11 Teamlead */
          <div className="p-4 overflow-y-auto space-y-2 grow">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Không tìm thấy người dùng phù hợp.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = currentUser.id === user.id;
                const isTeamlead = user.role === 'TEAMLEAD';
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {user.username}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {user.code}
                          </span>
                          {isSelected && (
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Đang dùng
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                          <span>{user.region}</span>
                          {user.birthday && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-mono-numbers">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                Sinh nhật: {formatDateVN(user.birthday)}
                              </span>
                            </>
                          )}
                          {user.phone && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {user.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && isTeamlead && onOpenTeamleadProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenTeamleadProfile();
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Tự sửa ngày sinh nhật và số điện thoại"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Sửa Ngày Sinh / SĐT</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUser(user.id);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Đang kích hoạt' : 'Chọn vai này'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal Footer: CHỈ ADMIN MỚI ĐƯỢC RESET DOANH SỐ */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentUser.role === 'DIRECTOR' ? (
              <>
                {onOpenUserManagement && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUserManagement();
                    }}
                    className="px-3 py-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Sửa Thông Tin Nhân Viên
                  </button>
                )}

                <button
                  onClick={handleResetMonth}
                  className="px-3 py-1 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Chỉ Admin mới có quyền reset doanh số cuối tháng"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Doanh Số Cuối Tháng
                </button>
              </>
            ) : currentUser.role === 'TEAMLEAD' && onOpenTeamleadProfile ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenTeamleadProfile();
                }}
                className="px-3 py-1 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Sửa Ngày Sinh Nhật & SĐT Của Tôi
              </button>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

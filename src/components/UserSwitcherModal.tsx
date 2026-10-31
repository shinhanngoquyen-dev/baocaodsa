import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Building2, UserCheck, Check, RotateCcw, Search } from 'lucide-react';
import { UserRole } from '../types';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users, switchUser, supervisors, resetToDefaultData } = useApp();
  const [activeTab, setActiveTab] = useState<UserRole>('DIRECTOR');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const matchesTab = u.role === activeTab;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.code.toLowerCase().includes(search.toLowerCase()) ||
      (u.region && u.region.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleSelectUser = (id: string) => {
    switchUser(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Chuyển Đổi Người Dùng & Phân Quyền
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn tài khoản để trải nghiệm giao diện và quyền hạn của từng cấp (Tôi, Giám sát, Teamlead)
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
          <div className="flex gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('DIRECTOR')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'DIRECTOR'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Tôi (Giám Đốc)
            </button>
            <button
              onClick={() => setActiveTab('SUPERVISOR')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'SUPERVISOR'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              5 Giám Sát Bán Hàng
            </button>
            <button
              onClick={() => setActiveTab('TEAMLEAD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'TEAMLEAD'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              22 Teamleaders
            </button>
          </div>

          <div className="relative w-full sm:w-52 mt-2 sm:mt-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-slate-400"
            />
          </div>
        </div>

        {/* User list */}
        <div className="p-4 overflow-y-auto space-y-2 grow">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Không tìm thấy người dùng phù hợp.
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = currentUser.id === user.id;
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
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {user.code}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Đang dùng
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {user.region} · {user.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Đang kích hoạt' : 'Chọn vai trò này'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Reset Demo */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục toàn bộ số liệu về dữ liệu ban đầu?')) {
                resetToDefaultData();
                onClose();
              }
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục dữ liệu mẫu ban đầu
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Target,
  Rocket,
  Shield,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatCurrencyShort,
  formatNumber,
  formatDateVN,
} from '../utils/formatters';

export const DailyHonorBoard: React.FC = () => {
  const { filteredDailyRows, selectedDate, supervisors } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');

  // Filter rows by branch if selected
  const branchFilteredRows = selectedBranch === 'ALL'
    ? filteredDailyRows
    : filteredDailyRows.filter((r) => r.supervisorId === selectedBranch);

  // Sort daily rows by Amount descending to find top performers
  const sortedByAmount = [...branchFilteredRows]
    .filter((r) => r.amount > 0 || r.loans > 0)
    .sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return b.loans - a.loans;
    });

  const top1 = sortedByAmount[0];
  const top2 = sortedByAmount[1];
  const top3 = sortedByAmount[2];
  const runnerUps = sortedByAmount.slice(3, 8);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-[#0d1527] text-white border-2 border-amber-500/30 p-5 sm:p-7 shadow-2xl shadow-indigo-950/40">
      
      {/* Background ambient neon glow effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 font-black">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                  HALL OF FAME · BẢNG VINH DANH
                </span>
                <span className="px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase animate-pulse">
                  HOT 🔥
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Chiến Thần Doanh Số Ngày
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/40" />
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Vinh danh những Teamleader xuất sắc nhất ngày <strong className="text-slate-200">{formatDateVN(selectedDate)}</strong> — Bứt phá giới hạn, dẫn đầu giải ngân!
          </p>
        </div>

        {/* Branch Filter Tabs (Hiện đại, trẻ trung dạng Pill) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setSelectedBranch('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedBranch === 'ALL'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Toàn Vùng ({filteredDailyRows.length})
          </button>
          {supervisors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedBranch(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBranch === s.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {s.name.replace('Giám Sát ', '')}
            </button>
          ))}
        </div>
      </div>

      {sortedByAmount.length === 0 ? (
        <div className="relative z-10 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <Trophy className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">Chưa có phát sinh doanh số để vinh danh hôm nay</h3>
          <p className="text-xs text-slate-500 mt-1">
            Sau khi các Teamlead gửi báo cáo ca 12h hoặc 19h, bảng xếp hạng sẽ tự động cập nhật ngay lập tức.
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-6 relative z-10">
          
          {/* TOP 3 PODIUM - PHONG CÁCH HIỆN ĐẠI, TRẺ TRUNG, NỔI BẬT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            
            {/* TOP 2 - Á QUÂN (BẠC / METALLIC CYAN) */}
            {top2 && (
              <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 p-5 shadow-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-950/50 hover:-translate-y-1 order-2 md:order-1 flex flex-col justify-between">
                
                {/* Badge TOP 2 */}
                <div className="absolute -top-3.5 left-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[11px] font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wide">
                  <Medal className="w-3.5 h-3.5 text-slate-950" />
                  #2 · Á QUÂN CHIẾN THẦN
                </div>

                <div className="pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-300 font-black text-lg shadow-inner">
                      {top2.teamleadName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                        {top2.teamleadCode}
                      </span>
                      <h3 className="text-base font-extrabold text-white truncate mt-1">
                        {top2.teamleadName}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{top2.supervisorName}</p>
                    </div>
                  </div>

                  {/* Stat highlight */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                      Doanh Số Hôm Nay
                    </div>
                    <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
                      {formatCurrencyVND(top2.amount)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Hợp Đồng Loans</div>
                        <div className="text-sm font-black text-cyan-300 font-mono-numbers mt-0.5">{top2.loans} HĐ</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Hồ Sơ App</div>
                        <div className="text-sm font-black text-slate-300 font-mono-numbers mt-0.5">{top2.app} App</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span>Code kích hoạt:</span>
                      <strong className="text-cyan-300 font-mono-numbers">{top2.activeCodeContractStaff} HĐLĐ · {top2.activeCodeAgents} CTV</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOP 1 - QUÁN QUÂN (GOLD / NEON CROWN - CAO NHẤT, NỔI BẬT NHẤT) */}
            {top1 && (
              <div className="relative group rounded-3xl bg-gradient-to-b from-amber-950/80 via-slate-900/95 to-slate-950 border-2 border-amber-400 p-6 shadow-2xl shadow-amber-900/40 md:-translate-y-3 transition-all duration-300 hover:shadow-amber-500/30 order-1 md:order-2 flex flex-col justify-between">
                
                {/* Glow ring behind Top 1 */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/10 to-amber-500/20 rounded-3xl pointer-events-none" />

                {/* Ribbon Champion */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-xs font-black px-5 py-1.5 rounded-full shadow-lg shadow-amber-500/40 flex items-center gap-1.5 uppercase tracking-wider whitespace-nowrap animate-bounce duration-1000">
                  <Crown className="w-4 h-4 fill-slate-950" />
                  👑 QUÁN QUÂN DOANH SỐ NGÀY
                </div>

                <div className="pt-4 text-center">
                  {/* Avatar Avatar Halo */}
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 animate-spin blur-xs opacity-70" />
                    <div className="relative w-full h-full rounded-2xl bg-slate-950 border-2 border-amber-300 flex items-center justify-center text-amber-300 font-black text-2xl shadow-xl">
                      <Trophy className="w-10 h-10 text-amber-400 fill-amber-400/30" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shadow">
                      1
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/60 mt-1">
                    {top1.teamleadCode} · {top1.supervisorName}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                    {top1.teamleadName}
                  </h3>
                  
                  <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-extrabold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>ĐỈNH NÓC KỊCH TRẦN · BEST SELLER</span>
                  </div>

                  {/* Stat highlight */}
                  <div className="mt-4 pt-3 border-t border-amber-500/40">
                    <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                      Doanh Số Phá Kỷ Lục Ngày
                    </div>
                    <div className="text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-mono-numbers tracking-tight mt-0.5">
                      {formatCurrencyVND(top1.amount)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center">
                        <div className="text-[10px] text-amber-300 uppercase font-bold">Hợp Đồng Loans</div>
                        <div className="text-base font-black text-white font-mono-numbers mt-0.5">{top1.loans} HĐ</div>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center">
                        <div className="text-[10px] text-amber-300 uppercase font-bold">Hồ Sơ App</div>
                        <div className="text-base font-black text-white font-mono-numbers mt-0.5">{top1.app} App</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-amber-200 bg-amber-950/80 px-3.5 py-2 rounded-2xl border border-amber-500/40 font-semibold">
                      <span>Code kích hoạt:</span>
                      <strong className="text-amber-300 font-mono-numbers text-sm">{top1.activeCodeContractStaff} HĐLĐ · {top1.activeCodeAgents} CTV</strong>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TOP 3 - QUÝ QUÂN (ĐỒNG / ROSE GOLD) */}
            {top3 && (
              <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-700/40 p-5 shadow-xl transition-all duration-300 hover:border-amber-600 hover:shadow-amber-950/40 hover:-translate-y-1 order-3 md:order-3 flex flex-col justify-between">
                
                {/* Badge TOP 3 */}
                <div className="absolute -top-3.5 left-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wide">
                  <Medal className="w-3.5 h-3.5 text-amber-200" />
                  #3 · QUÝ QUÂN BỨT PHÁ
                </div>

                <div className="pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700/30 to-orange-700/30 border-2 border-amber-600/60 flex items-center justify-center text-amber-300 font-black text-lg shadow-inner">
                      {top3.teamleadName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                        {top3.teamleadCode}
                      </span>
                      <h3 className="text-base font-extrabold text-white truncate mt-1">
                        {top3.teamleadName}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{top3.supervisorName}</p>
                    </div>
                  </div>

                  {/* Stat highlight */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                      Doanh Số Hôm Nay
                    </div>
                    <div className="text-2xl font-black text-white font-mono-numbers tracking-tight mt-0.5">
                      {formatCurrencyVND(top3.amount)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Hợp Đồng Loans</div>
                        <div className="text-sm font-black text-amber-300 font-mono-numbers mt-0.5">{top3.loans} HĐ</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Hồ Sơ App</div>
                        <div className="text-sm font-black text-slate-300 font-mono-numbers mt-0.5">{top3.app} App</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span>Code kích hoạt:</span>
                      <strong className="text-amber-300 font-mono-numbers">{top3.activeCodeContractStaff} HĐLĐ · {top3.activeCodeAgents} CTV</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* TOP 4 - TOP 8 CARDS (DẠNG THẺ THỂ THAO CHIẾN BINH TRẺ TRUNG) */}
          {runnerUps.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  🔥 Top Chiến Binh Tăng Tốc Tiếp Theo (#4 – #{runnerUps.length + 3})
                </span>
                <div className="h-px bg-slate-800 grow" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {runnerUps.map((r, i) => (
                  <div
                    key={r.teamleadId}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center">
                        #{i + 4}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                        {r.teamleadCode}
                      </span>
                    </div>

                    <div className="font-extrabold text-white text-xs truncate mt-2">
                      {r.teamleadName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {r.supervisorName.replace('Giám Sát ', '')}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80">
                      <div className="text-sm font-black text-amber-300 font-mono-numbers">
                        {formatCurrencyShort(r.amount)}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 font-mono-numbers">
                        <span>{r.loans} Loans</span>
                        <span>{r.app} App</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MOTIVATIONAL FOOTER SLOGAN FROM SM */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
              <span className="text-amber-200 font-bold">
                Khẩu hiệu SM: “Nếu 1 buổi trôi qua tất cả mọi thứ đều là 0 thì điều đó thật tệ!”
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">
              Bứt phá doanh số · Vinh quang gọi tên chiến binh Sale North 1 🚀
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

import React from 'react';
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
} from 'lucide-react';
import {
  formatCurrencyVND,
  formatCurrencyShort,
  formatNumber,
  formatDateVN,
} from '../utils/formatters';

export const DailyHonorBoard: React.FC = () => {
  const { filteredDailyRows, selectedDate } = useApp();

  // Sort daily rows by Amount descending to find top performers
  const sortedByAmount = [...filteredDailyRows]
    .filter((r) => r.amount > 0 || r.loans > 0)
    .sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return b.loans - a.loans;
    });

  const top1 = sortedByAmount[0];
  const top2 = sortedByAmount[1];
  const top3 = sortedByAmount[2];
  const runnerUps = sortedByAmount.slice(3, 8);

  // Special title winners:
  // Most Loans
  const topLoansTL = [...filteredDailyRows].sort((a, b) => b.loans - a.loans)[0];
  // Most Active Codes (HĐLĐ + CTV)
  const topActiveCodeTL = [...filteredDailyRows].sort(
    (a, b) =>
      b.activeCodeContractStaff + b.activeCodeAgents - (a.activeCodeContractStaff + a.activeCodeAgents)
  )[0];
  // Disciplined (Completed both shifts earliest)
  const disciplinedTL = [...filteredDailyRows].find(
    (r) => r.shift1Reported && r.shift2Reported
  );

  return (
    <div className="bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-2xl border border-amber-500/30 p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-amber-300 tracking-wide uppercase flex items-center gap-2">
              Bảng Vinh Danh Teamleaders Bán Tốt Trong Ngày
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhận và vinh danh những cá nhân xuất sắc có thành tích App, Loans và Doanh số giải ngân dẫn đầu ngày {formatDateVN(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono-numbers">
            {sortedByAmount.length} Nhóm Phát Sinh Doanh Số
          </span>
        </div>
      </div>

      {sortedByAmount.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          Chưa có số liệu phát sinh doanh số trong ngày để xếp hạng vinh danh.
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          
          {/* Top 3 Podium (Bục Vinh Quang 1, 2, 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* Top 2 - Á Quân (Bạc) */}
            {top2 && (
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-600 shadow-md flex flex-col justify-between order-2 md:order-1 relative">
                <div className="absolute -top-3 left-4 bg-slate-300 text-slate-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Medal className="w-3 h-3 text-slate-700" /> TOP 2 · Á QUÂN
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400">{top2.teamleadCode}</span>
                  <h3 className="text-base font-bold text-white truncate mt-0.5">{top2.teamleadName}</h3>
                  <p className="text-xs text-slate-400 truncate">{top2.supervisorName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/80">
                  <div className="text-xl font-extrabold text-slate-200 font-mono-numbers">
                    {formatCurrencyVND(top2.amount)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{top2.loans} Hợp Đồng (Loans)</span>
                    <span>{top2.app} Hồ Sơ (App)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                    Code kích hoạt: {top2.activeCodeContractStaff} HĐLĐ / {top2.activeCodeAgents} CTV
                  </div>
                </div>
              </div>
            )}

            {/* Top 1 - Quán Quân (Vàng - Nổi bật nhất) */}
            {top1 && (
              <div className="bg-linear-to-b from-amber-950/70 via-slate-900 to-slate-900 rounded-2xl p-5 border-2 border-amber-400 shadow-xl shadow-amber-950/50 flex flex-col justify-between order-1 md:order-2 transform md:-translate-y-2 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                  <Crown className="w-4 h-4 fill-amber-950" /> QUÁN QUÂN DOANH SỐ NGÀY
                </div>

                <div className="pt-3 text-center">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
                    <Trophy className="w-8 h-8 fill-amber-400 text-amber-300" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                    {top1.teamleadCode}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1.5">{top1.teamleadName}</h3>
                  <p className="text-xs text-amber-200/80">{top1.supervisorName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/30 text-center">
                  <div className="text-2xl font-black text-amber-300 font-mono-numbers tracking-tight">
                    {formatCurrencyVND(top1.amount)}
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs text-amber-200/90 mt-1 font-semibold">
                    <span>{top1.loans} Loans</span>
                    <span>·</span>
                    <span>{top1.app} App</span>
                  </div>
                  <div className="mt-2.5 inline-block text-[11px] bg-emerald-950/80 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                    Kích hoạt: {top1.activeCodeContractStaff} HĐLĐ / {top1.activeCodeAgents} CTV
                  </div>
                </div>
              </div>
            )}

            {/* Top 3 - Quý Quân (Đồng) */}
            {top3 && (
              <div className="bg-slate-800/80 rounded-xl p-4 border border-amber-700/60 shadow-md flex flex-col justify-between order-3 md:order-3 relative">
                <div className="absolute -top-3 left-4 bg-amber-700 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Medal className="w-3 h-3 text-amber-200" /> TOP 3 · QUÝ QUÂN
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400">{top3.teamleadCode}</span>
                  <h3 className="text-base font-bold text-white truncate mt-0.5">{top3.teamleadName}</h3>
                  <p className="text-xs text-slate-400 truncate">{top3.supervisorName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/80">
                  <div className="text-xl font-extrabold text-amber-200 font-mono-numbers">
                    {formatCurrencyVND(top3.amount)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{top3.loans} Hợp Đồng (Loans)</span>
                    <span>{top3.app} Hồ Sơ (App)</span>
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-400 font-medium">
                    Code kích hoạt: {top3.activeCodeContractStaff} HĐLĐ / {top3.activeCodeAgents} CTV
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 3 Thẻ Danh Hiệu Đặc Biệt Trong Ngày */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* Danh hiệu 1: Vua giải ngân (Most Loans) */}
            {topLoansTL && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    Chiến Binh Giải Ngân
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {topLoansTL.teamleadName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">
                    {topLoansTL.loans} HĐ Giải Ngân ({formatCurrencyShort(topLoansTL.amount)})
                  </span>
                </div>
              </div>
            )}

            {/* Danh hiệu 2: Ngôi sao kích hoạt code */}
            {topActiveCodeTL && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Ngôi Sao Kích Hoạt Code
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {topActiveCodeTL.teamleadName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">
                    {topActiveCodeTL.activeCodeContractStaff} HĐLĐ / {topActiveCodeAgentsLabel(topActiveCodeTL)} CTV kích hoạt
                  </span>
                </div>
              </div>
            )}

            {/* Danh hiệu 3: Kỷ luật chốt 2 ca */}
            {disciplinedTL && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    Kỷ Luật Chốt Báo Cáo
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {disciplinedTL.teamleadName}
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono-numbers">
                    <CheckCircle2 className="w-3 h-3" /> Đủ 2 ca trước 12h & 19h
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Top 4 đến Top 8 vinh danh hàng ngang */}
          {runnerUps.length > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Các Nhóm Doanh Số Nổi Bật Tiếp Theo Trong Ngày
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {runnerUps.map((r, i) => (
                  <div key={r.teamleadId} className="p-2 rounded bg-slate-800/60 border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>#{i + 4}</span>
                      <span className="font-mono">{r.teamleadCode}</span>
                    </div>
                    <div className="font-bold text-white truncate mt-0.5">{r.teamleadName}</div>
                    <div className="font-bold text-amber-300 font-mono-numbers mt-1">
                      {formatCurrencyShort(r.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-numbers">
                      {r.loans} Loans
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

function topActiveCodeAgentsLabel(row: any): number {
  return row.activeCodeAgents || 0;
}

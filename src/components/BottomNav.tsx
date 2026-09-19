'use client';

import React from 'react';
import { Briefcase, Footprints, Ticket, BookOpen } from 'lucide-react';
import { AppMode } from '@/types';

interface BottomNavProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  couponCount: number;
}

export default function BottomNav({ currentMode, onModeChange, couponCount }: BottomNavProps) {
  const tabs: { mode: AppMode; label: string; icon: any; badge?: number }[] = [
    { mode: 'WORK', label: '워크스페이스', icon: Briefcase },
    { mode: 'WALK', label: '30분 코스', icon: Footprints },
    { mode: 'BENEFIT', label: '상생 혜택', icon: Ticket, badge: couponCount },
    { mode: 'MYLOG', label: '시트 방명록', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-[#0B0F19]/95 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentMode === tab.mode;
          const Icon = tab.icon;

          return (
            <button
              key={tab.mode}
              onClick={() => onModeChange(tab.mode)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{tab.label}</span>

              {/* 활성화 인디케이터 점 */}
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

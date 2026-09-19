'use client';

import React, { useState, useEffect } from 'react';
import { Sunset, Clock, Sun, CloudRain, MapPin, Sparkles, Navigation } from 'lucide-react';
import { LocationPoint } from '@/types';
import { BUSAN_HUBS } from '@/lib/busanData';

interface HeaderProps {
  selectedHub: LocationPoint;
  onSelectHub: (hub: LocationPoint) => void;
  offTime: string;
  onOffTimeChange: (time: string) => void;
  isRainy: boolean;
  onToggleWeather: () => void;
  user?: import('@/types').UserMember | null;
  onOpenLogin?: () => void;
  onUseMyLocation?: () => void;
  isLocating?: boolean;
  isUsingMyLocation?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  selectedHub,
  onSelectHub,
  offTime,
  onOffTimeChange,
  isRainy,
  onToggleWeather,
  user,
  onOpenLogin,
  onUseMyLocation,
  isLocating,
  isUsingMyLocation,
  children,
}: HeaderProps) {

  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [isPastOffTime, setIsPastOffTime] = useState<boolean>(false);

  // 퇴근 시간 카운트다운 계산
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const [hours, minutes] = offTime.split(':').map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      const diffMs = targetTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsPastOffTime(true);
        setTimeLeftStr('🎉 칼퇴 완료! 지금부터 오프스 타임');
      } else {
        setIsPastOffTime(false);
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeftStr(
          `퇴근까지 ${diffHrs > 0 ? `${diffHrs}시간 ` : ''}${diffMins}분 ${diffSecs}초`
        );
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [offTime]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-3 shadow-sm">
      {/* 최상단 브랜딩 & 날씨 토글 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-orange-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
                Off-ce BUSAN
              </h1>
            </div>
            <p className="text-[10px] text-slate-500">
              낮엔 몰입의 Office, 18시엔 낭만의 Off
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* 로그인 / 프로필 버튼 */}
          <button
            onClick={onOpenLogin}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-cyan-800 border border-slate-200 active:scale-95 transition-all shadow-sm"
          >
            {user ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[60px]">{user.name}</span>
              </>
            ) : (
              <span>로그인</span>
            )}
          </button>

          {/* 날씨 및 일몰 위젯 버튼 (클릭 시 우천/맑음 시뮬레이션 전환) */}
          <button
            onClick={onToggleWeather}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isRainy
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'bg-orange-50 text-orange-800 border border-orange-200 shadow-sm'
            }`}
            title="클릭하여 날씨 시뮬레이션 변경 (맑음/비)"
          >
            {isRainy ? (
              <>
                <CloudRain className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>19℃ 비</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-orange-500" />
                <span>23℃</span>
                <span className="text-slate-300">|</span>
                <Sunset className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] text-amber-600 font-semibold">18:42</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* 퇴근 타이머 바 & 퇴근 시간 선택 */}
      <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${isPastOffTime ? 'text-emerald-500' : 'text-cyan-600'}`} />
          <span className={`text-xs font-bold ${isPastOffTime ? 'text-emerald-600' : 'text-slate-700'}`}>
            {timeLeftStr}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <label htmlFor="offtime-select" className="text-[10px] text-slate-500">퇴근:</label>
          <select
            id="offtime-select"
            value={offTime}
            onChange={(e) => onOffTimeChange(e.target.value)}
            className="bg-white text-cyan-800 text-xs font-bold rounded-lg px-2 py-0.5 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-xs"
          >
            <option value="17:00">17:00</option>
            <option value="17:30">17:30</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
          </select>
        </div>
      </div>

      {/* 사용자 요청: 칼퇴 완료! 바로 아래 슬롯 (1시간 코스 타임어택 헤더 등) */}
      {children}

      {/* 부산 워케이션 거점 칩 목록 & 내 위치 추천 */}
      <div className="mt-2.5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] text-slate-500 flex items-center flex-shrink-0 mr-1">
          <MapPin className="w-3 h-3 mr-0.5 text-cyan-600" />
          거점:
        </span>

        {/* 내 현재 GPS 위치 버튼 */}
        {onUseMyLocation && (
          <button
            onClick={onUseMyLocation}
            disabled={isLocating}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
              isUsingMyLocation
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 ring-2 ring-cyan-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
            title="현재 내 GPS 위치 기반으로 주변 1시간 코스 추천"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin text-cyan-500' : ''}`} />
            <span>{isLocating ? '위치 감지...' : '내 위치'}</span>
          </button>
        )}

        {BUSAN_HUBS.map((hub) => {
          const isSelected = !isUsingMyLocation && selectedHub.id === hub.id;
          return (
            <button
              key={hub.id}
              onClick={() => onSelectHub(hub)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {hub.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
}

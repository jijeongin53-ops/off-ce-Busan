'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, Compass, ExternalLink, Sparkles, Coffee, Award } from 'lucide-react';
import { Workspace, TimeAttackCourse, TourSpot, LocationPoint } from '@/types';

interface MapContainerProps {
  mode: 'WORK' | 'WALK';
  selectedHub: LocationPoint;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  activeCourse: TimeAttackCourse | null;
  selectedSpot: TourSpot | null;
  onSelectSpot: (spot: TourSpot) => void;
  onOpenBenefit: () => void;
}

export default function MapContainer({
  mode,
  selectedHub,
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  activeCourse,
  selectedSpot,
  onSelectSpot,
  onOpenBenefit,
}: MapContainerProps) {
  const kakaoMapRef = useRef<HTMLDivElement>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  // 카카오맵 SDK 로드 시도
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey) return;

    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setKakaoLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="relative w-full h-80 bg-slate-950 overflow-hidden border-b border-slate-800">
      {/* 인터랙티브 맵 캔버스 영역 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0B1528] to-slate-950">
        {/* 부산 지형 무드 배경 격자 및 해안선 그래픽 */}
        <svg className="w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* 부산 바다 & 해안 웨이브 무드 */}
          <path
            d="M -50,220 Q 80,180 200,240 T 450,200 L 450,350 L -50,350 Z"
            fill="#0369A1"
            opacity="0.25"
          />
          <path
            d="M -50,250 Q 120,220 250,260 T 450,240 L 450,350 L -50,350 Z"
            fill="#0284C7"
            opacity="0.3"
          />
        </svg>

        {/* WALK 모드: 30분 타임어택 코스 라우팅 Polyline 연결선 (SVG) */}
        {mode === 'WALK' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path
              d="M 90,190 Q 190,130 310,180"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            {/* 동선 진행 애니메이션 점 */}
            <circle cx="200" cy="155" r="4" fill="#F97316">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}

        {/* WORK 모드 마커 렌더링 */}
        {mode === 'WORK' && (
          <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around z-20">
            {workspaces.slice(0, 4).map((ws, i) => {
              const isSelected = selectedWorkspace?.id === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => onSelectWorkspace(ws)}
                  style={{
                    transform: `translate(${(i % 2) * 20 - 10}px, ${i * 12 - 10}px)`,
                  }}
                  className={`group relative flex flex-col items-center transition-transform active:scale-95 ${
                    isSelected ? 'scale-110 z-30' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center space-x-1 mb-1 border transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-cyan-500/50 scale-105'
                        : 'bg-slate-900/90 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Coffee className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[80px]">{ws.name.split(' ')[0]}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'bg-cyan-500 border-white text-slate-950 ring-4 ring-cyan-500/30'
                        : 'bg-slate-800 border-cyan-400 text-cyan-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* WALK 모드: 1, 2, 3 번호 묶음 라우팅 스팟 마커 */}
        {mode === 'WALK' && activeCourse && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {activeCourse.spots.map((item, index) => {
              // 1: 맛집 (좌측), 2: 산책 (중앙 상단), 3: 숙소 (우측)
              const positions = [
                { left: '20%', top: '55%' },
                { left: '48%', top: '25%' },
                { left: '78%', top: '52%' },
              ];
              const pos = positions[index] || { left: '50%', top: '50%' };
              const isSelected = selectedSpot?.contentid === item.spot.contentid;

              return (
                <div
                  key={item.spot.contentid}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                  onClick={() => onSelectSpot(item.spot)}
                >
                  {/* 스팟 명칭 뱃지 */}
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md mb-1 whitespace-nowrap border flex items-center space-x-1 ${
                      item.step === 1
                        ? 'bg-orange-500 text-white border-orange-400'
                        : item.step === 2
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                        : 'bg-purple-600 text-white border-purple-400'
                    } ${isSelected ? 'ring-2 ring-white scale-105' : ''}`}
                  >
                    <span>
                      {item.step}. {item.role}
                    </span>
                    {item.spot.partnerBenefit && (
                      <span className="bg-yellow-400 text-slate-950 px-1 rounded text-[9px] font-black animate-bounce">
                        쿠폰
                      </span>
                    )}
                  </div>

                  {/* 마커 핀 */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shadow-lg transition-transform ${
                      item.step === 1
                        ? 'bg-gradient-to-tr from-orange-600 to-amber-400 text-white'
                        : item.step === 2
                        ? 'bg-gradient-to-tr from-cyan-600 to-sky-300 text-slate-950'
                        : 'bg-gradient-to-tr from-purple-700 to-indigo-400 text-white'
                    } ${isSelected ? 'scale-125 ring-4 ring-white/40' : 'hover:scale-110'}`}
                  >
                    {item.step}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 우측 상단 모드 & 나침반 표시 */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end space-y-1.5">
        <div className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] font-semibold text-cyan-300 flex items-center space-x-1 shadow-md">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{selectedHub.name.split(' ')[0]} 중심</span>
        </div>
        <div className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          반경 3km 마이크로 투어
        </div>
      </div>

      {/* 지도 하단: 카카오 길찾기 바로가기 바 */}
      <div className="absolute bottom-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">
            {mode === 'WORK'
              ? selectedWorkspace?.name || '워크스페이스 선택'
              : selectedSpot?.title || '타임어택 코스 동선'}
          </span>
        </div>

        {/* 카카오맵 길찾기 웹 링크 연동 */}
        <a
          href={
            selectedSpot
              ? `https://map.kakao.com/link/to/${encodeURIComponent(selectedSpot.title)},${selectedSpot.mapy},${selectedSpot.mapx}`
              : selectedWorkspace
              ? `https://map.kakao.com/link/to/${encodeURIComponent(selectedWorkspace.name)},${selectedWorkspace.lat},${selectedWorkspace.lng}`
              : `https://map.kakao.com/link/search/${encodeURIComponent(selectedHub.name)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95"
        >
          <span>카카오 길찾기</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

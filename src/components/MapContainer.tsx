'use client';

import React, { useEffect, useState } from 'react';
import { Navigation, MapPin, Compass, ExternalLink, Sparkles, Coffee, Award, Utensils, Mountain, Home as HomeIcon } from 'lucide-react';
import { Workspace, TimeAttackCourse, TourSpot, LocationPoint, CharacterProfile } from '@/types';
import { ANIMAL_SPECIES } from '@/lib/characterData';

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
  character?: CharacterProfile | null;
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
  character,
}: MapContainerProps) {
  // 사용자가 전달한 캐릭터 또는 기본 갈매기(부산부기)
  const species = character
    ? ANIMAL_SPECIES.find((a) => a.type === character.animalType) || ANIMAL_SPECIES[0]
    : ANIMAL_SPECIES[0];

  // 1. WALK 모드: 사용자 요청 4단계 흐름도 노드 데이터 구성 (1: 맛집, 2: 관광지, 3: 카페, 4: 숙소)
  const foodSpot = activeCourse?.spots.find((s) => s.role === '맛집')?.spot || activeCourse?.spots[0]?.spot;
  const tourSpot = activeCourse?.spots.find((s) => s.role === '산책/문화')?.spot || activeCourse?.spots[1]?.spot;
  const staySpot = activeCourse?.spots.find((s) => s.role === '숙소')?.spot || activeCourse?.spots[2]?.spot;

  // 카페 기본 스팟 (영도/초량 거점 맞춤)
  const cafeSpot: TourSpot = {
    contentid: 'spot-flow-cafe',
    contenttypeid: '39',
    title: selectedHub.name.includes('영도') ? '신기산업 (영도 오션뷰 카페)' : '초량 1941 (적산가옥 카페)',
    addr1: selectedHub.name.includes('영도') ? '부산광역시 영도구 와치로 51' : '부산광역시 동구 망양로 533-5',
    mapx: selectedHub.lng,
    mapy: selectedHub.lat,
    categoryLabel: '로컬 감성 카페',
    overview: '탁 트인 부산 앞바다와 함께 즐기는 시원한 드립 커피와 디저트 휴식.',
  };

  // 4개 단계 흐름도 목록 (맛집 -> 관광지 -> 카페 -> 숙소)
  const flowSteps = [
    { id: 'step-food', label: '맛집', spot: foodSpot, icon: '🍜' },
    { id: 'step-tour', label: '관광지', spot: tourSpot, icon: '🌊' },
    { id: 'step-cafe', label: '카페', spot: cafeSpot, icon: '☕' },
    { id: 'step-stay', label: '숙소', spot: staySpot, icon: '🛏️' },
  ];

  // 현재 선택된 스팟의 흐름도 인덱스 계산 (0, 1, 2, 3)
  const activeSpotIndex = Math.max(
    0,
    flowSteps.findIndex((item) => item.spot?.contentid === selectedSpot?.contentid)
  );

  // WORK 모드 흐름도 노드 (추천 워크스페이스 4선)
  const workNodes = workspaces.slice(0, 4);
  const activeWorkIndex = Math.max(
    0,
    workNodes.findIndex((ws) => ws.id === selectedWorkspace?.id)
  );

  return (
    <div className="relative w-full bg-white border-b border-slate-200 px-4 pt-3 pb-3 shadow-xs">
      {/* 상단: 거점 뱃지 및 마이크로 투어 안내 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">
            {mode === 'WALK' ? '퇴근길 30분 루트 흐름도' : '추천 워크스페이스 동선'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          <Compass className="w-3 h-3 text-cyan-600 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-bold">{selectedHub.name.split(' ')[0]} 중심</span>
        </div>
      </div>

      {/* 2. 중앙 흐름도 캔버스 영역 (수평선 + 4대 노드 + 선 위 캐릭터 위치) */}
      <div className="relative w-full py-8 my-1 flex items-center justify-center">
        {/* 중앙 관통 수평 실선 (이미지의 깔끔한 실선) */}
        <div className="absolute left-[8%] right-[8%] h-[3px] bg-slate-700 rounded-full z-0" />

        {/* WALK 모드 흐름도 노드 4종: [맛집] [관광지] [카페] [숙소] */}
        {mode === 'WALK' && (
          <div className="relative w-full flex items-center justify-between px-4 z-10">
            {flowSteps.map((step, idx) => {
              const isCurrent = activeSpotIndex === idx;
              const hasCoupon = step.spot?.partnerBenefit;

              return (
                <div
                  key={step.id}
                  onClick={() => step.spot && onSelectSpot(step.spot)}
                  className="relative flex flex-col items-center cursor-pointer group flex-1"
                >
                  {/* 현재 위치 캐릭터 표시 (선 위에서 사뿐히 떠 있음) */}
                  {isCurrent && (
                    <div className="absolute -top-14 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                      {/* 귀여운 캐릭터 아바타 */}
                      <div className="relative">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${species.baseColor} border-2 border-white shadow-md flex items-center justify-center text-xl`}
                        >
                          {species.icon}
                        </div>
                        {character && (
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full border border-white">
                            Lv.{character.level}
                          </span>
                        )}
                      </div>
                      {/* 하단 위치 가리킴 역삼각형 포인터 */}
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800 mt-0.5" />
                    </div>
                  )}

                  {/* 원형 노드 (이미지와 동일한 깔끔한 원형 디자인) */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                      isCurrent
                        ? 'bg-slate-700 border-slate-900 ring-4 ring-cyan-400/40 scale-110 shadow-lg'
                        : 'bg-[#64748B] border-slate-600 hover:bg-slate-600 shadow-md group-hover:scale-105'
                    }`}
                  >
                    <span className="text-white text-xs font-bold">{step.icon}</span>
                  </div>

                  {/* 노드 하단 텍스트 레이블 (맛집 / 관광지 / 카페 / 숙소) */}
                  <div className="mt-2.5 flex flex-col items-center">
                    <span
                      className={`text-xs font-black transition-colors ${
                        isCurrent ? 'text-slate-950 font-extrabold underline decoration-cyan-500 decoration-2' : 'text-slate-700'
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* 제휴 쿠폰 뱃지 */}
                    {hasCoupon && (
                      <span className="mt-0.5 px-1 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded shadow-xs animate-pulse">
                        쿠폰
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WORK 모드 흐름도: 워크스페이스 4종 노드 */}
        {mode === 'WORK' && (
          <div className="relative w-full flex items-center justify-between px-4 z-10">
            {workNodes.map((ws, idx) => {
              const isCurrent = activeWorkIndex === idx;

              return (
                <div
                  key={ws.id}
                  onClick={() => onSelectWorkspace(ws)}
                  className="relative flex flex-col items-center cursor-pointer group flex-1"
                >
                  {/* 현재 위치 캐릭터 표시 */}
                  {isCurrent && (
                    <div className="absolute -top-14 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                      <div className="relative">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${species.baseColor} border-2 border-white shadow-md flex items-center justify-center text-xl`}
                        >
                          {species.icon}
                        </div>
                        {character && (
                          <span className="absolute -bottom-1 -right-1 bg-cyan-600 text-white text-[9px] font-black px-1 rounded-full border border-white">
                            Lv.{character.level}
                          </span>
                        )}
                      </div>
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800 mt-0.5" />
                    </div>
                  )}

                  {/* 원형 노드 */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                      isCurrent
                        ? 'bg-cyan-600 border-cyan-800 ring-4 ring-cyan-400/40 scale-110 shadow-lg'
                        : 'bg-[#64748B] border-slate-600 hover:bg-slate-600 shadow-md group-hover:scale-105'
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-white" />
                  </div>

                  {/* 노드 하단 워크스페이스 명칭 */}
                  <div className="mt-2.5 flex flex-col items-center">
                    <span
                      className={`text-xs font-bold truncate max-w-[70px] ${
                        isCurrent ? 'text-cyan-700 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      {ws.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400">{ws.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 하단: 현재 선택된 장소 상세 명칭 & 카카오 길찾기 바로가기 바 */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-800 font-bold truncate max-w-[65%]">
          <Navigation className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
          <span className="truncate">
            {mode === 'WORK'
              ? selectedWorkspace?.name || '워크스페이스 선택'
              : selectedSpot?.title || (flowSteps[activeSpotIndex]?.spot?.title ?? '타임어택 코스')}
          </span>
        </div>

        {/* 카카오맵 길찾기 웹 링크 연동 (노란색 버튼) */}
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
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs shadow-sm transition-transform active:scale-95 flex-shrink-0"
        >
          <span>카카오 길찾기</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

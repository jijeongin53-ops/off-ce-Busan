'use client';

import React, { useEffect, useState } from 'react';
import { Navigation, MapPin, Compass, ExternalLink, Sparkles, Coffee, Award, Utensils, Camera, Bed, Building2, Laptop } from 'lucide-react';
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

  // 4개 단계 흐름도 목록 (맛집 -> 관광지 -> 카페 -> 숙소) 및 모던 벡터 아이콘
  const flowSteps = [
    { id: 'step-food', label: '맛집', spot: foodSpot, icon: Utensils },
    { id: 'step-tour', label: '관광지', spot: tourSpot, icon: Camera },
    { id: 'step-cafe', label: '카페', spot: cafeSpot, icon: Coffee },
    { id: 'step-stay', label: '숙소', spot: staySpot, icon: Bed },
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
    <div className="relative w-full bg-white border-b border-slate-200 px-4 pt-3.5 pb-3.5 shadow-xs">
      {/* 상단: 거점 뱃지 및 마이크로 투어 안내 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">
            {mode === 'WALK' ? '퇴근길 1시간 루트 흐름도' : '추천 워크스페이스 동선'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          <Compass className="w-3 h-3 text-cyan-600 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-bold">{selectedHub.name.split(' ')[0]} 중심</span>
        </div>
      </div>

      {/* 2. 중앙 흐름도 캔버스 영역 (수평선과 원형 노드 중심이 정확히 일치하는 모던 2단 레이아웃) */}
      <div className="relative w-full pt-14 pb-2">
        {/* WALK 모드 흐름도 노드 4종: [맛집] [관광지] [카페] [숙소] */}
        {mode === 'WALK' && (
          <div className="relative w-full">
            {/* 1) 원형 노드들과 선이 위치하는 라인 레이어 (높이 48px로 고정되어 수평선이 원의 정중앙을 정확히 관통) */}
            <div className="relative w-full h-12 flex items-center justify-between px-6 z-10">
              {/* 배경 관통 실선 (선택 노드 무관한 은은한 베이스 트랙) */}
              <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-[3px] bg-slate-200 rounded-full z-0" />

              {/* 현재 선택 노드까지 이어지는 모던 다크 트랙 강조선 */}
              <div
                className="absolute left-[12%] top-1/2 -translate-y-1/2 h-[3px] bg-slate-800 rounded-full z-0 transition-all duration-300"
                style={{
                  width: `${(activeSpotIndex / (flowSteps.length - 1)) * 76}%`,
                }}
              />

              {/* 4대 원형 노드 (w-12 h-12 크기로 선과 정중앙 라인이 완벽 일치) */}
              {flowSteps.map((step, idx) => {
                const isCurrent = activeSpotIndex === idx;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    onClick={() => step.spot && onSelectSpot(step.spot)}
                    className="relative z-10 flex items-center justify-center cursor-pointer group"
                  >
                    {/* 현재 위치 캐릭터 표시 (원형 노드 정중앙 바로 위에서 사뿐히 부유) */}
                    {isCurrent && (
                      <div className="absolute -top-16 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                        <div className="relative">
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${species.baseColor} border-2 border-white shadow-lg flex items-center justify-center text-xl`}
                          >
                            {species.icon}
                          </div>
                          {character && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                              Lv.{character.level}
                            </span>
                          )}
                        </div>
                        {/* 하단 위치 가리킴 역삼각형 포인터 */}
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-800 mt-0.5" />
                      </div>
                    )}

                    {/* 모던 원형 노드: Active는 모던 다크 슬레이트, Inactive는 클린 화이트 */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isCurrent
                          ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-900/10 shadow-lg scale-105'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 shadow-xs group-hover:scale-105'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isCurrent ? 'text-white stroke-[2.2]' : 'text-slate-500 stroke-[1.8]'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2) 노드 하단 텍스트 레이블 및 쿠폰 뱃지 행 */}
            <div className="w-full flex items-start justify-between px-6 mt-3">
              {flowSteps.map((step, idx) => {
                const isCurrent = activeSpotIndex === idx;
                const hasCoupon = step.spot?.partnerBenefit;

                return (
                  <div
                    key={`label-${step.id}`}
                    onClick={() => step.spot && onSelectSpot(step.spot)}
                    className="w-12 flex flex-col items-center cursor-pointer text-center"
                  >
                    <span
                      className={`text-xs transition-colors ${
                        isCurrent
                          ? 'text-slate-950 font-black tracking-tight'
                          : 'text-slate-500 font-semibold hover:text-slate-800'
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* 모던한 제휴 쿠폰 뱃지 */}
                    {hasCoupon && (
                      <span className="mt-1 px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold rounded-full shadow-xs">
                        쿠폰
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WORK 모드 흐름도: 워크스페이스 4종 노드 */}
        {mode === 'WORK' && (
          <div className="relative w-full">
            <div className="relative w-full h-12 flex items-center justify-between px-6 z-10">
              <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-[3px] bg-slate-200 rounded-full z-0" />
              <div
                className="absolute left-[12%] top-1/2 -translate-y-1/2 h-[3px] bg-cyan-600 rounded-full z-0 transition-all duration-300"
                style={{
                  width: `${(activeWorkIndex / (workNodes.length - 1 || 1)) * 76}%`,
                }}
              />

              {workNodes.map((ws, idx) => {
                const isCurrent = activeWorkIndex === idx;

                return (
                  <div
                    key={ws.id}
                    onClick={() => onSelectWorkspace(ws)}
                    className="relative z-10 flex items-center justify-center cursor-pointer group"
                  >
                    {isCurrent && (
                      <div className="absolute -top-16 flex flex-col items-center animate-bounce z-30 pointer-events-none">
                        <div className="relative">
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${species.baseColor} border-2 border-white shadow-lg flex items-center justify-center text-xl`}
                          >
                            {species.icon}
                          </div>
                          {character && (
                            <span className="absolute -bottom-1 -right-1 bg-cyan-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                              Lv.{character.level}
                            </span>
                          )}
                        </div>
                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-cyan-700 mt-0.5" />
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isCurrent
                          ? 'bg-cyan-600 border-cyan-600 text-white ring-4 ring-cyan-600/15 shadow-lg scale-105'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 shadow-xs group-hover:scale-105'
                      }`}
                    >
                      <Coffee className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex items-start justify-between px-6 mt-3">
              {workNodes.map((ws, idx) => {
                const isCurrent = activeWorkIndex === idx;

                return (
                  <div
                    key={`ws-label-${ws.id}`}
                    onClick={() => onSelectWorkspace(ws)}
                    className="w-14 flex flex-col items-center cursor-pointer text-center"
                  >
                    <span
                      className={`text-xs truncate max-w-[64px] ${
                        isCurrent ? 'text-cyan-700 font-extrabold' : 'text-slate-600 font-medium'
                      }`}
                    >
                      {ws.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{ws.category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. 하단: 현재 선택된 장소 상세 명칭 & 카카오 길찾기 바로가기 바 */}
      <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between">
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

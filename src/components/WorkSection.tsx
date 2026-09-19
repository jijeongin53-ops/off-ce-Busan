'use client';

import React, { useState } from 'react';
import { Zap, Wifi, VolumeX, Waves, Star, Clock, MapPin, Database, Check } from 'lucide-react';
import { Workspace } from '@/types';

interface WorkSectionProps {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  isFromGoogle: boolean;
}

export default function WorkSection({
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  isFromGoogle,
}: WorkSectionProps) {
  const [filterOutlet, setFilterOutlet] = useState<boolean>(false);
  const [filterQuiet, setFilterQuiet] = useState<boolean>(false);
  const [filterOcean, setFilterOcean] = useState<boolean>(false);

  // 필터링 적용
  const filteredWorkspaces = workspaces.filter((ws) => {
    if (filterOutlet && !ws.features.hasOutlet) return false;
    if (filterQuiet && !ws.features.isQuiet) return false;
    if (filterOcean && !ws.features.hasOceanView) return false;
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* 상단 섹션 타이틀 및 구글 시트 상태 안내 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
            <h2 className="text-base font-extrabold text-slate-800">
              [WORK] 몰입 워크스페이스
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            노트북 작업 환경이 검증된 로컬 오피스 & 카페
          </p>
        </div>

        {/* 구글 시트 백엔드 연동 뱃지 */}
        <div
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
            isFromGoogle
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-cyan-800 border-slate-200'
          }`}
          title="구글 스프레드시트 15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk 연동"
        >
          <Database className="w-3 h-3 text-emerald-600" />
          <span>{isFromGoogle ? 'Google 시트 연동됨' : '구글 시트 백엔드'}</span>
        </div>
      </div>

      {/* 워크스페이스 특화 필터 토글 칩 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFilterOutlet(!filterOutlet)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all flex-shrink-0 ${
            filterOutlet
              ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ 콘센트 좌석</span>
        </button>

        <button
          onClick={() => setFilterQuiet(!filterQuiet)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all flex-shrink-0 ${
            filterQuiet
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>🤫 조용한 몰입</span>
        </button>

        <button
          onClick={() => setFilterOcean(!filterOcean)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all flex-shrink-0 ${
            filterOcean
              ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>🌊 오션뷰 힐링</span>
        </button>
      </div>

      {/* 워크스페이스 리스트 */}
      <div className="space-y-3">
        {filteredWorkspaces.map((ws) => {
          const isSelected = selectedWorkspace?.id === ws.id;
          return (
            <div
              key={ws.id}
              onClick={() => onSelectWorkspace(ws)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-50/50 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex space-x-3">
                {/* 썸네일 이미지 */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={ws.imageUrl}
                    alt={ws.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[9px] font-bold text-cyan-800 shadow-xs">
                    {ws.category}
                  </div>
                </div>

                {/* 상세 텍스트 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {ws.name}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-700">{ws.rating}</span>
                      <span className="text-[10px] text-slate-400">({ws.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {ws.description}
                  </p>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-2">
                    <div className="flex items-center space-x-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{ws.openHours}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{ws.address}</span>
                    </div>
                  </div>

                  {/* 장점 태그 */}
                  <div className="flex items-center space-x-1.5 mt-2">
                    {ws.features.hasOutlet && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                        ⚡ 콘센트
                      </span>
                    )}
                    {ws.features.hasWifi && (
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded border border-cyan-200">
                        📶 Wi-Fi
                      </span>
                    )}
                    {ws.features.hasOceanView && (
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                        🌊 바다조망
                      </span>
                    )}
                    {ws.features.isQuiet && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
                        🤫 조용함
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

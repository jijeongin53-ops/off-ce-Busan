'use client';

import React from 'react';
import {
  Flame,
  Clock,
  Navigation,
  Sparkles,
  Ticket,
  BookmarkPlus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sun,
  CloudRain,
  Share2,
} from 'lucide-react';
import { TimeAttackCourse, TourSpot, PartnerBenefit } from '@/types';

interface WalkSectionProps {
  course: TimeAttackCourse;
  selectedSpot: TourSpot | null;
  onSelectSpot: (spot: TourSpot) => void;
  onRefreshCourse: () => void;
  onOpenBenefitModal: (benefit: PartnerBenefit) => void;
  onOpenSaveModal: () => void;
  isRainy: boolean;
  onToggleWeather: () => void;
  loading: boolean;
}

export default function WalkSection({
  course,
  selectedSpot,
  onSelectSpot,
  onRefreshCourse,
  onOpenBenefitModal,
  onOpenSaveModal,
  isRainy,
  onToggleWeather,
  loading,
}: WalkSectionProps) {
  return (
    <div className="p-4 space-y-4">
      {/* 타임어택 헤더 & 날씨 맞춤 뱃지 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <h2 className="text-base font-extrabold text-slate-100 flex items-center space-x-1">
              <span>[WALK] 퇴근 후 30분 타임어택 코스</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            업무 공간에서 30분 이내로 이어지는 선(Line) 단위 로컬 라우팅
          </p>
        </div>

        {/* 새로고침 버튼 */}
        <button
          onClick={onRefreshCourse}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors active:scale-95"
          title="다른 코스 조합 추천받기"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* 코스 요약 배너 */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/50 via-slate-900 to-cyan-950/40 border border-orange-500/30 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              {course.theme}
            </span>
            <div className="flex items-center space-x-1 text-xs text-orange-300 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>약 {course.estimatedMinutes}분 코스</span>
              <span className="text-slate-600">|</span>
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300">{course.totalDistanceKm}km</span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {course.title}
          </h3>
        </div>

        <button
          onClick={onOpenSaveModal}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1 shadow-md active:scale-95 flex-shrink-0 ml-2"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
          <span>코스저장</span>
        </button>
      </div>

      {/* ★ 사용자 추가 요청: 부산 체험 & F&B 기업 상생 마케팅 할인권 배너 ★ */}
      {course.partnerBenefit && (
        <div
          onClick={() => onOpenBenefitModal(course.partnerBenefit!)}
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/40 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                    로컬 기업 제휴 혜택
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">
                    {course.partnerBenefit.businessName}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {course.partnerBenefit.title} ({course.partnerBenefit.discountRate})
                </p>
              </div>
            </div>
            <div className="flex items-center text-amber-400 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
              <span>쿠폰받기</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* 1, 2, 3단계 스팟 카드 리스트 */}
      <div className="space-y-2.5 relative">
        {/* 연결 선 (타임라인 스타일) */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500 via-cyan-400 to-purple-500 -z-0 opacity-40" />

        {course.spots.map((item) => {
          const isSelected = selectedSpot?.contentid === item.spot.contentid;
          return (
            <div
              key={item.spot.contentid}
              onClick={() => onSelectSpot(item.spot)}
              className={`relative z-10 p-3.5 rounded-2xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-slate-800/95 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* 단계 번호 핀 */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md ${
                    item.step === 1
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-400 text-white'
                      : item.step === 2
                      ? 'bg-gradient-to-tr from-cyan-600 to-sky-400 text-slate-950'
                      : 'bg-gradient-to-tr from-purple-700 to-indigo-400 text-white'
                  }`}
                >
                  {item.step}
                </div>

                {/* 스팟 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.step === 1
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : item.step === 2
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {item.role}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.spot.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-1 truncate">
                    {item.spot.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.spot.overview}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                    <span className="truncate max-w-[200px]">{item.spot.addr1}</span>
                    <a
                      href={`https://map.kakao.com/link/to/${encodeURIComponent(item.spot.title)},${item.spot.mapy},${item.spot.mapx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 font-semibold flex items-center hover:underline"
                    >
                      <span>길안내</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                {/* 썸네일 */}
                {item.spot.firstimage && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                    <img
                      src={item.spot.firstimage}
                      alt={item.spot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

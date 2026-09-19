'use client';

import React, { useState, useEffect } from 'react';
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
  Volume2,
  Square,
  Play,
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
  onUseMyLocation?: () => void;
  isLocating?: boolean;
  isUsingMyLocation?: boolean;
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
  onUseMyLocation,
  isLocating,
  isUsingMyLocation,
}: WalkSectionProps) {
  // 실제 오디오 도슨트 재생 상태 (재생 중인 스팟 contentid)
  const [playingSpotId, setPlayingSpotId] = useState<string | null>(null);

  // 컴포넌트 언마운트 시 음성 자동 정지
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 실제 오디오 도슨트 재생/정지 핸들러 (Web Speech API 활용한 고품질 한국어 음성 실시간 낭독)
  const handleToggleAudio = (spotId: string, scriptText: string, audioUrl?: string) => {
    if (typeof window === 'undefined') return;

    // 이미 재생 중인 경우 정지
    if (playingSpotId === spotId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingSpotId(null);
      return;
    }

    // 이전 재생 중인 음성 정지
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingSpotId(spotId);

    // 1) 브라우저 Web Speech API로 실제 한국어 음성 도슨트 출력
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(scriptText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.92; // 감미롭고 차분한 도슨트 해설 톤
      utterance.pitch = 1.0;

      // 한국어 음성 우선 매핑
      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find((v) => v.lang.includes('ko') || v.lang.includes('KR'));
      if (koVoice) {
        utterance.voice = koVoice;
      }

      utterance.onend = () => {
        setPlayingSpotId(null);
      };

      utterance.onerror = () => {
        setPlayingSpotId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else if (audioUrl) {
      // 2) Fallback: HTML5 Audio 객체 재생
      try {
        const audio = new Audio(audioUrl);
        audio.play().catch(() => {});
        audio.onended = () => setPlayingSpotId(null);
      } catch (e) {
        setPlayingSpotId(null);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 타임어택 헤더 & 현재 위치 추천 버튼 (상단 "칼퇴 완료! 바로 아래"로 이동됨) */}

      {/* 코스 요약 배너 */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-cyan-50 border border-orange-200 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
              {course.theme}
            </span>
            <div className="flex items-center space-x-1 text-xs text-orange-800 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>약 {course.estimatedMinutes}분 코스</span>
              <span className="text-slate-300">|</span>
              <Navigation className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-cyan-700">{course.totalDistanceKm}km</span>
            </div>
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            {course.title}
          </h3>
        </div>

        <button
          onClick={onOpenSaveModal}
          className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-cyan-700 border border-cyan-300 text-xs font-bold flex items-center space-x-1 shadow-sm active:scale-95 flex-shrink-0 ml-2"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-cyan-600" />
          <span>코스저장</span>
        </button>
      </div>

      {/* ★ 사용자 추가 요청: 부산 체험 & F&B 기업 상생 마케팅 할인권 배너 (사용자 요청으로 비표시 처리) ★ */}
      {/* {course.partnerBenefit && (
        <div
          onClick={() => onOpenBenefitModal(course.partnerBenefit!)}
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border border-amber-200 cursor-pointer hover:border-amber-300 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded">
                    로컬 기업 제휴 혜택
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">
                    {course.partnerBenefit.businessName}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {course.partnerBenefit.title} ({course.partnerBenefit.discountRate})
                </p>
              </div>
            </div>
            <div className="flex items-center text-amber-600 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
              <span>쿠폰받기</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      )} */}

      {/* 1, 2, 3단계 스팟 카드 리스트 */}
      <div className="space-y-2.5 relative">
        {/* 연결 선 (타임라인 스타일) */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-400 via-cyan-400 to-purple-400 -z-0 opacity-40" />

        {course.spots.map((item) => {
          const isSelected = selectedSpot?.contentid === item.spot.contentid;
          return (
            <div
              key={item.spot.contentid}
              onClick={() => onSelectSpot(item.spot)}
              className={`relative z-10 p-3.5 rounded-2xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-50/40 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* 단계 번호 핀 */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md ${
                    item.step === 1
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-400 text-white'
                      : item.step === 2
                      ? 'bg-gradient-to-tr from-cyan-600 to-sky-400 text-white'
                      : 'bg-gradient-to-tr from-purple-700 to-indigo-500 text-white'
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
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : item.step === 2
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {item.role}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.spot.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
                    {item.spot.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.spot.overview}
                  </p>

                  {/* ★ 한국관광공사 두루누비(Durunubi) 공인 도보길 뱃지 연동 ★ */}
                  {item.step === 2 && item.spot.durunubiInfo && (
                    <div className="mt-2 p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-[11px] space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-cyan-800 font-bold">
                        <span>🚶 두루누비 공인 코스:</span>
                        <span className="text-slate-900">{item.spot.durunubiInfo.themeNm}</span>
                        <span className="text-cyan-600 font-normal">
                          ({item.spot.durunubiInfo.crsTotlRqrmHour} / {item.spot.durunubiInfo.crsDstnc})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate">
                        {item.spot.durunubiInfo.crsSummary}
                      </p>
                    </div>
                  )}

                  {/* ★ 한국관광공사 오디(Odii) 1분 퇴근길 오디오 도슨트 플레이어 연동 ★ */}
                  {item.step === 2 && item.spot.audioGuide && (
                    <div className="mt-2 p-2.5 rounded-xl bg-purple-50/90 border border-purple-200 text-[11px] shadow-xs transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-purple-900 font-bold">
                          <Volume2
                            className={`w-4 h-4 text-purple-600 flex-shrink-0 ${
                              playingSpotId === item.spot.contentid ? 'animate-bounce text-purple-800' : ''
                            }`}
                          />
                          <span className="truncate max-w-[170px]">{item.spot.audioGuide.audioTitle}</span>
                          <span className="text-[10px] text-purple-600 font-semibold flex-shrink-0">
                            ({item.spot.audioGuide.duration})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAudio(
                              item.spot.contentid,
                              item.spot.audioGuide?.scriptContent || '부산의 아름다운 풍경과 함께하는 힐링 오디오 가이드입니다.',
                              item.spot.audioGuide?.audioUrl
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-white text-[10px] font-bold shadow-xs active:scale-95 transition-all flex items-center space-x-1 flex-shrink-0 ${
                            playingSpotId === item.spot.contentid
                              ? 'bg-rose-500 hover:bg-rose-600 ring-2 ring-rose-300 animate-pulse'
                              : 'bg-purple-600 hover:bg-purple-500'
                          }`}
                        >
                          {playingSpotId === item.spot.contentid ? (
                            <>
                              <Square className="w-2.5 h-2.5 fill-current" />
                              <span>정지 ■</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>도슨트 듣기 ▶</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 italic leading-relaxed bg-white/70 p-1.5 rounded-lg border border-purple-100">
                        "{item.spot.audioGuide.scriptContent}"
                      </p>

                      {/* 실제 음성 재생 중 상태 인디케이터 */}
                      {playingSpotId === item.spot.contentid && (
                        <div className="mt-1.5 flex items-center space-x-1.5 text-[10px] text-purple-800 font-bold animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-purple-600" />
                          <span>🎧 오디오 도슨트가 음성으로 실제 재생되고 있습니다...</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[200px]">{item.spot.addr1}</span>
                    <a
                      href={`https://map.kakao.com/link/to/${encodeURIComponent(item.spot.title)},${item.spot.mapy},${item.spot.mapx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-600 font-semibold flex items-center hover:underline"
                    >
                      <span>길안내</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                {/* 썸네일 */}
                {item.spot.firstimage && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
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

'use client';

import React, { useState } from 'react';
import { Database, ExternalLink, Star, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';
import { WorkationLog } from '@/types';

interface LogSectionProps {
  onOpenSaveModal: () => void;
  isFromGoogle: boolean;
}

// 실시간 시트 피드 시뮬레이션 및 데이터
const MOCK_LOGS: WorkationLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-19 15:40',
    userName: '영도바다러버',
    workspaceName: '블루포트 2021 (영도 청학동)',
    visitedCourseTitle: '영도 해안절벽 노을 & 삼진어묵 코스',
    rating: 5,
    reviewComment: '바다 바로 앞에서 코딩하고 18시 칼퇴 후 흰여울 산책했어요. 삼진어묵 15% 쿠폰 쏠쏠했습니다!',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-19 14:15',
    userName: '칼퇴왕김대리',
    workspaceName: '부산 워케이션 거점센터 (아스티호텔 24F)',
    visitedCourseTitle: '원도심 이바구길 산복도로 야경 코스',
    rating: 5,
    reviewComment: '아스티호텔 24층 뷰 미쳤습니다. 모노레일 타고 올라간 산복도로 야경 최고!',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-19 11:20',
    userName: '디지털노마드정',
    workspaceName: '노티스 (쌀창고 카페)',
    visitedCourseTitle: '남포 부평 깡통야시장 로컬 맥주 코스',
    rating: 5,
    reviewComment: '남포비어 무료 에일맥주 쿠폰으로 하루의 피로를 싹 풀었습니다. 뚜벅이 코스로 완벽해요.',
  },
];

export default function LogSection({ onOpenSaveModal, isFromGoogle }: LogSectionProps) {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk/edit?gid=0#gid=0';

  return (
    <div className="p-4 space-y-4">
      {/* 구글 시트 백엔드 연동 정보 카드 */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              Google Sheet 데이터베이스
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isFromGoogle
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isFromGoogle ? '실시간 동기화' : 'API 백엔드 대기'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          앱에서 남긴 방문 기록과 추천 평점은 구글 스프레드시트에 즉시 기록되어 관리자 분석 및 통계로 활용됩니다.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
            봇: sheet-bot@peo-schedule...
          </span>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-cyan-400 font-bold hover:underline"
          >
            <span>스프레드시트 열기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 7개 시트 탭 자동 분기 저장 구조 안내 */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
              자동 분기 저장 시트 탭 (7종)
            </span>
          </div>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
            자동 매핑 완료
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-400">1. Users_Members</span>
              <p className="text-[11px] text-slate-400">회원 가입 마스터 ([회사명][이름][직책][연락처][이메일])</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">11개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-teal-400">2. Point_Logs</span>
              <p className="text-[11px] text-slate-400">활동 포인트 적립 및 SD 캐릭터 성장/의상 로그</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">8개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-400">3. Workspaces</span>
              <p className="text-[11px] text-slate-400">부산 원도심 워크스페이스 마스터 (카페·오피스)</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">14개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-orange-400">4. TimeAttackCourses</span>
              <p className="text-[11px] text-slate-400">30분 타임어택 퇴근길 코스 조합 이력</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">11개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-400">5. PartnerBenefits</span>
              <p className="text-[11px] text-slate-400">부산 체험 & F&B 로컬 기업 마케팅 제휴 혜택</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">9개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-400">6. CouponLogs</span>
              <p className="text-[11px] text-slate-400">할인 쿠폰 발급 및 코드 복사 실시간 로그</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">6개 열</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-purple-400">7. Guestbook_Reviews</span>
              <p className="text-[11px] text-slate-400">노마드 방문 후기, 별점 및 퇴근길 소감</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">6개 열</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
          💡 <strong>구글 시트 10초 자동 세팅 팁:</strong> 구글 시트 상단의 <code>확장 프로그램 ➔ Apps Script</code>에 프로젝트 내 <code>scripts/google_apps_script.js</code> 코드를 붙여넣고 [실행]을 누르면 7개 탭과 헤더 서식, 초기 데이터가 1초 만에 자동 생성됩니다!
        </div>
      </div>



      {/* 방명록 작성 CTA */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>워케이션 노마드 실시간 방명록</span>
        </h3>
        <button
          onClick={onOpenSaveModal}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>기록 남기기</span>
        </button>
      </div>

      {/* 피드 목록 */}
      <div className="space-y-3">
        {MOCK_LOGS.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-cyan-300">
                  {log.userName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {log.timestamp}
                </span>
              </div>
              <div className="flex items-center space-x-0.5">
                {[...Array(log.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              📍 <span className="text-slate-400">{log.workspaceName}</span> ➔{' '}
              <span className="text-orange-400">{log.visitedCourseTitle}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              "{log.reviewComment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

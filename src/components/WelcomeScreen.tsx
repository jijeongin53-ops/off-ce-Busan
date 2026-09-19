'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartSignUp: () => void;
  onOpenLogin: () => void;
  onExplore: () => void;
}

export default function WelcomeScreen({
  onStartSignUp,
  onOpenLogin,
  onExplore,
}: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#fafbfc] flex flex-col justify-between max-w-md mx-auto px-6 pt-12 pb-8 overflow-hidden select-none">
      {/* 1. 상단 미니 브랜드 태그 */}
      <div className="flex items-center justify-center space-x-1.5 opacity-80">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
          Off-ce BUSAN • 2026 워케이션
        </span>
      </div>

      {/* 2. 중앙: 듀오링고 컨셉의 통통하고 귀여운 부산부기 마스코트 & 타이포 */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        {/* 귀여운 부산부기 SVG 캐릭터 & 그림자 */}
        <div className="relative flex flex-col items-center mb-6">
          {/* 부드러운 통통 바운스 애니메이션 */}
          <div className="animate-bounce" style={{ animationDuration: '2.5s' }}>
            <svg
              className="w-44 h-44 drop-shadow-xl"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 날개 (왼쪽 - 반갑게 흔드는 날개) */}
              <path
                d="M48 95 C30 75 25 45 42 35 C58 26 72 55 68 85 Z"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M38 55 C35 48 40 40 48 44"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* 날개 (오른쪽 - 몸에 붙은 날개) */}
              <path
                d="M152 105 C170 120 178 140 162 150 C146 160 138 135 136 115 Z"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 통통한 갈매기 몸통 */}
              <ellipse
                cx="100"
                cy="115"
                rx="62"
                ry="58"
                fill="#FFFFFF"
                stroke="#0284c7"
                strokeWidth="5"
              />

              {/* 가슴팍 연하늘색 깃털 무늬 */}
              <path
                d="M75 125 C85 135 115 135 125 125 C118 142 82 142 75 125 Z"
                fill="#e0f2fe"
              />

              {/* 머리 깃털 포인트 (바다 물결 형상) */}
              <path
                d="M90 58 C96 40 108 42 110 57"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* 초롱초롱한 커다란 눈 (듀오링고 스타일) */}
              {/* 왼쪽 눈 */}
              <ellipse cx="78" cy="100" rx="16" ry="19" fill="#0f172a" />
              <ellipse cx="82" cy="94" rx="6" ry="8" fill="#FFFFFF" />
              <circle cx="74" cy="106" r="2.5" fill="#FFFFFF" />

              {/* 오른쪽 눈 (사랑스럽게 찡긋 윙크) */}
              <path
                d="M114 100 C118 90 134 90 138 100"
                stroke="#0f172a"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* 발그레한 핑크 볼터치 */}
              <circle cx="64" cy="115" r="7" fill="#f472b6" opacity="0.6" />
              <circle cx="136" cy="115" r="7" fill="#f472b6" opacity="0.6" />

              {/* 귀여운 노란 부리 */}
              <path
                d="M93 106 Q100 98 107 106 Q100 120 93 106 Z"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* 부리 속 귀여운 입 벌림 */}
              <ellipse cx="100" cy="111" rx="3.5" ry="2" fill="#dc2626" />

              {/* 귀여운 노란 발 두 개 */}
              <ellipse
                cx="82"
                cy="174"
                rx="14"
                ry="7"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="3.5"
              />
              <ellipse
                cx="118"
                cy="174"
                rx="14"
                ry="7"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="3.5"
              />
            </svg>
          </div>

          {/* 듀오링고 스타일 타원형 바닥 그림자 */}
          <div className="w-32 h-3.5 bg-slate-200/80 rounded-full mt-1 blur-[1px]" />
        </div>

        {/* 듀오링고풍의 볼드하고 친근한 타이포그래피 */}
        <div className="text-center space-y-2 px-2">
          <h1 className="text-3xl font-black tracking-tight text-cyan-600 flex items-center justify-center space-x-1.5">
            <span>Off-ce BUSAN</span>
          </h1>
          <p className="text-sm font-extrabold text-slate-700">
            낮엔 몰입의 Office, 18시엔 낭만의 Off!
          </p>
          <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
            퇴근 후 1시간, 부산 원도심을 걷는<br />
            가장 설레는 워케이션 마이크로 투어
          </p>
        </div>
      </div>

      {/* 3. 하단: 듀오링고 스타일의 3D 입체 볼륨 버튼 2종 + 둘러보기 */}
      <div className="space-y-3 w-full">
        {/* 메인 버튼: 회원가입 (GET STARTED) */}
        <button
          onClick={onStartSignUp}
          className="w-full py-3.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm tracking-wider uppercase shadow-md border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-cyan-100 fill-current" />
          <span>새로운 워케이션 시작하기 (회원가입)</span>
        </button>

        {/* 보조 버튼: 이미 계정이 있어요 (I ALREADY HAVE AN ACCOUNT) */}
        <button
          onClick={onOpenLogin}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-cyan-800 font-black text-sm tracking-wider uppercase border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <span>이미 계정이 있어요 (로그인)</span>
        </button>

        {/* 둘러보기 링크 */}
        <div className="text-center pt-1">
          <button
            onClick={onExplore}
            className="text-xs font-bold text-slate-400 hover:text-cyan-600 transition-colors inline-flex items-center space-x-1"
          >
            <span>로그인 없이 둘러보기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
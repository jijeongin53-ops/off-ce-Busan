'use client';

import React from 'react';
import { Sparkles, Trophy, Plus, ChevronRight, LogIn, User } from 'lucide-react';
import { CharacterProfile, UserMember } from '@/types';
import { ANIMAL_SPECIES, LEVEL_REQUIREMENTS } from '@/lib/characterData';

interface CharacterWidgetProps {
  user: UserMember | null;
  character: CharacterProfile | null;
  onOpenLogin: () => void;
  onTriggerLevelUpModal?: (targetLevel: number) => void;
  onOpenProfile?: () => void;
}

export default function CharacterWidget({
  user,
  character,
  onOpenLogin,
  onTriggerLevelUpModal,
  onOpenProfile,
}: CharacterWidgetProps) {
  // 로그인하지 않은 경우 로그인 유도 카드
  if (!user || !character) {
    return (
      <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-white via-sky-50 to-cyan-50 border border-cyan-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl shadow-inner animate-pulse">
            🐱
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-800">나만의 SD 파트너를 깨워보세요</span>
              <span className="text-[10px] bg-cyan-500 text-white font-black px-1.5 rounded">
                +100P 지급
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              워케이션 활동 포인트로 귀여운 의상과 악세사리를 입혀보세요!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLogin}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex-shrink-0 ml-2"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>간편 로그인</span>
        </button>
      </div>
    );
  }

  const species = ANIMAL_SPECIES.find((a) => a.type === character.animalType) || ANIMAL_SPECIES[0];
  const currentLevel = character.level;
  const nextLevelReq = LEVEL_REQUIREMENTS[(currentLevel + 1) as keyof typeof LEVEL_REQUIREMENTS] || 2000;
  const prevLevelReq = LEVEL_REQUIREMENTS[currentLevel as keyof typeof LEVEL_REQUIREMENTS] || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((character.points - prevLevelReq) / (nextLevelReq - prevLevelReq)) * 100))
  );

  // 착용 중인 아이템 여부 확인
  const hasEquippedItems = Boolean(
    character.equipped.headwear || character.equipped.outfit || character.equipped.accessory
  );

  return (
    <div
      onClick={onOpenProfile}
      className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-white via-sky-50/70 to-cyan-50/80 border border-cyan-200/90 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md hover:border-cyan-300 transition-all group"
      title="클릭하여 캐릭터 프로필 및 착용 장비 보기"
    >
      {/* 배경 장식 광선 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          {/* 캐릭터 SD 아바타 및 레벨 뱃지 (클릭 시 프로필 열람) */}
          <div className="relative group-hover:scale-105 transition-transform">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${species.baseColor} flex items-center justify-center text-2xl shadow-md`}
            >
              {species.icon}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
              Lv.{character.level}
            </span>
          </div>

          {/* 캐릭터 정보 및 착용 아이템 */}
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                {character.name}
              </h3>
              <span className="text-[10px] text-slate-500">({user.name} 님의 파트너)</span>
              <span className="text-[9px] text-cyan-600 bg-cyan-100/70 px-1 py-0.2 rounded font-semibold flex items-center">
                프로필 ›
              </span>
            </div>

            {/* 착용 중인 아이템 태그: 모자없음이 아니고 '아이템 없음'으로 표기 */}
            <div className="flex items-center space-x-1 mt-1">
              {character.equipped.headwear && (
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                  {character.equipped.headwear}
                </span>
              )}

              {character.equipped.outfit && (
                <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded border border-sky-200 font-medium">
                  {character.equipped.outfit}
                </span>
              )}

              {character.equipped.accessory && (
                <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200 font-medium">
                  {character.equipped.accessory}
                </span>
              )}

              {!hasEquippedItems && (
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                  아이템 없음
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 포인트 잔액 뱃지 */}
        <div className="text-right">
          <span className="text-[10px] text-slate-500">성장 포인트</span>
          <div className="text-sm font-black text-amber-600 flex items-center justify-end space-x-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{character.points}P</span>
          </div>
        </div>
      </div>

      {/* 레벨업 게이지 바 */}
      <div className="mt-2.5 pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span>다음 Lv.{currentLevel + 1} 달성까지</span>
          <span className="font-semibold text-cyan-700">
            {character.points} / {nextLevelReq}P ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

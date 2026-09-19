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
}

export default function CharacterWidget({
  user,
  character,
  onOpenLogin,
  onTriggerLevelUpModal,
}: CharacterWidgetProps) {
  // 로그인하지 않은 경우 로그인 유도 카드
  if (!user || !character) {
    return (
      <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl shadow-inner animate-pulse">
            🐱
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white">나만의 SD 파트너를 깨워보세요</span>
              <span className="text-[10px] bg-cyan-500 text-slate-950 font-black px-1.5 rounded">
                +100P 지급
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              워케이션 활동 포인트로 귀여운 의상과 악세사리를 입혀보세요!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLogin}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md active:scale-95 transition-all flex-shrink-0 ml-2"
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

  return (
    <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-cyan-950/50 border border-cyan-500/40 shadow-xl relative overflow-hidden">
      {/* 배경 장식 광선 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          {/* 캐릭터 SD 아바타 및 레벨 뱃지 */}
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${species.baseColor} flex items-center justify-center text-2xl shadow-md`}
            >
              {species.icon}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
              Lv.{character.level}
            </span>
          </div>

          {/* 캐릭터 정보 및 착용 아이템 */}
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold text-white">{character.name}</h3>
              <span className="text-[10px] text-slate-400">({user.name} 님의 파트너)</span>
            </div>

            {/* 착용 중인 아이템 태그 */}
            <div className="flex items-center space-x-1 mt-1">
              {character.equipped.headwear ? (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  {character.equipped.headwear}
                </span>
              ) : (
                <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded">
                  모자 없음
                </span>
              )}

              {character.equipped.outfit && (
                <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded border border-sky-500/30">
                  {character.equipped.outfit}
                </span>
              )}

              {character.equipped.accessory && (
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                  {character.equipped.accessory}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 포인트 잔액 뱃지 */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400">성장 포인트</span>
          <div className="text-sm font-black text-amber-400 flex items-center justify-end space-x-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{character.points}P</span>
          </div>
        </div>
      </div>

      {/* 레벨업 게이지 바 */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span>다음 Lv.{currentLevel + 1} 달성까지</span>
          <span className="font-semibold text-cyan-300">
            {character.points} / {nextLevelReq}P ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { X, Sparkles, Trophy, Award, Shirt, Crown, Gift } from 'lucide-react';
import { CharacterProfile, UserMember } from '@/types';
import { ANIMAL_SPECIES, LEVEL_REQUIREMENTS } from '@/lib/characterData';

interface CharacterProfileModalProps {
  user: UserMember;
  character: CharacterProfile;
  isOpen: boolean;
  onClose: () => void;
  onTriggerLevelUpModal?: (targetLevel: number) => void;
}

export default function CharacterProfileModal({
  user,
  character,
  isOpen,
  onClose,
  onTriggerLevelUpModal,
}: CharacterProfileModalProps) {
  if (!isOpen) return null;

  const species = ANIMAL_SPECIES.find((a) => a.type === character.animalType) || ANIMAL_SPECIES[0];
  const currentLevel = character.level;
  const nextLevelReq = LEVEL_REQUIREMENTS[(currentLevel + 1) as keyof typeof LEVEL_REQUIREMENTS] || 2000;
  const prevLevelReq = LEVEL_REQUIREMENTS[currentLevel as keyof typeof LEVEL_REQUIREMENTS] || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((character.points - prevLevelReq) / (nextLevelReq - prevLevelReq)) * 100))
  );

  // 레벨별 워케이션 칭호
  const getLevelTitle = (lvl: number) => {
    switch (lvl) {
      case 1:
        return '햇병아리 워케이션러';
      case 2:
        return '부산 바다 탐험가';
      case 3:
        return '로컬 컬처 마스터';
      case 4:
        return '부산 명예 워케이션 앰버서더';
      default:
        return '워케이션 메이트';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 라벨 */}
        <div className="flex items-center space-x-1.5 text-cyan-600">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black tracking-wider uppercase">
            워케이션 파트너 프로필
          </span>
        </div>

        {/* 캐릭터 비주얼 대형 카드 */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="relative">
            {/* 대형 아바타 원형 */}
            <div
              className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${species.baseColor} flex items-center justify-center text-5xl shadow-lg border-4 border-white animate-bounce`}
              style={{ animationDuration: '3s' }}
            >
              {species.icon}
            </div>
            {/* 레벨 배지 */}
            <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-white shadow-md">
              Lv.{character.level}
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 mt-3">{character.name}</h3>
          <p className="text-xs text-cyan-700 font-bold mt-0.5 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
            {getLevelTitle(character.level)}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            소유자: <strong className="text-slate-700">{user.name}</strong> ({user.company} · {user.role})
          </p>
        </div>

        {/* 성장 게이지 바 */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-bold flex items-center space-x-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>성장 포인트</span>
            </span>
            <span className="font-extrabold text-amber-600">
              {character.points}P
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>현재 Lv.{currentLevel}</span>
            <span>다음 Lv.{currentLevel + 1} 달성까지 {nextLevelReq - character.points > 0 ? nextLevelReq - character.points : 0}P 필요</span>
          </div>
        </div>

        {/* 착용 아이템 인벤토리 슬롯 3종 */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1 mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>장착 아이템 슬롯</span>
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {/* 1) 모자 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">모자</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-base mb-1">
                🧢
              </div>
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-full">
                {character.equipped.headwear || '아이템 없음'}
              </span>
            </div>

            {/* 2) 의상 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">의상</span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-base mb-1">
                👕
              </div>
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-full">
                {character.equipped.outfit || '아이템 없음'}
              </span>
            </div>

            {/* 3) 악세사리 */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">악세사리</span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-base mb-1">
                🎒
              </div>
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-full">
                {character.equipped.accessory || '아이템 없음'}
              </span>
            </div>
          </div>
        </div>

        {/* 활동 혜택 안내 카드 */}
        <div className="mt-4 p-3 bg-cyan-50/70 border border-cyan-200 rounded-2xl text-[11px] text-cyan-900 space-y-1">
          <div className="font-bold flex items-center space-x-1 text-cyan-800">
            <Gift className="w-3.5 h-3.5 text-cyan-600" />
            <span>포인트 획득 방법</span>
          </div>
          <p className="text-[10px] text-cyan-700 leading-relaxed">
            • 워크스페이스 체크인: <strong className="font-bold">+50P</strong><br />
            • 제휴 맛집/카페 쿠폰 발급: <strong className="font-bold">+80P</strong><br />
            • 1시간 퇴근길 코스 완주 및 저장: <strong className="font-bold">+120P</strong>
          </p>
        </div>

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
}

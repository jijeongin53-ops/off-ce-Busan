'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, Check, Award } from 'lucide-react';
import { LevelRewardOption, CharacterProfile, UserMember } from '@/types';
import { LEVEL_UP_REWARDS } from '@/lib/characterData';

interface LevelUpRewardModalProps {
  user: UserMember;
  character: CharacterProfile;
  targetLevel: number; // 2, 3, 4
  isOpen: boolean;
  onRewardSelected: (reward: LevelRewardOption) => void;
}

export default function LevelUpRewardModal({
  user,
  character,
  targetLevel,
  isOpen,
  onRewardSelected,
}: LevelUpRewardModalProps) {
  const rewardGroup = LEVEL_UP_REWARDS[targetLevel];
  const [selectedReward, setSelectedReward] = useState<LevelRewardOption | null>(
    rewardGroup ? rewardGroup.options[0] : null
  );

  if (!isOpen || !rewardGroup) return null;

  const handleConfirm = async () => {
    if (!selectedReward) return;

    // 구글 시트에 레벨업 및 보상 선택 로그 기록
    try {
      await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'point',
          email: user.email,
          name: user.name,
          reason: `Lv.${targetLevel} 레벨업 달성 및 [${selectedReward.name}] 착용`,
          earnedPoints: '+0P (레벨업 보상)',
          totalPoints: character.points,
          level: `Lv.${targetLevel}`,
          equipped: selectedReward.name,
        }),
      });
    } catch (err) {
      console.warn('Level up log sheet sync error:', err);
    }

    onRewardSelected(selectedReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-amber-200 rounded-3xl p-5 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* 상단 팡파레 아이콘 */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-md shadow-amber-500/20 animate-bounce">
            🎉
          </div>
          <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
            LEVEL UP REWARD!
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            축하합니다! Lv.{targetLevel} 달성
          </h3>
          <p className="text-xs text-slate-500">
            {rewardGroup.categoryLabel}
          </p>
        </div>

        {/* 동일 카테고리 3종 선택 카드 */}
        <div className="mt-4 space-y-2.5">
          {rewardGroup.options.map((option) => {
            const isSelected = selectedReward?.id === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedReward(option)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-md scale-102'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                    isSelected
                      ? 'bg-amber-100 border-amber-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {option.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {option.name}
                    </h4>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 확정 버튼 */}
        <button
          onClick={handleConfirm}
          className="w-full mt-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>선택한 아이템으로 착용하고 레벨업 완료</span>
        </button>
      </div>
    </div>
  );
}

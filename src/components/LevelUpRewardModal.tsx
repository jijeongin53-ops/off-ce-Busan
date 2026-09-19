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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* 상단 팡파레 아이콘 */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
            🎉
          </div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            LEVEL UP REWARD!
          </span>
          <h3 className="text-lg font-black text-white">
            축하합니다! Lv.{targetLevel} 달성
          </h3>
          <p className="text-xs text-slate-400">
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
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-102'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                >
                  {option.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {option.name}
                    </h4>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
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
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>선택한 아이템으로 착용하고 레벨업 완료</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Check, ArrowRight } from 'lucide-react';
import { AnimalType, CharacterProfile, UserMember } from '@/types';
import { ANIMAL_SPECIES } from '@/lib/characterData';

interface CharacterCreateModalProps {
  user: UserMember;
  isOpen: boolean;
  onCharacterCreated: (character: CharacterProfile) => void;
}

export default function CharacterCreateModal({
  user,
  isOpen,
  onCharacterCreated,
}: CharacterCreateModalProps) {
  const [selectedType, setSelectedType] = useState<AnimalType>('seagull');
  const [charName, setCharName] = useState<string>('부산부기');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charName.trim()) {
      alert('캐릭터의 이름을 지어주세요!');
      return;
    }

    setIsSubmitting(true);
    const newCharacter: CharacterProfile = {
      animalType: selectedType,
      name: charName,
      level: 1,
      points: 100, // 시작 축하 포인트
      equipped: {},
    };

    try {
      // 구글 시트 Point_Logs에 캐릭터 생성 축하 보너스 기록
      await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'point',
          email: user.email,
          name: user.name,
          reason: '신규 가입 및 SD 캐릭터 파트너 생성 축하',
          earnedPoints: '+100P',
          totalPoints: 100,
          level: 'Lv.1',
          equipped: '기본형',
        }),
      });
    } catch (err) {
      console.warn('Character create sheet log error:', err);
    } finally {
      setIsSubmitting(false);
      onCharacterCreated(newCharacter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center space-x-2 text-amber-600">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-black tracking-wider uppercase">
            워케이션 메이트 최초 1회 생성
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
          나만의 SD 동물 파트너 선택
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          부산 워케이션 활동(체크인, 코스 완주, 로컬 쿠폰)을 통해 포인트를 모아 캐릭터를 레벨업하고 귀여운 의상을 입혀주세요!
        </p>

        {/* 동물 캐릭터 4종 선택 그리드 */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {ANIMAL_SPECIES.map((animal) => {
            const isSelected = selectedType === animal.type;
            return (
              <div
                key={animal.type}
                onClick={() => {
                  setSelectedType(animal.type);
                  if (animal.type === 'seagull') setCharName('부산부기');
                  else if (animal.type === 'seal') setCharName('자갈치포미');
                  else if (animal.type === 'cat') setCharName('초량치즈냥');
                  else if (animal.type === 'quokka') setCharName('영도루루');
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-400/20 scale-102 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* 귀여운 SD 동물 아이콘 렌더링 */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${animal.baseColor} flex items-center justify-center text-3xl shadow-inner mb-2 transform transition-transform ${
                    isSelected ? 'scale-110 rotate-3 animate-bounce' : ''
                  }`}
                >
                  {animal.icon}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{animal.name}</h4>
                <span className="text-[10px] text-cyan-700 font-bold mt-0.5">
                  {animal.tagline}
                </span>
              </div>
            );
          })}
        </div>

        {/* 선택된 캐릭터 설명 */}
        {selectedType && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            {ANIMAL_SPECIES.find((a) => a.type === selectedType)?.description}
          </div>
        )}

        {/* 캐릭터 이름 입력 폼 */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              캐릭터 애칭
            </label>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center space-x-1.5">
            <Heart className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
            <span>캐릭터 생성 완료 시 웰컴 <strong>+100P</strong> 즉시 지급!</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <span>{isSubmitting ? '파트너 생성 중...' : '파트너와 함께 오프스 시작하기'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

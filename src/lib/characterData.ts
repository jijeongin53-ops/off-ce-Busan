// SD 동물 캐릭터 및 레벨업 보상 (동일 카테고리 3종 택 1) 마스터 데이터

import { AnimalType, LevelRewardOption } from '@/types';

export interface AnimalSpeciesInfo {
  type: AnimalType;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  baseColor: string;
}

export const ANIMAL_SPECIES: AnimalSpeciesInfo[] = [
  {
    type: 'seagull',
    name: '부산 갈매기',
    tagline: '자유로운 바다의 영혼',
    description: '부산 앞바다를 훨훨 날아다니는 시원시원하고 당찬 갈매기. 오션뷰 카페 탐방을 가장 좋아해요.',
    icon: '🕊️',
    baseColor: 'from-sky-400 to-blue-600',
  },
  {
    type: 'seal',
    name: '자갈치 아기물개',
    tagline: '통통 튀는 바다의 힐러',
    description: '남포동 자갈치 바다에서 헤엄치다 워케이션 라운지로 놀러 온 호기심 많고 사랑스러운 물개.',
    icon: '🦭',
    baseColor: 'from-teal-400 to-cyan-600',
  },
  {
    type: 'cat',
    name: '산복도로 치즈냥',
    tagline: '골목길의 낭만 방랑자',
    description: '초량 168계단과 골목길을 자유자재로 누비는 똑똑하고 친근한 길고양이.',
    icon: '🐱',
    baseColor: 'from-amber-400 to-orange-500',
  },
  {
    type: 'quokka',
    name: '영도 숲속 쿼카',
    tagline: '세상에서 가장 행복한 미소',
    description: '영도 봉래산 편백나무 숲에서 워케이션 족을 응원하러 온 해맑은 긍정 에너지 쿼카.',
    icon: '🐨',
    baseColor: 'from-emerald-400 to-teal-600',
  },
];

// 레벨별 필요 포인트
export const LEVEL_REQUIREMENTS = {
  1: 0,
  2: 200,   // Lv.2 달성 (모자 카테고리 3종 택 1)
  3: 500,   // Lv.3 달성 (의상 카테고리 3종 택 1)
  4: 900,   // Lv.4 달성 (액세서리 카테고리 3종 택 1)
  5: 1500,  // Lv.5 마스터 달성
};

// 레벨업 시 제공되는 동일 카테고리 보상 (3종 중 택 1)
export const LEVEL_UP_REWARDS: Record<number, { category: 'headwear' | 'outfit' | 'accessory'; categoryLabel: string; options: LevelRewardOption[] }> = {
  2: {
    category: 'headwear',
    categoryLabel: '👒 모자 / 헤어웨어 (3종 중 택 1)',
    options: [
      {
        id: 'hat-marine',
        name: '⚓ 마린 세일러 캡',
        category: 'headwear',
        levelRequired: 2,
        icon: '🧢',
        description: '부산 앞바다 캡틴의 멋을 담은 깔끔한 화이트 마린 선원모',
      },
      {
        id: 'hat-suncap',
        name: '🏖️ 네온 오션 썬캡',
        category: 'headwear',
        levelRequired: 2,
        icon: '🧢',
        description: '영도 바닷바람과 햇살을 막아주는 힙한 스트릿 감성의 썬캡',
      },
      {
        id: 'hat-beret',
        name: '🎨 흰여울 감성 베레모',
        category: 'headwear',
        levelRequired: 2,
        icon: '👒',
        description: '절벽 골목길 예술가 마을의 낭만을 머금은 감성 베레모',
      },
    ],
  },
  3: {
    category: 'outfit',
    categoryLabel: '👕 의상 / 코스튬 (3종 중 택 1)',
    options: [
      {
        id: 'outfit-sailor',
        name: '⛵ 블루 스트라이프 세일러룩',
        category: 'outfit',
        levelRequired: 3,
        icon: '👕',
        description: '바다 워케이션의 시그니처! 청량한 네이비 줄무늬 마린 티셔츠',
      },
      {
        id: 'outfit-surf',
        name: '🏄 네온 서핑 래시가드',
        category: 'outfit',
        levelRequired: 3,
        icon: '🩱',
        description: '일 끝나면 바로 바다로 뛰어들 수 있는 액티브 서핑 수트',
      },
      {
        id: 'outfit-nomad',
        name: '👔 노마드 루즈핏 셔츠',
        category: 'outfit',
        levelRequired: 3,
        icon: '👔',
        description: '카페에서 코딩할 때 편안하면서도 프로페셔널한 오버핏 린넨 셔츠',
      },
    ],
  },
  4: {
    category: 'accessory',
    categoryLabel: '✨ 액세서리 (3종 중 택 1)',
    options: [
      {
        id: 'acc-sunglasses',
        name: '🕶️ 힙스터 선글라스',
        category: 'accessory',
        levelRequired: 4,
        icon: '🕶️',
        description: '광안대교의 찬란한 골든아워 노을을 감상하기 위한 필수 아이템',
      },
      {
        id: 'acc-shell',
        name: '🐚 영도 천연 조개 목걸이',
        category: 'accessory',
        levelRequired: 4,
        icon: '📿',
        description: '태종대 앞바다의 조약돌과 소라 껍데기로 엮은 핸드메이드 목걸이',
      },
      {
        id: 'acc-camellia',
        name: '🌺 반짝이는 동백꽃 뱃지',
        category: 'accessory',
        levelRequired: 4,
        icon: '🌺',
        description: '부산의 상징 꽃인 붉은 동백꽃을 모티브로 한 영롱한 브로치',
      },
    ],
  },
};

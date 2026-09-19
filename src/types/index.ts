// Off-ce BUSAN 핵심 타입 정의

export type AppMode = 'WORK' | 'WALK' | 'BENEFIT' | 'MYLOG';

export interface LocationPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  area: '영도' | '초량/동구' | '남포/중구' | '광안리' | '해운대' | '현재지' | string;
}

// 워크스페이스 (카페, 공유오피스)
export interface Workspace {
  id: string;
  name: string;
  category: '공유오피스' | '작업카페' | '호텔라운지' | '공공워케이션센터';
  lat: number;
  lng: number;
  address: string;
  area: string;
  features: {
    hasOutlet: boolean;       // 콘센트 충분 여부
    hasWifi: boolean;         // 고속 와이파이
    isQuiet: boolean;         // 조용한 분위기 (회의/업무)
    hasOceanView: boolean;    // 오션뷰
  };
  openHours: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
}

// 한국관광공사 TourAPI 연동 장소
export interface TourSpot {
  contentid: string;
  contenttypeid: string; // 12: 관광지, 14: 문화시설, 32: 숙박, 39: 음식점
  title: string;
  addr1: string;
  mapx: number; // lng
  mapy: number; // lat
  firstimage?: string;
  tel?: string;
  dist?: number; // 미터 단위 거리
  categoryLabel?: string;
  overview?: string;
  // F&B 및 로컬 체험 제휴 혜택 연동
  partnerBenefit?: PartnerBenefit;
  // 한국관광공사 두루누비(Durunubi) 공인 걷기길 코스 연동
  durunubiInfo?: {
    themeNm: string;         // 테마명 (예: 남파랑길, 갈맷길, 해파랑길)
    routeNm?: string;        // 코스명 (예: 갈맷길 3-2구간, 절영해안길)
    crsDstnc?: string;       // 거리 (예: 2.5km)
    crsTotlRqrmHour?: string;// 소요시간 (예: 30분)
    crsSummary?: string;     // 코스 요약
  };
  // 한국관광공사 오디(Odii) 관광지 오디오 가이드 연동
  audioGuide?: {
    audioTitle: string;      // 오디오 해설 제목
    audioUrl?: string;       // MP3 스트리밍 URL
    scriptContent?: string;  // 나레이션 대본
    duration?: string;       // 재생 시간 (예: 1분 30초)
  };
}


// 부산 체험 & F&B 로컬 기업 마케팅 및 이용자 할인권
export interface PartnerBenefit {
  id: string;
  businessName: string;      // 기업/매장명
  category: 'F&B' | '체험/액티비티' | '로컬크리에이터' | '복합문화';
  title: string;             // 혜택 제목 (예: "식사 시 수제 맥주 1잔 무료")
  discountRate: string;      // 혜택 요약 (예: "15% 할인", "무료 음료")
  couponCode: string;        // 모바일 쿠폰 코드
  validUntil: string;        // 유효기간
  description: string;       // 매장 및 브랜드 스토리
  address: string;
  imageUrl: string;
  targetSpotId?: string;     // 매칭된 관광지/음식점 ID
}

// 30분 타임어택 묶음 코스
export interface TimeAttackCourse {
  id: string;
  title: string;
  theme: '노을산책' | '미식탐방' | '실내힐링' | '야경감성';
  estimatedMinutes: number;
  totalDistanceKm: number;
  spots: {
    step: 1 | 2 | 3;
    role: '맛집' | '산책/문화' | '숙소';
    spot: TourSpot;
  }[];
  partnerBenefit?: PartnerBenefit;
}

// 날씨 및 일몰 정보
export interface WeatherSunsetInfo {
  weather: '맑음' | '흐림' | '비';
  temp: number;
  sunsetTime: string; // "18:42"
  goldenHourMinutesLeft: number; // 일몰까지 남은 분
}

// 구글 시트 백엔드 로그/리뷰 데이터
export interface WorkationLog {
  id?: string;
  timestamp?: string;
  userName: string;
  workspaceName: string;
  visitedCourseTitle: string;
  reviewComment: string;
  rating: number;
}

// 회원 가입 및 로그인 사용자 정보
export interface UserMember {
  id: string;
  createdAt: string;
  provider: 'google' | 'kakao' | 'apple';
  company: string;   // [회사명]
  name: string;      // [이름]
  role: string;      // [직책]
  phone: string;     // [연락처]
  email: string;     // [이메일]
  character?: CharacterProfile;
}

// SD 동물 캐릭터 타입
export type AnimalType = 'seagull' | 'seal' | 'cat' | 'quokka';

// 캐릭터 프로필 및 아이템 장착 정보
export interface CharacterProfile {
  animalType: AnimalType;
  name: string;
  level: number;       // 1 ~ 5
  points: number;      // 누적 포인트
  equipped: {
    headwear?: string;   // 모자/헤어
    outfit?: string;     // 의상
    accessory?: string;  // 악세사리
  };
}

// 레벨업 보상 선택 옵션
export interface LevelRewardOption {
  id: string;
  name: string;
  category: 'headwear' | 'outfit' | 'accessory';
  levelRequired: number;
  icon: string;
  description: string;
}


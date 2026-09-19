// 한국관광공사 TourAPI 4.0 연동 모듈
// - locationBasedList1 (위치기반 관광정보 조회)
// - 관광지(12), 문화시설(14), 숙박(32), 음식점(39)

import { TourSpot, TimeAttackCourse, PartnerBenefit } from '@/types';
import { PARTNER_BENEFITS, SEED_COURSES } from './busanData';

const TOUR_API_BASE_URL = 'https://apis.data.go.kr/B551011/KorService1/locationBasedList1';

// 위치 기반 관광 데이터 호출
export async function fetchLocationBasedTour(params: {
  mapX: number; // lng
  mapY: number; // lat
  radius?: number; // 미터 단위 (기본 3000m)
  contentTypeId?: string;
}): Promise<{ spots: TourSpot[]; fromApi: boolean }> {
  const serviceKey = process.env.TOUR_API_KEY;
  const radius = params.radius || 3000;

  if (!serviceKey) {
    // API 키 미등록 시 완성도 높은 부산 실제 시드 데이터 반환
    return { spots: getMockTourSpots(params.mapX, params.mapY, params.contentTypeId), fromApi: false };
  }

  try {
    const url = new URL(TOUR_API_BASE_URL);
    url.searchParams.append('serviceKey', serviceKey);
    url.searchParams.append('numOfRows', '30');
    url.searchParams.append('pageNo', '1');
    url.searchParams.append('MobileOS', 'ETC');
    url.searchParams.append('MobileApp', 'OffCeBusan');
    url.searchParams.append('_type', 'json');
    url.searchParams.append('listYN', 'Y');
    url.searchParams.append('arrange', 'E'); // 거리순
    url.searchParams.append('mapX', params.mapX.toString());
    url.searchParams.append('mapY', params.mapY.toString());
    url.searchParams.append('radius', radius.toString());

    if (params.contentTypeId) {
      url.searchParams.append('contentTypeId', params.contentTypeId);
    }

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`TourAPI HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    const items = data?.response?.body?.items?.item;

    if (!items || !Array.isArray(items)) {
      return { spots: getMockTourSpots(params.mapX, params.mapY, params.contentTypeId), fromApi: false };
    }

    const mapped: TourSpot[] = items.map((item: any) => {
      // 로컬 제휴 혜택 매칭
      const matchedBenefit = PARTNER_BENEFITS.find(b => 
        item.title?.includes('어묵') || item.title?.includes('초량') || item.title?.includes('흰여울') || item.title?.includes('요트')
      );

      return {
        contentid: item.contentid,
        contenttypeid: item.contenttypeid,
        title: item.title,
        addr1: item.addr1 || '',
        mapx: parseFloat(item.mapx),
        mapy: parseFloat(item.mapy),
        firstimage: item.firstimage || item.firstimage2 || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        tel: item.tel || '',
        dist: parseFloat(item.dist),
        categoryLabel: getCategoryLabel(item.contenttypeid),
        overview: `${item.title} - 부산 뚜벅이 워케이션 추천 명소`,
        partnerBenefit: matchedBenefit,
      };
    });

    return { spots: mapped, fromApi: true };
  } catch (error) {
    console.warn('TourAPI fetch error, using mock data:', error);
    return { spots: getMockTourSpots(params.mapX, params.mapY, params.contentTypeId), fromApi: false };
  }
}

// 30분 타임어택 코스 자동 생성 (맛집 ➔ 산책로/문화 ➔ 숙소)
export async function generateTimeAttackCourse(
  lat: number,
  lng: number,
  isRainy: boolean = false
): Promise<TimeAttackCourse> {
  // 1단계: 맛집(39)
  const foodResult = await fetchLocationBasedTour({ mapX: lng, mapY: lat, contentTypeId: '39' });
  // 2단계: 맑으면 산책/관광지(12), 비 오면 실내문화(14)
  const secondTypeId = isRainy ? '14' : '12';
  const walkResult = await fetchLocationBasedTour({ mapX: lng, mapY: lat, contentTypeId: secondTypeId });
  // 3단계: 숙소(32)
  const stayResult = await fetchLocationBasedTour({ mapX: lng, mapY: lat, contentTypeId: '32' });

  const foodSpot = foodResult.spots[0] || SEED_COURSES[0].spots[0].spot;
  const walkSpot = walkResult.spots[0] || SEED_COURSES[0].spots[1].spot;
  const staySpot = stayResult.spots[0] || SEED_COURSES[0].spots[2].spot;

  // 파트너 할인 혜택 매칭
  const partnerBenefit = foodSpot.partnerBenefit || walkSpot.partnerBenefit || PARTNER_BENEFITS[0];

  return {
    id: `course-${Date.now()}`,
    title: isRainy ? '비 오는 날 감성 충전 실내 힐링 코스' : '퇴근 후 황금빛 노을 & 로컬 미식 코스',
    theme: isRainy ? '실내힐링' : '노을산책',
    estimatedMinutes: 28,
    totalDistanceKm: 2.1,
    partnerBenefit,
    spots: [
      { step: 1, role: '맛집', spot: foodSpot },
      { step: 2, role: '산책/문화', spot: walkSpot },
      { step: 3, role: '숙소', spot: staySpot },
    ],
  };
}

function getCategoryLabel(typeId: string): string {
  switch (typeId) {
    case '12': return '로컬 명소 / 산책로';
    case '14': return '실내 문화시설';
    case '32': return '워케이션 감성 숙소';
    case '39': return '로컬 맛집 / F&B';
    default: return '관광 스팟';
  }
}

// API 키가 없거나 응답 없을 때 제공하는 고품질 부산 실제 스팟 데이터
function getMockTourSpots(mapX: number, mapY: number, contentTypeId?: string): TourSpot[] {
  const allSpots: TourSpot[] = [
    {
      contentid: 'mock-1',
      contenttypeid: '39',
      title: '삼진어묵 영도본점 & 베이커리',
      addr1: '부산광역시 영도구 태종로99번길 36',
      mapx: 129.0405,
      mapy: 35.0935,
      firstimage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
      categoryLabel: '로컬 맛집 / F&B',
      overview: '부산의 자부심 삼진어묵 본점. 갓 나온 어묵고로케와 쉼터.',
      partnerBenefit: PARTNER_BENEFITS[0],
    },
    {
      contentid: 'mock-2',
      contenttypeid: '12',
      title: '흰여울문화마을 & 해안터널',
      addr1: '부산광역시 영도구 절영로 194',
      mapx: 129.0468,
      mapy: 35.0772,
      firstimage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      categoryLabel: '로컬 명소 / 산책로',
      overview: '절벽 위 골목길과 일몰 해안 터널의 그림 같은 풍경.',
      partnerBenefit: PARTNER_BENEFITS[2],
    },
    {
      contentid: 'mock-3',
      contenttypeid: '32',
      title: '라발스 호텔 부산 (오션뷰 테라스)',
      addr1: '부산광역시 영도구 봉래나루로 82',
      mapx: 129.0392,
      mapy: 35.0945,
      firstimage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      categoryLabel: '워케이션 감성 숙소',
      overview: '영도대교와 부산항이 한눈에 내려다보이는 감성 스테이.',
    },
    {
      contentid: 'mock-4',
      contenttypeid: '39',
      title: '초량 1941 & 초량 불백거리',
      addr1: '부산광역시 동구 망양로 533-5',
      mapx: 129.0372,
      mapy: 35.1189,
      firstimage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      categoryLabel: '로컬 맛집 / F&B',
      overview: '원도심 산복도로의 명물 불백과 감성 적산가옥 우유 카페.',
      partnerBenefit: PARTNER_BENEFITS[1],
    },
    {
      contentid: 'mock-5',
      contenttypeid: '12',
      title: '168계단 모노레일 & 유치환의 우체통',
      addr1: '부산광역시 동구 영초위길 22',
      mapx: 129.0354,
      mapy: 35.1147,
      firstimage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
      categoryLabel: '로컬 명소 / 야경산책',
      overview: '부산항 대교를 수놓는 환상적인 불빛과 모노레일.',
    },
    {
      contentid: 'mock-6',
      contenttypeid: '14',
      title: '보수동 책방골목 문화관',
      addr1: '부산광역시 중구 대청로 67번길 5',
      mapx: 129.0268,
      mapy: 35.1042,
      firstimage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
      categoryLabel: '실내 문화시설',
      overview: '비 오는 날 책 향기와 함께하는 고즈넉한 인문학 전시관.',
    },
  ];

  if (!contentTypeId) return allSpots;
  return allSpots.filter(s => s.contenttypeid === contentTypeId);
}

/**
 * 🌊 오프스 부산 (Off-ce BUSAN) 구글 스프레드시트 자동 구축 & 실시간 DB 스크립트
 * 
 * [적용 방법 - 10초 완성]
 * 1. 구글 스프레드시트 상단 메뉴에서 [확장 프로그램] ➔ [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 스크립트를 전체 복사하여 붙여넣기
 * 3. 상단 함수 선택에서 [setupAllOffCeSheets]를 선택한 뒤 [실행(Run)] 클릭!
 * ➔ 5개 탭(Workspaces, TimeAttackCourses, PartnerBenefits, CouponLogs, Guestbook_Reviews)과
 *    디자인 헤더 및 초기 마스터 데이터가 1초 만에 자동 생성됩니다!
 * 
 * [웹훅 실시간 연동 (선택사항)]
 * 4. 우측 상단 [배포] ➔ [새 배포] ➔ 유형: [웹 앱]
 *    - 다음 사용자 권한으로 실행: '나'
 *    - 액세스 권한: '모든 사용자(Anyone)'
 *    - 배포 후 나오는 [웹 앱 URL]을 .env.local의 GOOGLE_APPS_SCRIPT_URL에 입력하면 실시간 자동 저장 연동 완료!
 */

// 1. 전체 시트 탭 및 헤더, 초기 데이터 자동 생성 함수
function setupAllOffCeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1) Workspaces (워크스페이스 마스터)
  setupWorkspacesSheet(ss);

  // 2) TimeAttackCourses (30분 타임어택 코스 로그)
  setupCoursesSheet(ss);

  // 3) PartnerBenefits (부산 체험 & F&B 로컬 기업 혜택 마스터)
  setupBenefitsSheet(ss);

  // 4) CouponLogs (쿠폰 발급 및 사용 로그)
  setupCouponLogsSheet(ss);

  // 5) Guestbook_Reviews (노마드 방명록 & 리뷰)
  setupReviewsSheet(ss);

  // 기본 빈 시트1 제거 (내용이 없을 경우)
  const defaultSheet = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  Browser.msgBox('🎉 오프스 부산 5개 데이터 시트 자동 구축이 완료되었습니다!');
}

// 1) Workspaces 시트 구축
function setupWorkspacesSheet(ss) {
  const sheetName = 'Workspaces';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const headers = [
    'ID', '공간명', '카테고리', '지역거점', '상세주소', '위도(lat)', '경도(lng)',
    '콘센트', '와이파이', '조용함', '오션뷰', '운영시간', '평점', '소개'
  ];

  const data = [
    ['ws-1', '부산 워케이션 거점센터 (아스티호텔 24F)', '공공워케이션센터', '초량/동구', '부산광역시 동구 중앙대로 214번길 7-8 아스티호텔 24층', 35.1158, 129.0416, 'Y', 'Y', 'Y', 'Y', '09:00 ~ 20:00 (주말 휴무)', 4.9, '부산시 공식 워케이션 거점 센터. 부산항 파노라마 오션뷰와 1인 포커스룸, 회의실 완비.'],
    ['ws-2', '블루포트 2021 (영도 청학동)', '공유오피스', '영도', '부산광역시 영도구 대교로46번길 24', 35.0935, 129.0558, 'Y', 'Y', 'Y', 'Y', '08:00 ~ 22:00', 4.8, '부산대교와 선박 부두가 내려다보이는 로컬 크리에이터 코워킹 라운지.'],
    ['ws-3', '모모스 로스터리 & 커피바 영도', '작업카페', '영도', '부산광역시 영도구 봉래나루로 160', 35.0901, 129.0402, 'Y', 'Y', 'N', 'Y', '09:00 ~ 18:30', 4.9, '월드 바리스타 챔피언십 우승의 명성. 바다 바로 앞 대형 로스터리 작업 명소.'],
    ['ws-4', '노티스 (Notice 1950 쌀창고 카페)', '작업카페', '남포/중구', '부산광역시 중구 대교로 135', 35.1098, 129.0375, 'Y', 'Y', 'Y', 'N', '11:00 ~ 21:00', 4.7, '1950년 건립된 항구 쌀창고를 재생한 감성 복합문화공간. 넓은 테이블과 콘센트 좌석.'],
    ['ws-5', '밀락더마켓 워크라운지', '호텔라운지', '광안리', '부산광역시 수영구 민락수변로17번길 56', 35.1545, 129.1301, 'Y', 'Y', 'N', 'Y', '10:00 ~ 24:00', 4.8, '광안대교 오션뷰가 계단식 스탠드에 펼쳐지는 랜드마크. 퇴근 직후 F&B 즐기기 최적.'],
    ['ws-6', '스파크플러스 센텀시티점', '공유오피스', '해운대', '부산광역시 해운대구 센텀중앙로 78', 35.1702, 129.1298, 'Y', 'Y', 'Y', 'N', '24시간 운영', 4.8, '센텀 IT 밸리의 프리미엄 공유오피스. 듀얼 모니터 및 폰부스 지원.']
  ];

  formatSheet(sheet, headers, data, '#0284C7'); // Ocean Blue Header
}

// 2) TimeAttackCourses 시트 구축
function setupCoursesSheet(ss) {
  const sheetName = 'TimeAttackCourses';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const headers = [
    '생성일시', '거점지역', '날씨조건', '퇴근시간', '코스명', '예상소요(분)', '총거리(km)',
    '1단계(맛집)', '2단계(산책/문화)', '3단계(숙소)', '연계_로컬기업혜택'
  ];

  const data = [
    ['2026-09-19 18:00', '영도', '맑음', '18:00', '영도 해안절벽 노을 & 어묵 피크닉 코스', 28, 2.4, '삼진어묵 영도본점', '흰여울문화마을 & 절영해안산책로', '라발스 호텔 부산', '삼진어묵 15% 할인'],
    ['2026-09-19 18:00', '초량/동구', '맑음', '18:00', '원도심 이바구길 산복도로 야경 코스', 25, 1.8, '초량 1941 & 불백거리', '168계단 모노레일', '아스티 호텔 부산역', '초량1941 드립백 증정'],
    ['2026-09-19 18:00', '남포/중구', '비', '18:00', '비 오는 날엔 감성 충전 실내 문화 코스', 20, 1.2, '남포 비어 (깡통야시장)', '보수동 책방골목 문화관', '하운드 호텔 남포', '남포비어 수제맥주 1잔 무료']
  ];

  formatSheet(sheet, headers, data, '#EA580C'); // Sunset Orange Header
}

// 3) PartnerBenefits 시트 구축
function setupBenefitsSheet(ss) {
  const sheetName = 'PartnerBenefits';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const headers = [
    '혜택ID', '기업/매장명', '카테고리', '혜택제목', '할인율', '쿠폰코드', '매장주소', '유효기간', '브랜드스토리'
  ];

  const data = [
    ['benefit-1', '삼진어묵 영도본점 & 베이커리', 'F&B', '어묵베이커리 15% 즉시 할인권', '15% OFF', 'OFFCE-SAMJIN-15', '부산 영도구 태종로99번길 36', '2026-12-31', '1953년부터 시작된 대한민국 최초의 어묵 제조사. 시그니처 어묵고로케와 치즈어묵바 제공.'],
    ['benefit-2', '초량1941 (적산가옥 바닐라우유)', 'F&B', '수제 우유 주문 시 드립백 1팩 증정', '무료 증정', 'OFFCE-CHORYANG-GIFT', '부산 동구 망양로 533-5', '2026-12-31', '1941년 건립된 일본식 목조가옥을 개조한 숲속 힐링 카페.'],
    ['benefit-3', '흰여울 원데이 바다비누 공방 (소소아트)', '체험/액티비티', '부산 바다비누 만들기 체험 클래스 20% 할인', '20% OFF', 'OFFCE-OCEAN-SOAP20', '부산 영도구 절영로 210', '2026-12-31', '영도 앞바다의 노을빛을 담은 친환경 수제 바다 비누 제작 체험.'],
    ['benefit-4', '부평 깡통야시장 로컬맥주 펍 (남포비어)', 'F&B', '안주 주문 시 부산 수제 에일맥주 1잔 무료', '1잔 무료', 'OFFCE-NAMPO-BEER', '부산 중구 부평1길 48', '2026-12-31', '원도심의 활기가 넘치는 펍. 퇴근 후 로컬 안주와 시원한 맥주.'],
    ['benefit-5', '광안리 선셋 요트투어 (요트탈래)', '체험/액티비티', '선셋 & 야경 요트투어 30% 즉시 할인', '30% OFF', 'OFFCE-YACHT-30', '부산 해운대구 해운대해변로 84', '2026-12-31', '18:30 골든아워 출항! 광안대교 아래에서 노을과 야경을 즐기는 요트투어.']
  ];

  formatSheet(sheet, headers, data, '#D97706'); // Amber Gold Header
}

// 4) CouponLogs 시트 구축
function setupCouponLogsSheet(ss) {
  const sheetName = 'CouponLogs';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const headers = [
    '발급일시', '기업/매장명', '쿠폰코드', '할인혜택', '유입코스', '사용자기기'
  ];

  const data = [
    ['2026-09-19 18:05:12', '삼진어묵 영도본점 & 베이커리', 'OFFCE-SAMJIN-15', '15% OFF', '영도 해안절벽 노을 코스', 'Mobile/Safari'],
    ['2026-09-19 18:12:45', '초량1941 (적산가옥 바닐라우유)', 'OFFCE-CHORYANG-GIFT', '무료 증정', '원도심 이바구길 야경 코스', 'Mobile/Chrome']
  ];

  formatSheet(sheet, headers, data, '#059669'); // Emerald Green Header
}

// 5) Guestbook_Reviews 시트 구축
function setupReviewsSheet(ss) {
  const sheetName = 'Guestbook_Reviews';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  const headers = [
    '등록일시', '노마드닉네임', '머문워크스페이스', '탐방한코스', '별점(1~5)', '퇴근길소감'
  ];

  const data = [
    ['2026-09-19 15:40:00', '영도바다러버', '블루포트 2021 (영도 청학동)', '영도 해안절벽 노을 & 어묵 피크닉 코스', 5, '바다 바로 앞에서 코딩하고 18시 칼퇴 후 흰여울 산책했어요. 삼진어묵 15% 쿠폰 쏠쏠했습니다!'],
    ['2026-09-19 14:15:00', '칼퇴왕김대리', '부산 워케이션 거점센터 (아스티호텔 24F)', '원도심 이바구길 산복도로 야경 코스', 5, '아스티호텔 24층 뷰 미쳤습니다. 모노레일 타고 올라간 산복도로 야경 최고!'],
    ['2026-09-19 11:20:00', '디지털노마드정', '노티스 (쌀창고 카페)', '비 오는 날엔 감성 충전 실내 문화 코스', 5, '남포비어 무료 에일맥주 쿠폰으로 하루의 피로를 싹 풀었습니다. 뚜벅이 코스로 완벽해요.']
  ];

  formatSheet(sheet, headers, data, '#7C3AED'); // Purple Header
}

// 공통 헤더 서식 및 데이터 포맷팅 유틸
function formatSheet(sheet, headers, data, headerColor) {
  // 헤더 입력
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground(headerColor);
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Arial');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);

  // 데이터 입력
  if (data && data.length > 0) {
    const dataRange = sheet.getRange(2, 1, data.length, headers.length);
    dataRange.setValues(data);
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(10);
    dataRange.setVerticalAlignment('middle');
    for (let r = 2; r <= data.length + 1; r++) {
      sheet.setRowHeight(r, 28);
    }
  }

  // 1행 틀 고정 (Freeze Header)
  sheet.setFrozenRows(1);

  // 컬럼 너비 자동 조정
  for (let c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

// 2. 웹앱 실시간 데이터 수신용 Web App API (doPost)
function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const payload = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const type = payload.type; // 'course' | 'coupon' | 'review' | 'workspace'
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    if (type === 'review') {
      const sheet = ss.getSheetByName('Guestbook_Reviews') || ss.insertSheet('Guestbook_Reviews');
      sheet.appendRow([
        timestamp,
        payload.userName || '익명의 노마드',
        payload.workspaceName || '미지정',
        payload.visitedCourseTitle || '자율 탐방',
        payload.rating || 5,
        payload.reviewComment || ''
      ]);
    } else if (type === 'coupon') {
      const sheet = ss.getSheetByName('CouponLogs') || ss.insertSheet('CouponLogs');
      sheet.appendRow([
        timestamp,
        payload.businessName || '',
        payload.couponCode || '',
        payload.discountRate || '',
        payload.courseTitle || '직접 발급',
        payload.userAgent || 'Web Client'
      ]);
    } else if (type === 'course') {
      const sheet = ss.getSheetByName('TimeAttackCourses') || ss.insertSheet('TimeAttackCourses');
      sheet.appendRow([
        timestamp,
        payload.area || '부산',
        payload.weather || '맑음',
        payload.offTime || '18:00',
        payload.courseTitle || '',
        payload.estimatedMinutes || 30,
        payload.totalDistanceKm || 2.0,
        payload.spot1 || '',
        payload.spot2 || '',
        payload.spot3 || '',
        payload.benefit || ''
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, timestamp }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

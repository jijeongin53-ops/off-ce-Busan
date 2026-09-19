/**
 * 🌊 오프스 부산 (Off-ce BUSAN) 실시간 구글 시트 저장 웹훅 스크립트
 * 
 * [적용 방법]
 * 1. Apps Script 편집기(Code.gs)의 내용을 모두 지우고 아래 코드를 그대로 붙여넣습니다.
 * 2. Ctrl + S (저장) 누르기
 * 3. 우측 상단 [배포] ➔ [새 배포] 클릭
 *    - 유형: 웹 앱
 *    - 다음 사용자 권한으로 실행: 나
 *    - 액세스 권한: 모든 사용자 (Anyone)
 * 4. [배포]를 누르면 나오는 새 웹 앱 URL을 복사하여 전달해 주시면 즉시 100% 작동합니다!
 */

// 1. GET 테스트 확인용 함수 (브라우저 주소창에 URL 접속 시 정상 작동 여부 확인)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: '오프스 부산 구글 시트 웹훅 서버가 정상 작동 중입니다.'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 2. 실시간 데이터 저장 함수 (POST 수신)
function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const payload = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const type = payload.type || 'signup';
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    if (type === 'signup') {
      // 1) Users_Members 시트에 회원가입 데이터 추가
      const sheet = ss.getSheetByName('Users_Members') || ss.insertSheet('Users_Members');
      sheet.appendRow([
        timestamp,
        payload.email || '',
        payload.name || '',
        payload.company || '',
        payload.role || '',
        payload.phone || '',
        payload.provider || 'Google',
        payload.animalType || 'seagull',
        payload.characterName || '',
        payload.level || 1,
        payload.points || 100
      ]);
    } else if (type === 'point') {
      // 2) Point_Logs 시트에 포인트 데이터 추가
      const sheet = ss.getSheetByName('Point_Logs') || ss.insertSheet('Point_Logs');
      sheet.appendRow([
        timestamp,
        payload.email || '',
        payload.name || '',
        payload.reason || '',
        payload.earnedPoints || '+0P',
        payload.totalPoints || 0,
        payload.level || 'Lv.1',
        payload.equipped || '기본'
      ]);
    } else if (type === 'review') {
      // 3) Guestbook_Reviews 시트에 방명록 데이터 추가
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
      // 4) CouponLogs 시트에 쿠폰 로그 데이터 추가
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
      // 5) TimeAttackCourses 시트에 코스 데이터 추가
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

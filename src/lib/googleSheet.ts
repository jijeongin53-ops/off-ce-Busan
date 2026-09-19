// Google Sheets API v4 백엔드 연동 모듈
// 시트 ID: 15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk
// 서비스 계정: sheet-bot@peo-schedule.iam.gserviceaccount.com

import { google } from 'googleapis';
import { Workspace, WorkationLog } from '@/types';
import { INITIAL_WORKSPACES } from './busanData';

const DEFAULT_SHEET_ID = '15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk';

// Google Sheets 인증 클라이언트 획득
function getGoogleAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'sheet-bot@peo-schedule.iam.gserviceaccount.com';
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!privateKey) {
    return null;
  }

  // 환경변수 내 이스케이프된 개행문자(\n) 정상화
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (error) {
    console.error('Google Auth Init Error:', error);
    return null;
  }
}

// 구글 시트에서 워크스페이스 목록 가져오기
export async function fetchWorkspacesFromSheet(): Promise<{ workspaces: Workspace[]; fromGoogle: boolean }> {
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const auth = getGoogleAuth();

  if (!auth) {
    // 비공개키 미설정 시 안전하게 기본 마스터 데이터 반환
    return { workspaces: INITIAL_WORKSPACES, fromGoogle: false };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    // 'Workspaces!A2:I' 또는 첫 번째 시트 조회
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A2:I',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { workspaces: INITIAL_WORKSPACES, fromGoogle: true };
    }

    const workspaces: Workspace[] = rows.map((row, idx) => ({
      id: row[0] || `ws-sheet-${idx + 1}`,
      name: row[1] || '이름 없음',
      category: (row[2] as any) || '공유오피스',
      area: row[3] || '부산',
      address: row[4] || '',
      lat: parseFloat(row[5]) || 35.0912,
      lng: parseFloat(row[6]) || 129.0435,
      features: {
        hasOutlet: row[7]?.includes('콘센트') ?? true,
        hasWifi: true,
        isQuiet: row[7]?.includes('조용') ?? true,
        hasOceanView: row[7]?.includes('오션뷰') ?? false,
      },
      openHours: row[8] || '09:00 ~ 20:00',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      rating: 4.8,
      reviewCount: 24,
      description: row[7] || '구글 시트 연동 워크스페이스 공간',
    }));

    return { workspaces, fromGoogle: true };
  } catch (error) {
    console.warn('Google Sheet Fetch Failed (Falling back to seed data):', error);
    return { workspaces: INITIAL_WORKSPACES, fromGoogle: false };
  }
}

// 구글 시트에 사용자 워케이션 리뷰/방명록 로그 추가
export async function appendLogToSheet(log: WorkationLog): Promise<{ success: boolean; fromGoogle: boolean; message: string }> {
  return appendDataToSheet({
    type: 'review',
    ...log,
  });
}

// 오프스 부산 다중 탭 자동 분기 저장 인터페이스
export interface SheetPayload {
  type: 'review' | 'coupon' | 'course' | 'workspace' | 'signup' | 'point';
  [key: string]: any;
}

// 여러 개의 시트 탭(Guestbook_Reviews, CouponLogs, TimeAttackCourses, Users_Members, Point_Logs)에 각각 나누어 자동 저장
export async function appendDataToSheet(payload: SheetPayload): Promise<{ success: boolean; fromGoogle: boolean; message: string }> {
  const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  // 1. Google Apps Script Web App URL이 설정된 경우 실시간 웹훅 호출
  if (appsScriptUrl) {
    try {
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && (!data || data.success !== false)) {
        return {
          success: true,
          fromGoogle: true,
          message: `구글 스프레드시트 [${payload.type}] 탭에 실시간 기록되었습니다.`,
        };
      }
    } catch (err) {
      console.warn('Apps Script Webhook failed, trying Service Account...', err);
    }
  }


  // 2. Google Service Account JWT 인증 시도
  const auth = getGoogleAuth();

  if (!auth) {
    return {
      success: true,
      fromGoogle: false,
      message: `로컬 시뮬레이션 저장 완료 (시트 [${payload.type}] 탭에 자동 저장 대기 중)`,
    };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    let range = 'Guestbook_Reviews!A:F';
    let rowData: any[] = [];

    if (payload.type === 'signup') {
      // 1) Users_Members 시트 (회원가입 정보)
      range = 'Users_Members!A:K';
      rowData = [
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
        payload.points || 0,
      ];
    } else if (payload.type === 'point') {
      // 2) Point_Logs 시트 (포인트 및 캐릭터 성장 로그)
      range = 'Point_Logs!A:H';
      rowData = [
        timestamp,
        payload.email || '',
        payload.name || '',
        payload.reason || '',
        payload.earnedPoints || '+0P',
        payload.totalPoints || 0,
        payload.level || 'Lv.1',
        payload.equipped || '기본',
      ];
    } else if (payload.type === 'review') {
      range = 'Guestbook_Reviews!A:F';
      rowData = [
        timestamp,
        payload.userName || '익명의 노마드',
        payload.workspaceName || '미지정',
        payload.visitedCourseTitle || '자율 탐방',
        payload.rating || 5,
        payload.reviewComment || '',
      ];
    } else if (payload.type === 'coupon') {
      range = 'CouponLogs!A:F';
      rowData = [
        timestamp,
        payload.businessName || '',
        payload.couponCode || '',
        payload.discountRate || '',
        payload.courseTitle || '직접 발급',
        payload.userAgent || 'Web Client',
      ];
    } else if (payload.type === 'course') {
      range = 'TimeAttackCourses!A:K';
      rowData = [
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
        payload.benefit || '',
      ];
    }


    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return {
      success: true,
      fromGoogle: true,
      message: `구글 스프레드시트 [${range.split('!')[0]}] 탭에 실시간 기록되었습니다.`,
    };
  } catch (error: any) {
    console.error('Google Sheet Append Error:', error);
    return {
      success: false,
      fromGoogle: false,
      message: error?.message || '구글 시트 기록 중 오류가 발생했습니다.',
    };
  }
}


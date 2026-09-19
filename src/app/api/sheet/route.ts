// Next.js Route Handler for Google Sheets API
import { NextResponse } from 'next/server';
import { fetchWorkspacesFromSheet, appendLogToSheet } from '@/lib/googleSheet';
import { WorkationLog } from '@/types';

export async function GET() {
  try {
    const data = await fetchWorkspacesFromSheet();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || '시트 조회 실패' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: WorkationLog = await request.json();
    if (!body.userName || !body.reviewComment) {
      return NextResponse.json(
        { success: false, error: '이름과 리뷰 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await appendLogToSheet(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || '시트 저장 실패' },
      { status: 500 }
    );
  }
}

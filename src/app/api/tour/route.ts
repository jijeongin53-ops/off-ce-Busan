// 한국관광공사 TourAPI 4.0 Server Proxy Route
import { NextResponse } from 'next/server';
import { fetchLocationBasedTour, generateTimeAttackCourse } from '@/lib/tourApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '35.0912');
  const lng = parseFloat(searchParams.get('lng') || '129.0435');
  const action = searchParams.get('action') || 'course';
  const isRainy = searchParams.get('isRainy') === 'true';
  const contentTypeId = searchParams.get('type') || undefined;
  const radius = parseInt(searchParams.get('radius') || '3000', 10);

  try {
    if (action === 'course') {
      const course = await generateTimeAttackCourse(lat, lng, isRainy);
      return NextResponse.json({
        success: true,
        course,
      });
    }

    const result = await fetchLocationBasedTour({
      mapX: lng,
      mapY: lat,
      radius,
      contentTypeId,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'TourAPI 조회 실패' },
      { status: 500 }
    );
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MapContainer from '@/components/MapContainer';
import BottomNav from '@/components/BottomNav';
import WorkSection from '@/components/WorkSection';
import WalkSection from '@/components/WalkSection';
import BenefitSection from '@/components/BenefitSection';
import LogSection from '@/components/LogSection';
import PartnerBenefitModal from '@/components/PartnerBenefitModal';
import CourseSaveModal from '@/components/CourseSaveModal';

import { AppMode, LocationPoint, Workspace, TimeAttackCourse, TourSpot, PartnerBenefit } from '@/types';
import { BUSAN_HUBS, INITIAL_WORKSPACES, SEED_COURSES, PARTNER_BENEFITS } from '@/lib/busanData';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<AppMode>('WALK'); // 기본 모드는 30분 코스
  const [selectedHub, setSelectedHub] = useState<LocationPoint>(BUSAN_HUBS[0]); // 영도 거점
  const [offTime, setOffTime] = useState<string>('18:00');
  const [isRainy, setIsRainy] = useState<boolean>(false);

  // 워크스페이스 데이터 및 시트 연동 상태
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(INITIAL_WORKSPACES[0]);
  const [isFromGoogleSheet, setIsFromGoogleSheet] = useState<boolean>(false);

  // 30분 타임어택 코스 상태
  const [activeCourse, setActiveCourse] = useState<TimeAttackCourse>(SEED_COURSES[0]);
  const [selectedSpot, setSelectedSpot] = useState<TourSpot | null>(SEED_COURSES[0].spots[0].spot);
  const [courseLoading, setCourseLoading] = useState<boolean>(false);

  // 모달 상태
  const [activeBenefit, setActiveBenefit] = useState<PartnerBenefit | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  // 구글 시트에서 워크스페이스 목록 가져오기
  useEffect(() => {
    async function loadSheetWorkspaces() {
      try {
        const res = await fetch('/api/sheet');
        if (res.ok) {
          const data = await res.json();
          if (data.workspaces && data.workspaces.length > 0) {
            setWorkspaces(data.workspaces);
            setIsFromGoogleSheet(data.fromGoogle);
          }
        }
      } catch (err) {
        console.warn('Sheet fetch failed, fallback to local seed data');
      }
    }
    loadSheetWorkspaces();
  }, []);

  // 거점 변경 또는 날씨 변경 시 TourAPI 코스 로드
  const loadTourCourse = async (hub: LocationPoint, rainy: boolean) => {
    setCourseLoading(true);
    try {
      const res = await fetch(`/api/tour?action=course&lat=${hub.lat}&lng=${hub.lng}&isRainy=${rainy}`);
      if (res.ok) {
        const data = await res.json();
        if (data.course) {
          setActiveCourse(data.course);
          setSelectedSpot(data.course.spots[0].spot);
        }
      }
    } catch (err) {
      console.warn('Tour course fetch failed, using fallback:', err);
    } finally {
      setCourseLoading(false);
    }
  };

  // 거점 선택 핸들러
  const handleSelectHub = (hub: LocationPoint) => {
    setSelectedHub(hub);
    // 해당 거점 주변 워크스페이스 선택
    const matchedWs = workspaces.find((w) => w.area.includes(hub.area.split('/')[0])) || workspaces[0];
    setSelectedWorkspace(matchedWs);
    loadTourCourse(hub, isRainy);
  };

  // 날씨 토글 핸들러
  const handleToggleWeather = () => {
    const nextRainy = !isRainy;
    setIsRainy(nextRainy);
    loadTourCourse(selectedHub, nextRainy);
  };

  return (
    <main className="flex flex-col min-h-screen pb-20">
      {/* 1. 상단 헤더 (타이틀, 퇴근 카운트다운 타이머, 날씨 위젯, 거점 선택기) */}
      <Header
        selectedHub={selectedHub}
        onSelectHub={handleSelectHub}
        offTime={offTime}
        onOffTimeChange={setOffTime}
        isRainy={isRainy}
        onToggleWeather={handleToggleWeather}
      />

      {/* 2. 인터랙티브 지도 (카카오맵 연동 + 하이브리드 동선 캔버스) */}
      <MapContainer
        mode={currentMode === 'WORK' ? 'WORK' : 'WALK'}
        selectedHub={selectedHub}
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={(ws) => {
          setSelectedWorkspace(ws);
          setCurrentMode('WORK');
        }}
        activeCourse={activeCourse}
        selectedSpot={selectedSpot}
        onSelectSpot={setSelectedSpot}
        onOpenBenefit={() => {
          if (activeCourse?.partnerBenefit) {
            setActiveBenefit(activeCourse.partnerBenefit);
          }
        }}
      />

      {/* 3. 모드별 콘텐츠 섹션 */}
      <div className="flex-1">
        {currentMode === 'WORK' && (
          <WorkSection
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onSelectWorkspace={setSelectedWorkspace}
            isFromGoogle={isFromGoogleSheet}
          />
        )}

        {currentMode === 'WALK' && (
          <WalkSection
            course={activeCourse}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
            onRefreshCourse={() => loadTourCourse(selectedHub, isRainy)}
            onOpenBenefitModal={setActiveBenefit}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            isRainy={isRainy}
            onToggleWeather={handleToggleWeather}
            loading={courseLoading}
          />
        )}

        {currentMode === 'BENEFIT' && (
          <BenefitSection onSelectBenefit={setActiveBenefit} />
        )}

        {currentMode === 'MYLOG' && (
          <LogSection
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            isFromGoogle={isFromGoogleSheet}
          />
        )}
      </div>

      {/* 4. 하단 네비게이션 바 */}
      <BottomNav
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        couponCount={PARTNER_BENEFITS.length}
      />

      {/* 5. 부산 기업 상생 모바일 할인권 모달 */}
      <PartnerBenefitModal
        benefit={activeBenefit}
        onClose={() => setActiveBenefit(null)}
      />

      {/* 6. 구글 시트 코스 & 방명록 저장 모달 */}
      {isSaveModalOpen && (
        <CourseSaveModal
          course={activeCourse}
          workspace={selectedWorkspace}
          onClose={() => setIsSaveModalOpen(false)}
        />
      )}
    </main>
  );
}

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
import LoginModal from '@/components/LoginModal';
import CharacterCreateModal from '@/components/CharacterCreateModal';
import LevelUpRewardModal from '@/components/LevelUpRewardModal';
import CharacterWidget from '@/components/CharacterWidget';
import CharacterProfileModal from '@/components/CharacterProfileModal';

import {
  AppMode,
  LocationPoint,
  Workspace,
  TimeAttackCourse,
  TourSpot,
  PartnerBenefit,
  UserMember,
  CharacterProfile,
  LevelRewardOption,
} from '@/types';
import { BUSAN_HUBS, INITIAL_WORKSPACES, SEED_COURSES, PARTNER_BENEFITS } from '@/lib/busanData';
import { LEVEL_REQUIREMENTS } from '@/lib/characterData';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<AppMode>('WALK'); // 기본 모드는 1시간 코스
  const [selectedHub, setSelectedHub] = useState<LocationPoint>(BUSAN_HUBS[0]); // 영도 거점
  const [offTime, setOffTime] = useState<string>('18:00');
  const [isRainy, setIsRainy] = useState<boolean>(false);

  // 현재 위치 기반 추천 상태
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isUsingMyLocation, setIsUsingMyLocation] = useState<boolean>(false);

  // 회원 정보 및 SD 캐릭터 상태
  const [currentUser, setCurrentUser] = useState<UserMember | null>(null);
  const [character, setCharacter] = useState<CharacterProfile | null>(null);

  // 모달 제어 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isCharacterCreateOpen, setIsCharacterCreateOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [levelUpTarget, setLevelUpTarget] = useState<number | null>(null);

  // 워크스페이스 데이터 및 시트 연동 상태
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(INITIAL_WORKSPACES[0]);
  const [isFromGoogleSheet, setIsFromGoogleSheet] = useState<boolean>(false);

  // 1시간 타임어택 코스 상태
  const [activeCourse, setActiveCourse] = useState<TimeAttackCourse>(SEED_COURSES[0]);
  const [selectedSpot, setSelectedSpot] = useState<TourSpot | null>(SEED_COURSES[0].spots[0].spot);
  const [courseLoading, setCourseLoading] = useState<boolean>(false);

  // 모달 상태
  const [activeBenefit, setActiveBenefit] = useState<PartnerBenefit | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  // 포인트 적립 및 레벨업 감지 함수
  const earnPoints = async (amount: number, reason: string) => {
    if (!character) return;

    const newPoints = character.points + amount;
    let nextLevel = character.level;

    // 레벨업 조건 체크 (Lv.1 -> Lv.2: 200P, Lv.2 -> Lv.3: 500P, Lv.3 -> Lv.4: 900P)
    if (character.level === 1 && newPoints >= LEVEL_REQUIREMENTS[2]) {
      nextLevel = 2;
    } else if (character.level === 2 && newPoints >= LEVEL_REQUIREMENTS[3]) {
      nextLevel = 3;
    } else if (character.level === 3 && newPoints >= LEVEL_REQUIREMENTS[4]) {
      nextLevel = 4;
    }

    const updatedChar: CharacterProfile = {
      ...character,
      points: newPoints,
      level: nextLevel,
    };
    setCharacter(updatedChar);

    // 구글 시트 Point_Logs 탭에 실시간 기록
    if (currentUser) {
      fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'point',
          email: currentUser.email,
          name: currentUser.name,
          reason,
          earnedPoints: `+${amount}P`,
          totalPoints: newPoints,
          level: `Lv.${nextLevel}`,
          equipped: updatedChar.equipped.headwear || '기본',
        }),
      }).catch((e) => console.warn('Point sheet sync skipped:', e));
    }

    // 로컬 스토리지에 캐릭터 상태 동기화 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('offce_character', JSON.stringify(updatedChar));
    }

    // 레벨업 발생 시 보상 선택 모달 오픈
    if (nextLevel > character.level) {
      setLevelUpTarget(nextLevel);
    }
  };

  // 컴포넌트 마운트 시 로컬스토리지에서 기존 가입자 회원 및 캐릭터 정보 자동 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('offce_user');
        const storedChar = localStorage.getItem('offce_character');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        if (storedChar) {
          setCharacter(JSON.parse(storedChar));
        }
      } catch (err) {
        console.warn('LocalStorage user restore error:', err);
      }
    }
  }, []);

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
    setIsUsingMyLocation(false);
    // 해당 거점 주변 워크스페이스 선택
    const matchedWs = workspaces.find((w) => w.area.includes(hub.area.split('/')[0])) || workspaces[0];
    setSelectedWorkspace(matchedWs);
    loadTourCourse(hub, isRainy);
  };

  // 현재 위치(GPS) 기반 1시간 타임어택 코스 추천 핸들러
  const handleUseMyLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('현재 브라우저에서 위치 정보(GPS)를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const myHub: LocationPoint = {
          id: 'my-location',
          name: '내 위치 (현재지)',
          lat,
          lng,
          address: '현재 감지된 GPS 위치',
          area: '현재지',
        };
        setSelectedHub(myHub);
        setIsUsingMyLocation(true);
        loadTourCourse(myHub, isRainy);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation failed, falling back to Yeongdo:', err);
        alert('위치 권한이 거부되었거나 GPS를 수신할 수 없어 기본 영도 거점으로 안내합니다.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 날씨 토글 핸들러
  const handleToggleWeather = () => {
    const nextRainy = !isRainy;
    setIsRainy(nextRainy);
    loadTourCourse(selectedHub, nextRainy);
  };

  // 로그인 성공 시 기 가입자(캐릭터 보유)면 바로 복원, 신규면 캐릭터 생성 플로우로 전환
  const handleLoginSuccess = (user: UserMember, savedChar?: CharacterProfile) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('offce_user', JSON.stringify(user));
    }
    setIsLoginModalOpen(false);

    // 기 가입자의 캐릭터가 이미 존재하는 경우 캐릭터 생성 단계를 건너뛰고 즉시 복원
    if (savedChar) {
      setCharacter(savedChar);
      if (typeof window !== 'undefined') {
        localStorage.setItem('offce_character', JSON.stringify(savedChar));
      }
    } else {
      // 로컬스토리지에 캐릭터가 남아있는지 재확인
      const storedChar = typeof window !== 'undefined' ? localStorage.getItem('offce_character') : null;
      if (storedChar) {
        try {
          setCharacter(JSON.parse(storedChar));
          return;
        } catch (e) {
          // ignore
        }
      }
      // 캐릭터가 없는 신규 회원인 경우에만 최초 캐릭터 생성 모달 오픈
      setIsCharacterCreateOpen(true);
    }
  };

  // 캐릭터 생성 완료 핸들러
  const handleCharacterCreated = (newChar: CharacterProfile) => {
    setCharacter(newChar);
    if (typeof window !== 'undefined') {
      localStorage.setItem('offce_character', JSON.stringify(newChar));
    }
    setIsCharacterCreateOpen(false);
  };

  // 레벨업 보상(모자/의상/악세사리 3종 택 1) 선택 완료 핸들러
  const handleRewardSelected = (reward: LevelRewardOption) => {
    if (!character) return;
    const newEquipped = { ...character.equipped, [reward.category]: reward.name };
    const updatedChar: CharacterProfile = {
      ...character,
      equipped: newEquipped,
    };
    setCharacter(updatedChar);
    if (typeof window !== 'undefined') {
      localStorage.setItem('offce_character', JSON.stringify(updatedChar));
    }
    setLevelUpTarget(null);
  };

  return (
    <main className="flex flex-col min-h-screen pb-20">
      {/* 1. 상단 헤더 (타이틀, 퇴근 카운트다운 타이머, 날씨 위젯, 로그인 버튼, 거점 선택기 & 내 위치) */}
      <Header
        selectedHub={selectedHub}
        onSelectHub={handleSelectHub}
        offTime={offTime}
        onOffTimeChange={setOffTime}
        isRainy={isRainy}
        onToggleWeather={handleToggleWeather}
        user={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onUseMyLocation={handleUseMyLocation}
        isLocating={isLocating}
        isUsingMyLocation={isUsingMyLocation}
      />

      {/* 1-1. SD 동물 캐릭터 육성 위젯 (레벨, 성장 포인트, 착용 아이템) */}
      <CharacterWidget
        user={currentUser}
        character={character}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onTriggerLevelUpModal={(lvl) => setLevelUpTarget(lvl)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 2. 인터랙티브 지도 / 흐름도 (수평 선 위의 4단계 동선 + 캐릭터 위치 표시) */}
      <MapContainer
        mode={currentMode === 'WORK' ? 'WORK' : 'WALK'}
        selectedHub={selectedHub}
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={(ws) => {
          setSelectedWorkspace(ws);
          setCurrentMode('WORK');
          earnPoints(50, `[${ws.name}] 워크스페이스 체크인`);
        }}
        activeCourse={activeCourse}
        selectedSpot={selectedSpot}
        onSelectSpot={setSelectedSpot}
        onOpenBenefit={() => {
          if (activeCourse?.partnerBenefit) {
            setActiveBenefit(activeCourse.partnerBenefit);
          }
        }}
        character={character}
      />

      {/* 3. 모드별 콘텐츠 섹션 */}
      <div className="flex-1">
        {currentMode === 'WORK' && (
          <WorkSection
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onSelectWorkspace={(ws) => {
              setSelectedWorkspace(ws);
              earnPoints(50, `[${ws.name}] 워크스페이스 체크인`);
            }}
            isFromGoogle={isFromGoogleSheet}
          />
        )}

        {currentMode === 'WALK' && (
          <WalkSection
            course={activeCourse}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
            onRefreshCourse={() => loadTourCourse(selectedHub, isRainy)}
            onOpenBenefitModal={(b) => {
              setActiveBenefit(b);
              earnPoints(80, `[${b.businessName}] 제휴 쿠폰 열람/발급`);
            }}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            isRainy={isRainy}
            onToggleWeather={handleToggleWeather}
            loading={courseLoading}
            onUseMyLocation={handleUseMyLocation}
            isLocating={isLocating}
            isUsingMyLocation={isUsingMyLocation}
          />
        )}

        {currentMode === 'BENEFIT' && (
          <BenefitSection
            onSelectBenefit={(b) => {
              setActiveBenefit(b);
              earnPoints(80, `[${b.businessName}] 제휴 쿠폰 열람/발급`);
            }}
          />
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

      {/* 5. 로그인 & 회원가입 모달 (간편로그인 3종 + 5대 정보 + 보안책임자 고지) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 5-1. SD 동물 캐릭터 상세 프로필 모달 (캐릭터 클릭 시 오픈) */}
      {currentUser && character && (
        <CharacterProfileModal
          user={currentUser}
          character={character}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onTriggerLevelUpModal={(lvl) => setLevelUpTarget(lvl)}
        />
      )}

      {/* 6. SD 동물 캐릭터 최초 1회 생성 모달 */}
      {currentUser && (
        <CharacterCreateModal
          user={currentUser}
          isOpen={isCharacterCreateOpen}
          onCharacterCreated={handleCharacterCreated}
        />
      )}

      {/* 7. 레벨업 보상 선택 모달 (동일 카테고리 3종 중 택 1) */}
      {currentUser && character && levelUpTarget && (
        <LevelUpRewardModal
          user={currentUser}
          character={character}
          targetLevel={levelUpTarget}
          isOpen={levelUpTarget !== null}
          onRewardSelected={handleRewardSelected}
        />
      )}

      {/* 8. 부산 기업 상생 모바일 할인권 모달 */}
      <PartnerBenefitModal
        benefit={activeBenefit}
        onClose={() => setActiveBenefit(null)}
      />

      {/* 9. 구글 시트 코스 & 방명록 저장 모달 */}
      {isSaveModalOpen && (
        <CourseSaveModal
          course={activeCourse}
          workspace={selectedWorkspace}
          onClose={() => {
            setIsSaveModalOpen(false);
            earnPoints(120, `[${activeCourse.title}] 코스 완주 및 방명록 저장`);
          }}
        />
      )}
    </main>
  );
}

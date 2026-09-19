'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Building2, User, Briefcase, Phone, Sparkles, CheckCircle2, ArrowRight, UserCheck, ChevronDown, ChevronUp, FileText, RefreshCw, LogOut } from 'lucide-react';
import { UserMember, CharacterProfile } from '@/types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserMember, character?: CharacterProfile) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // 간편 로그인 선택 후 추가 정보 입력 단계 (null -> 'google' | 'kakao' | 'apple')
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'kakao' | 'apple' | null>(null);

  // 회원가입 5대 필수 정보
  const [company, setCompany] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 기 가입자 로컬 스토리지 상태 보존 및 약관 상세 열람 토글
  const [savedUser, setSavedUser] = useState<UserMember | null>(null);
  const [savedChar, setSavedChar] = useState<CharacterProfile | null>(null);
  const [showTermsDetail, setShowTermsDetail] = useState<boolean>(false);

  // 모달 열릴 때 로컬 스토리지의 기존 가입자 정보 자동 조회
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('offce_user');
        const storedChar = localStorage.getItem('offce_character');
        if (storedUser) {
          const parsedUser: UserMember = JSON.parse(storedUser);
          setSavedUser(parsedUser);
          // 기존 입력값 기본 프리필
          setCompany(parsedUser.company || '');
          setName(parsedUser.name || '');
          setRole(parsedUser.role || '');
          setPhone(parsedUser.phone || '');
          setEmail(parsedUser.email || '');
        }
        if (storedChar) {
          setSavedChar(JSON.parse(storedChar));
        }
      } catch (err) {
        console.warn('Failed to parse local stored user:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 0. 기 가입자 원클릭 1초 바로 로그인
  const handleQuickLogin = (userToLogin: UserMember) => {
    onLoginSuccess(userToLogin, savedChar || undefined);
    onClose();
  };

  // 1. 간편 로그인 버튼 클릭 시: 기 가입자면 즉시 원클릭 로그인, 미가입자면 프리필 후 추가 정보 화면 전환
  const handleSelectProvider = (provider: 'google' | 'kakao' | 'apple') => {
    // 만약 이미 가입된 유저가 있고 동일하거나 유사한 계정인 경우 매번 입력 없이 즉시 로그인 처리
    if (savedUser) {
      const updatedUser: UserMember = {
        ...savedUser,
        provider,
      };
      // 로컬 스토리지 갱신 후 즉시 로그인 완료
      if (typeof window !== 'undefined') {
        localStorage.setItem('offce_user', JSON.stringify(updatedUser));
      }
      onLoginSuccess(updatedUser, savedChar || undefined);
      onClose();
      return;
    }

    // 신규 회원의 경우 해당 provider로 설정하고 폼 화면으로 이동
    setSelectedProvider(provider);
    if (!email) {
      if (provider === 'google') setEmail('nomad@gmail.com');
      else if (provider === 'kakao') setEmail('nomad@kakao.com');
      else if (provider === 'apple') setEmail('nomad@privaterelay.appleid.com');
    }
  };

  // 2. 최종 가입 및 로그인 완료 (구글 시트 저장)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim() || !role.trim() || !phone.trim() || !email.trim()) {
      alert('모든 필수 회원 정보를 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);
    const newUser: UserMember = {
      id: savedUser?.id || `usr-${Date.now()}`,
      createdAt: savedUser?.createdAt || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      provider: selectedProvider || savedUser?.provider || 'google',
      company,
      name,
      role,
      phone,
      email,
    };

    // 로컬 스토리지에 회원 정보 영구 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('offce_user', JSON.stringify(newUser));
    }

    try {
      // 구글 스프레드시트 Users_Members 탭에 자동 저장
      await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signup',
          email: newUser.email,
          name: newUser.name,
          company: newUser.company,
          role: newUser.role,
          phone: newUser.phone,
          provider: newUser.provider,
          animalType: savedChar?.animalType || 'seagull',
          characterName: savedChar?.name || `${newUser.name}의 파트너`,
          level: savedChar?.level || 1,
          points: savedChar?.points || 100, // 가입 축하 보너스 100P
        }),
      });
    } catch (err) {
      console.warn('Signup sheet save error (offline fallback):', err);
    } finally {
      setIsSubmitting(false);
      onLoginSuccess(newUser, savedChar || undefined);
      onClose();
    }
  };

  // 기존 저장 계정 초기화(다른 사람 계정으로 가입 원할 때)
  const handleResetSavedUser = () => {
    if (confirm('저장된 회원 정보를 삭제하고 신규 계정으로 가입하시겠습니까?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('offce_user');
        localStorage.removeItem('offce_character');
      }
      setSavedUser(null);
      setSavedChar(null);
      setCompany('');
      setName('');
      setRole('');
      setPhone('');
      setEmail('');
      setSelectedProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 브랜딩 타이틀 */}
        <div className="flex items-center space-x-2 text-cyan-600">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-black tracking-wider uppercase">
            Off-ce BUSAN 워케이션 멤버십
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
          {selectedProvider ? '회원 정보 입력' : '간편 로그인 & 회원가입'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {selectedProvider
            ? '워케이션 맞춤 혜택과 캐릭터 생성을 위한 정보를 입력해 주세요.'
            : savedUser
            ? '기존 가입 정보가 확인되었습니다. 1초 만에 바로 로그인하세요!'
            : '1초 간편 로그인으로 부산 워케이션 코스와 캐릭터 육성을 시작하세요!'}
        </p>

        {/* [기 가입자 편의 기능] 이전 가입 이력이 있는 경우 1초 원클릭 로그인 전용 카드 노출 */}
        {savedUser && !selectedProvider && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-50 via-sky-50 to-emerald-50 border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {savedUser.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900">{savedUser.name}</span>
                    <span className="text-[10px] bg-cyan-100 text-cyan-800 font-semibold px-1.5 py-0.5 rounded">
                      기 가입 회원
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {savedUser.company} · {savedUser.role} ({savedUser.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetSavedUser}
                className="text-[10px] text-slate-400 hover:text-rose-600 underline flex items-center space-x-0.5"
                title="다른 계정으로 로그인"
              >
                <span>계정 변경</span>
              </button>
            </div>

            <button
              onClick={() => handleQuickLogin(savedUser)}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>이 정보로 1초 바로 로그인하기</span>
            </button>
          </div>
        )}

        {/* STEP 1: 간편 로그인 선택 (구글, 카카오, 애플) */}
        {!selectedProvider ? (
          <div className="mt-4 space-y-2.5">
            {savedUser && (
              <div className="text-[11px] font-semibold text-slate-500 pt-1 pb-0.5 flex items-center space-x-1">
                <span>또는 다른 간편 소셜 수단으로 계속하기</span>
              </div>
            )}

            {/* 1) 카카오톡 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('kakao')}
              className="w-full py-3 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs flex items-center justify-center space-x-2.5 shadow-sm active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 3C6.5 3 2 6.6 2 11c0 2.9 1.9 5.4 4.8 6.8-.2.8-.8 3-1 3.5-.1.3.1.5.3.3.3-.2 3.6-2.4 4.2-2.8.9.1 1.8.2 2.7.2 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
              </svg>
              <span>{savedUser ? '카카오 계정으로 1초 로그인' : '카카오톡으로 3초 만에 시작하기'}</span>
            </button>

            {/* 2) 구글 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('google')}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2.5 shadow-sm active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9.1z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.2C3.3 21.4 7.4 24 12 24z" />
                <path fill="#FBBC05" d="M5.3 14.1c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3V6.3H1.2C.4 7.9 0 9.9 0 12s.4 4.1 1.2 5.7l4.1-3.6z" />
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.4 0 3.3 2.6 1.2 6.3l4.1 3.2c.9-2.9 3.6-4.7 6.7-4.7z" />
              </svg>
              <span>{savedUser ? 'Google 계정으로 1초 로그인' : 'Google 계정으로 계속하기'}</span>
            </button>

            {/* 3) 애플 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('apple')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-950 text-white font-bold text-xs flex items-center justify-center space-x-2.5 shadow-sm active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.7 19.5c-.8 1.2-1.7 2.4-3 2.4-1.4 0-1.8-.8-3.4-.8-1.5 0-2.1.8-3.4.8-1.3 0-2.3-1.3-3.1-2.5-1.7-2.4-3-6.9-1.2-9.9.9-1.5 2.5-2.5 4.2-2.5 1.3 0 2.5.9 3.3.9.8 0 2.3-1.1 3.8-1 1.7.1 3 1.1 3.8 2.2-3.1 1.9-2.6 6.1.4 7.4-.7 1.5-1.5 3-2.4 4.2zM15.4 5.9c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.3.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.2.1 2.3-.5 2.9-1.3z" />
              </svg>
              <span>{savedUser ? 'Apple 계정으로 1초 로그인' : 'Apple로 로그인'}</span>
            </button>

            {/* 회원 정보 수정 버튼 (기 가입자가 소속이나 연락처 변경하고 싶을 때) */}
            {savedUser && (
              <button
                type="button"
                onClick={() => setSelectedProvider(savedUser.provider)}
                className="w-full py-2 text-center text-xs font-semibold text-cyan-700 hover:text-cyan-800 underline transition-colors"
              >
                회원 정보(소속, 연락처 등) 수정하기
              </button>
            )}
          </div>
        ) : (
          /* STEP 2: [회사명] [이름] [직책] [연락처] [이메일] 5대 정보 입력 폼 */
          <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[11px] text-cyan-700 font-bold">
                선택된 수단: <strong className="uppercase">{selectedProvider}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="text-[10px] text-slate-500 hover:text-slate-800 underline"
              >
                다른 수단 변경
              </button>
            </div>

            {/* 1) 회사명 */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Building2 className="w-3 h-3 text-cyan-600" />
                <span>회사명 (또는 프리랜서)</span>
              </label>
              <input
                type="text"
                placeholder="예: 더휴랩, 네이버, 프리랜서 등"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* 2) 이름 */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <User className="w-3 h-3 text-cyan-600" />
                <span>이름</span>
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* 3) 직책 */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Briefcase className="w-3 h-3 text-cyan-600" />
                <span>직책</span>
              </label>
              <input
                type="text"
                placeholder="예: 팀장, 개발자, 디자이너, 대표"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* 4) 연락처 */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Phone className="w-3 h-3 text-cyan-600" />
                <span>연락처</span>
              </label>
              <input
                type="tel"
                placeholder="예: 010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* 5) 이메일 */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1 mb-1">
                <Mail className="w-3 h-3 text-cyan-600" />
                <span>이메일</span>
              </label>
              <input
                type="email"
                placeholder="예: user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <span>{isSubmitting ? '저장 및 로그인 처리 중...' : savedUser ? '정보 수정 및 로그인 완료' : '가입 완료 & 캐릭터 생성하기'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 2. 개인정보관리 및 보안 책임자 고지 (상세 약관 열람 기능 포함) */}
        <div className="mt-5 pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>개인정보보호 및 보안 안내</span>
            </div>
            {/* 상세 약관 토글 버튼 */}
            <button
              type="button"
              onClick={() => setShowTermsDetail(!showTermsDetail)}
              className="flex items-center space-x-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2 py-0.5 rounded-lg transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{showTermsDetail ? '약관 접기' : '상세 약관 전문 확인'}</span>
              {showTermsDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed">
            수집된 5대 정보([회사명] [이름] [직책] [연락처] [이메일])는 오프스 부산 워케이션 서비스 제공, 포인트 적립 및 캐릭터 성장 관리 목적으로만 안전하게 처리되며 구글 클라우드 보안 규정에 따라 보관됩니다.
          </p>

          {/* 개인정보 보호책임자 박스 */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
            <div>
              <span className="text-slate-800 font-bold">개인정보 보호 책임자:</span> 더휴랩 지정인 (<a href="mailto:jguy12@hanmail.net" className="text-cyan-600 underline">jguy12@hanmail.net</a>)
            </div>
          </div>

          {/* [상세 약관 전문 아코디언 뷰] 대한민국 개인정보보호법 및 공공데이터 가이드라인 준수 */}
          {showTermsDetail && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] text-slate-600 space-y-2.5 max-h-56 overflow-y-auto leading-relaxed mt-2 shadow-inner">
              <div className="font-bold text-slate-800 text-[11px] pb-1 border-b border-slate-200">
                오프스 부산(Off-ce BUSAN) 개인정보 수집·이용 및 보안 처리방침 전문
              </div>

              <div>
                <strong className="text-slate-800">제1조 (개인정보의 수집 및 이용 목적)</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 pl-1">
                  <li>오프스 부산 워케이션 거점 체크인 확인 및 멤버십 관리</li>
                  <li>1시간 퇴근길 맞춤형 도보/관광 코스 라우팅 및 주변 명소 추천</li>
                  <li>SD 동물 캐릭터 파트너 육성, 레벨업 및 워케이션 활동 포인트 적립 관리</li>
                  <li>부산 로컬 제휴업체 상생 할인 모바일 바우처 발급 및 현장 본인 식별</li>
                </ul>
              </div>

              <div>
                <strong className="text-slate-800">제2조 (수집하는 개인정보의 항목)</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 pl-1">
                  <li><strong>필수 수집 항목:</strong> 소속(회사명/프리랜서), 이름, 직책, 휴대전화번호, 이메일 주소</li>
                  <li><strong>간편로그인 연동 정보:</strong> 간편 소셜 로그인 식별자 (Google, Kakao, Apple)</li>
                  <li><strong>자동 생성 정보:</strong> 서비스 이용 로그, 거점 체크인 기록, 코스 완주 및 포인트 내역</li>
                </ul>
              </div>

              <div>
                <strong className="text-slate-800">제3조 (개인정보의 보유 및 이용 기간)</strong>
                <p className="mt-0.5">
                  원칙적으로 이용자의 서비스 탈퇴 시 또는 목적 달성 시 지체 없이 파기합니다. 본 공모전 및 시범 운영 기간(2026년도) 동안 안전하게 보관되며, 서비스 종료 시 모든 데이터는 영구 삭제 처리됩니다.
                </p>
              </div>

              <div>
                <strong className="text-slate-800">제4조 (개인정보의 파기 절차 및 방법)</strong>
                <p className="mt-0.5">
                  전자적 파일 형태로 기록·저장된 개인정보는 재생 불가능한 기술적 방법을 사용하여 영구 파기하며, 어떠한 경우에도 외부로 유출되거나 제3자에게 임의 제공되지 않습니다.
                </p>
              </div>

              <div>
                <strong className="text-slate-800">제5조 (정보주체의 권리와 행사 방법)</strong>
                <p className="mt-0.5">
                  이용자는 언제든지 등록된 개인정보의 열람, 정정, 삭제(회원 탈퇴)를 요구할 수 있습니다. 개인정보 보호책임자(jguy12@hanmail.net)에게 서면 또는 이메일로 요청 시 지체 없이 조치합니다.
                </p>
              </div>

              <div>
                <strong className="text-slate-800">제6조 (개인정보의 안전성 확보 조치)</strong>
                <p className="mt-0.5">
                  전송 구간 SSL/TLS(HTTPS) 암호화 통신 적용, Google Cloud 기반 보안 스토리지 저장 및 접근 통제 등 기술적·관리적 보호 조치를 철저히 이행하고 있습니다. 주민등록번호 등 고유식별정보는 일절 수집하지 않습니다.
                </p>
              </div>

              <div>
                <strong className="text-slate-800">제7조 (개인정보 보호 책임자 및 고충 처리 창구)</strong>
                <p className="mt-0.5">
                  · 책임 부서: 더휴랩 워케이션 운영팀<br />
                  · 개인정보 보호 책임자: 더휴랩 지정인<br />
                  · 문의 및 민원 처리 이메일: <a href="mailto:jguy12@hanmail.net" className="text-cyan-600 font-semibold underline">jguy12@hanmail.net</a><br />
                  · 시행일자: 2026년 9월 1일
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

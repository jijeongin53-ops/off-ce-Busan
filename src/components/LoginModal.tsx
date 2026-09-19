'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Building2, User, Briefcase, Phone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserMember } from '@/types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserMember) => void;
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

  if (!isOpen) return null;

  // 1. 간편 로그인 버튼 클릭 시 Mock 이메일/이름 프리필 후 추가 정보 입력 화면으로 전환
  const handleSelectProvider = (provider: 'google' | 'kakao' | 'apple') => {
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
      id: `usr-${Date.now()}`,
      createdAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      provider: selectedProvider || 'google',
      company,
      name,
      role,
      phone,
      email,
    };

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
          animalType: 'seagull',
          characterName: `${newUser.name}의 파트너`,
          level: 1,
          points: 100, // 가입 축하 보너스 100P
        }),
      });
    } catch (err) {
      console.warn('Signup sheet save error (offline fallback):', err);
    } finally {
      setIsSubmitting(false);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 브랜딩 타이틀 */}
        <div className="flex items-center space-x-2 text-cyan-400">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-black tracking-wider uppercase">
            Off-ce BUSAN 워케이션 멤버십
          </span>
        </div>

        <h3 className="text-lg font-black text-white mt-1">
          {selectedProvider ? '회원 정보 입력' : '간편 로그인 & 회원가입'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {selectedProvider
            ? '워케이션 맞춤 혜택과 캐릭터 생성을 위한 정보를 입력해 주세요.'
            : '1초 간편 로그인으로 부산 워케이션 코스와 캐릭터 육성을 시작하세요!'}
        </p>

        {/* STEP 1: 간편 로그인 선택 (구글, 카카오, 애플) */}
        {!selectedProvider ? (
          <div className="mt-5 space-y-2.5">
            {/* 1) 카카오톡 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('kakao')}
              className="w-full py-3 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 3C6.5 3 2 6.6 2 11c0 2.9 1.9 5.4 4.8 6.8-.2.8-.8 3-1 3.5-.1.3.1.5.3.3.3-.2 3.6-2.4 4.2-2.8.9.1 1.8.2 2.7.2 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
              </svg>
              <span>카카오톡으로 3초 만에 시작하기</span>
            </button>

            {/* 2) 구글 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('google')}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.7 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-9.1z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.2C3.3 21.4 7.4 24 12 24z" />
                <path fill="#FBBC05" d="M5.3 14.1c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3V6.3H1.2C.4 7.9 0 9.9 0 12s.4 4.1 1.2 5.7l4.1-3.6z" />
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.4 0 3.3 2.6 1.2 6.3l4.1 3.2c.9-2.9 3.6-4.7 6.7-4.7z" />
              </svg>
              <span>Google 계정으로 계속하기</span>
            </button>

            {/* 3) 애플 간편로그인 */}
            <button
              onClick={() => handleSelectProvider('apple')}
              className="w-full py-3 px-4 rounded-2xl bg-black border border-slate-700 hover:bg-slate-950 text-white font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.7 19.5c-.8 1.2-1.7 2.4-3 2.4-1.4 0-1.8-.8-3.4-.8-1.5 0-2.1.8-3.4.8-1.3 0-2.3-1.3-3.1-2.5-1.7-2.4-3-6.9-1.2-9.9.9-1.5 2.5-2.5 4.2-2.5 1.3 0 2.5.9 3.3.9.8 0 2.3-1.1 3.8-1 1.7.1 3 1.1 3.8 2.2-3.1 1.9-2.6 6.1.4 7.4-.7 1.5-1.5 3-2.4 4.2zM15.4 5.9c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.3.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.2.1 2.3-.5 2.9-1.3z" />
              </svg>
              <span>Apple로 로그인</span>
            </button>
          </div>
        ) : (
          /* STEP 2: [회사명] [이름] [직책] [연락처] [이메일] 5대 정보 입력 폼 */
          <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[11px] text-cyan-400 font-semibold">
                선택된 수단: <strong className="uppercase">{selectedProvider}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                다른 수단 변경
              </button>
            </div>

            {/* 1) 회사명 */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>회사명 (또는 프리랜서)</span>
              </label>
              <input
                type="text"
                placeholder="예: 더휴랩, 네이버, 프리랜서 등"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {/* 2) 이름 */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                <User className="w-3 h-3 text-cyan-400" />
                <span>이름</span>
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {/* 3) 직책 */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                <Briefcase className="w-3 h-3 text-cyan-400" />
                <span>직책</span>
              </label>
              <input
                type="text"
                placeholder="예: 팀장, 개발자, 디자이너, 대표"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {/* 4) 연락처 */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                <Phone className="w-3 h-3 text-cyan-400" />
                <span>연락처</span>
              </label>
              <input
                type="tel"
                placeholder="예: 010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {/* 5) 이메일 */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                <Mail className="w-3 h-3 text-cyan-400" />
                <span>이메일</span>
              </label>
              <input
                type="email"
                placeholder="예: user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <span>{isSubmitting ? '회원가입 처리 중...' : '가입 완료 & 캐릭터 생성하기'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 2. 개인정보관리 및 보안 책임자 고지 (필수 요구사항 적용) */}
        <div className="mt-5 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>개인정보보호 및 보안 안내</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            수집된 회원 정보([회사명] [이름] [직책] [연락처] [이메일])는 오프스 부산 워케이션 서비스 제공, 포인트 적립 및 캐릭터 성장 관리 목적으로만 안전하게 처리되며 구글 클라우드 보안 규정에 따라 보관됩니다.
          </p>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400">
            <span className="text-slate-300 font-bold">개인정보 보호 책임자:</span> 더휴랩 지정인 (<a href="mailto:jguy12@hanmail.net" className="text-cyan-400 underline">jguy12@hanmail.net</a>)
          </div>
        </div>
      </div>
    </div>
  );
}

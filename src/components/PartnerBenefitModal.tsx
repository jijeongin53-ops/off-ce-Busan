'use client';

import React, { useState } from 'react';
import { X, Ticket, Copy, Check, Sparkles, MapPin, Store, Calendar } from 'lucide-react';
import { PartnerBenefit } from '@/types';

interface PartnerBenefitModalProps {
  benefit: PartnerBenefit | null;
  onClose: () => void;
}

export default function PartnerBenefitModal({ benefit, onClose }: PartnerBenefitModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!benefit) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(benefit.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl overflow-hidden text-slate-100">
        {/* 상단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="flex items-center space-x-2 text-amber-400">
          <Ticket className="w-5 h-5" />
          <span className="text-xs font-black tracking-wider uppercase">
            부산 로컬 기업 상생 혜택
          </span>
        </div>

        {/* 기업명 및 혜택 */}
        <div className="mt-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">{benefit.businessName}</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">{benefit.category}</span>
          </div>

          <h3 className="text-lg font-black text-white mt-1">
            {benefit.title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {benefit.description}
          </p>
        </div>

        {/* 모바일 쿠폰 박스 */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-900 border border-amber-500/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-300 font-bold">할인 혜택</span>
              <div className="text-2xl font-black text-amber-400">
                {benefit.discountRate}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">유효기간</span>
              <div className="text-xs font-medium text-slate-300 flex items-center justify-end space-x-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{benefit.validUntil}</span>
              </div>
            </div>
          </div>

          {/* 모의 바코드 그래픽 */}
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-col items-center">
            <div className="h-9 w-full bg-slate-950/80 rounded-lg p-1.5 flex items-center justify-center space-x-1">
              {[6, 3, 8, 2, 9, 4, 7, 2, 5, 8, 3, 9, 2, 7, 4, 9, 6].map((w, idx) => (
                <div
                  key={idx}
                  style={{ width: `${(w % 3) + 1.5}px` }}
                  className="h-full bg-amber-400/90 rounded-xs"
                />
              ))}
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-200">
                {benefit.couponCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사완료' : '코드복사'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 주소 및 안내 */}
        <div className="mt-4 flex items-start space-x-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>{benefit.address}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            매장 주문 시 직원에게 해당 화면 또는 쿠폰 번호를 제시해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

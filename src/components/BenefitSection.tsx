'use client';

import React from 'react';
import { Ticket, Sparkles, Store, ChevronRight, Gift, Percent } from 'lucide-react';
import { PartnerBenefit } from '@/types';
import { PARTNER_BENEFITS } from '@/lib/busanData';

interface BenefitSectionProps {
  onSelectBenefit: (benefit: PartnerBenefit) => void;
}

export default function BenefitSection({ onSelectBenefit }: BenefitSectionProps) {
  return (
    <div className="p-4 space-y-4">
      {/* 상단 소개 배너 */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30">
        <div className="flex items-center space-x-2 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">
            부산 로컬 기업 X 워케이션 상생 프로젝트
          </span>
        </div>
        <h2 className="text-base font-black text-white mt-1">
          부산 체험 & F&B 로컬 기업 모바일 쿠폰함
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          부산 지역 소상공인과 로컬 크리에이터 기업의 매력을 알리고, 워케이션 뚜벅이들에게 실질적인 할인 혜택을 제공합니다.
        </p>
      </div>

      {/* 카테고리별 혜택 리스트 */}
      <div className="space-y-3">
        {PARTNER_BENEFITS.map((benefit) => (
          <div
            key={benefit.id}
            onClick={() => onSelectBenefit(benefit)}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group hover:bg-slate-900 shadow-md"
          >
            <div className="flex space-x-3">
              {/* 이미지 */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                <img
                  src={benefit.imageUrl}
                  alt={benefit.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px]">
                  {benefit.discountRate}
                </div>
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      {benefit.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {benefit.couponCode}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5 truncate">
                    {benefit.businessName}
                  </h3>
                  <p className="text-xs font-semibold text-amber-300 mt-0.5 truncate">
                    {benefit.title}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="truncate max-w-[170px]">{benefit.address}</span>
                  <div className="flex items-center text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                    <span>쿠폰보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Send, Database, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { TimeAttackCourse, Workspace } from '@/types';

interface CourseSaveModalProps {
  course: TimeAttackCourse | null;
  workspace: Workspace | null;
  onClose: () => void;
}

export default function CourseSaveModal({ course, workspace, onClose }: CourseSaveModalProps) {
  const [userName, setUserName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert('닉네임과 한마디를 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);
    setResultMsg(null);

    try {
      // 1) Guestbook_Reviews 탭에 방명록 저장
      const res = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review',
          userName,
          workspaceName: workspace?.name || '부산 워크스페이스',
          visitedCourseTitle: course?.title || '1시간 타임어택 코스',
          rating,
          reviewComment: comment,
        }),
      });

      // 2) TimeAttackCourses 탭에 코스 상세 정보 자동 동기화
      if (course) {
        fetch('/api/sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'course',
            area: workspace?.area || '부산',
            weather: '맑음',
            offTime: '18:00',
            courseTitle: course.title,
            estimatedMinutes: course.estimatedMinutes,
            totalDistanceKm: course.totalDistanceKm,
            spot1: course.spots[0]?.spot.title || '',
            spot2: course.spots[1]?.spot.title || '',
            spot3: course.spots[2]?.spot.title || '',
            benefit: course.partnerBenefit?.title || '',
          }),
        }).catch((e) => console.warn('Course sheet sync skipped:', e));
      }

      const data = await res.json();

      if (data.success) {
        setResultMsg({
          success: true,
          text: data.fromGoogle
            ? '구글 스프레드시트에 성공적으로 저장되었습니다! 🎉'
            : '저장 완료! (서비스 계정 키 설정 시 시트에 실시간 반영됩니다)',
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setResultMsg({
          success: false,
          text: data.error || '저장 중 문제가 발생했습니다.',
        });
      }
    } catch (err) {
      setResultMsg({
        success: false,
        text: '네트워크 연결 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-cyan-200 rounded-3xl p-5 shadow-2xl text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-cyan-600">
          <Database className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-wider">
            실시간 방명록 동기화
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 mt-2">
          오늘의 워케이션 코스 기록하기
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          퇴근 후 걸었던 1시간 코스와 소감을 방명록에 저장합니다.
        </p>

        {/* 코스 정보 박스 */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">워크스페이스:</span>
            <span className="font-bold text-cyan-700 truncate max-w-[180px]">
              {workspace?.name || '부산 워크플레이스'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">퇴근 코스:</span>
            <span className="font-bold text-orange-600 truncate max-w-[180px]">
              {course?.title || '부산 1시간 타임어택 코스'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              닉네임 (워케이션 노마드명)
            </label>
            <input
              type="text"
              placeholder="예: 영도노마드, 칼퇴요정"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              만족도 별점
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amber-600 font-bold ml-2">{rating}점</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              퇴근길 소감 한마디
            </label>
            <textarea
              placeholder="일 끝나고 바로 바다 보며 먹은 어묵이 최고였어요!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
              required
            />
          </div>

          {resultMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center space-x-1.5 ${
                resultMsg.success
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  : 'bg-rose-50 border border-rose-300 text-rose-700'
              }`}
            >
              {resultMsg.success ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{resultMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? '방명록 저장 중...' : '방명록에 저장하기'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

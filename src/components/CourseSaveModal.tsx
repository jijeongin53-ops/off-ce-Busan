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
      const res = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          workspaceName: workspace?.name || '부산 워크스페이스',
          visitedCourseTitle: course?.title || '30분 타임어택 코스',
          rating,
          reviewComment: comment,
        }),
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-cyan-400">
          <Database className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-wider">
            Google Sheet 백엔드 동기화
          </span>
        </div>

        <h3 className="text-base font-bold text-white mt-2">
          오늘의 워케이션 코스 기록하기
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          퇴근 후 걸었던 30분 코스와 소감을 구글 시트에 저장합니다.
        </p>

        {/* 코스 정보 박스 */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">워크스페이스:</span>
            <span className="font-semibold text-cyan-300 truncate max-w-[180px]">
              {workspace?.name || '부산 워크플레이스'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">퇴근 코스:</span>
            <span className="font-semibold text-orange-300 truncate max-w-[180px]">
              {course?.title || '부산 30분 타임어택 코스'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              닉네임 (워케이션 노마드명)
            </label>
            <input
              type="text"
              placeholder="예: 영도노마드, 칼퇴요정"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              만족도 별점
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amber-400 font-bold ml-2">{rating}점</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              퇴근길 소감 한마디
            </label>
            <textarea
              placeholder="일 끝나고 바로 바다 보며 먹은 어묵이 최고였어요!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              required
            />
          </div>

          {resultMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center space-x-1.5 ${
                resultMsg.success
                  ? 'bg-emerald-950/70 border border-emerald-700 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-700 text-rose-300'
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
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? '시트 저장 중...' : '구글 스프레드시트에 저장'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

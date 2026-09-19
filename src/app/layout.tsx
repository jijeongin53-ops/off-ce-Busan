import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오프스 부산 (Off-ce BUSAN) | 뚜벅이 워케이션 라우팅",
  description: "낮엔 몰입의 오피스, 18시엔 낭만의 오프스. 부산 워케이션 족을 위한 1시간 타임어택 퇴근길 코스 및 로컬 혜택.",
  keywords: ["오프스부산", "Off-ce", "부산워케이션", "뚜벅이여행", "한국관광공사", "타임어택코스", "로컬상생"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-slate-100 text-slate-800 min-h-screen selection:bg-cyan-500 selection:text-white">
        <div className="max-w-md mx-auto min-h-screen relative flex flex-col bg-white shadow-xl shadow-slate-300/40 border-x border-slate-200">
          {children}
        </div>
      </body>
    </html>
  );
}

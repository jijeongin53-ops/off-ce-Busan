# 🌊 오프스 부산 (Off-ce BUSAN)
> **"낮엔 몰입의 오피스(Office), 18시엔 낭만의 오프스(Off)"**  
> 『2026 관광데이터 활용 공모전』 출품작 - 부산 뚜벅이 워케이션 30분 타임어택 라우팅 & 로컬 상생 플랫폼

---

## 📌 1. 서비스 소개
타 지역에서 부산을 방문한 워케이션족(뚜벅이)들을 위해, **'내 주변 업무 공간(WORK)'** 과 **'퇴근 후 30분 내 즐길 수 있는 로컬 관광 코스(WALK)'**, 그리고 **'부산 로컬 F&B/체험 기업의 할인 혜택'** 을 하나로 묶어주는 모바일 최적화 웹앱입니다.

### 🎯 핵심 차별성
- **선(Line) 단위 묶음 추천**: 단순 장소 나열이 아닌 `업무공간 ➔ 3km 이내 로컬 맛집 ➔ 일몰/야간 산책로 ➔ 숙소`로 이어지는 직관적 퇴근길 동선.
- **날씨 & 시간대 스마트 큐레이션**: 맑은 날에는 해 질 녘 바다 산책로, 비 오는 날에는 아늑한 실내 문화공간/북카페 우선 추천.
- **로컬 기업 상생 생태계**: 삼진어묵, 모모스커피, 초량1941 등 부산 대표 F&B 및 문화체험 기업의 마케팅 소개와 모바일 할인권(15~30% OFF, 무료 증정) 연계.

---

## 🛠️ 2. 기술 스택 & 데이터 연동

| 계층 | 사용 기술 / API | 설명 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion | 모바일 퍼스트 반응형 웹앱 |
| **지도 SDK** | 카카오맵 Web SDK & 인터랙티브 하이브리드 캔버스 | 마커, 번호 핀, 라우팅 Polyline 동선 시각화, 카카오 길찾기 링크 |
| **공공데이터 API** | 한국관광공사 TourAPI 4.0 (`locationBasedList1`, `KorService1`) | 반경 3km 이내 음식점(39), 관광지(12), 문화시설(14), 숙박(32) 실시간 호출 |
| **데이터베이스 백엔드** | Google Sheets API v4 | 구글 스프레드시트를 실시간 DB로 활용 (`sheet-bot@peo-schedule.iam.gserviceaccount.com` 연동) |
| **배포 인프라** | GitHub & Vercel | Vercel 무중단 자동 CI/CD 배포 최적화 |

---

## 🚀 3. Vercel & GitHub 배포 가이드

### ① 로컬 실행
```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
# http://localhost:3000 에서 확인
```

### ② 환경 변수 설정 (`.env.local` 또는 Vercel 대시보드)
```env
# 한국관광공사 TourAPI 일반 인증키 (Decoding)
TOUR_API_KEY=your_tour_api_key

# 카카오맵 JavaScript API 키 (선택사항)
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_key

# Google Sheets 백엔드 연동
GOOGLE_SHEET_ID=15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheet-bot@peo-schedule.iam.gserviceaccount.com
# Google Cloud Console에서 발급받은 서비스 계정 Private Key (JSON 내 private_key)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### ③ Vercel 배포 방법
1. 본 프로젝트를 본인의 GitHub 저장소에 Push 합니다:
   ```bash
   git add .
   git commit -m "feat: Off-ce BUSAN initial release"
   git remote add origin <사용자_깃허브_레포_URL>
   git push -u origin main
   ```
2. [Vercel](https://vercel.com)에 로그인 후 **"Add New Project"** 에서 해당 GitHub 레포지토리를 선택(Import)합니다.
3. Framework Preset은 **Next.js**로 자동 인식됩니다.
4. **Environment Variables** 탭에 위의 환경변수를 등록한 뒤 **Deploy** 버튼을 누르면 1분 이내로 전 세계 배포가 완료됩니다!

---

## 📊 4. 구글 스프레드시트 구조
- **스프레드시트 URL**: [구글 시트 바로가기](https://docs.google.com/spreadsheets/d/15X5EzmNlQJhI4fGqBD0MmB3L9jKmQhGEIDuueZEyatk/edit?gid=0#gid=0)
- **Workspaces 시트**: 관리자가 시트에 새로운 카페나 공유오피스를 추가하면 웹앱에 즉각 반영
- **Reviews 시트**: 사용자가 웹앱에서 남긴 평점, 후기, 퇴근 코스 로그가 실시간 Row 단위로 자동 축적

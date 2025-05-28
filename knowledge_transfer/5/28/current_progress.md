# Money Check Project 진행상황 📊

## 🎯 프로젝트 개요
가계부 관리 웹 애플리케이션 - 수입/지출 관리, 예산 설정, 리포트 생성

## ✅ 완료된 작업 (2025.05.28)

### 1. 환경 설정 🛠️
- **가상환경 제거**: 직접 패키지 설치 방식으로 변경
- **패키지 버전 통일**: requirements.txt와 setup_guide.md 일치
- **CORS 설정**: 프론트엔드(5173) ↔ 백엔드(8000) 통신 설정

### 2. 데이터베이스 구조 📊
```
User (users 테이블)
├── categories (1:N) → Category.created_by (CASCADE)
├── transactions (1:N) → AccountBook.user (CASCADE)  
└── budgets (1:N) → Budget.user (CASCADE)

Category (categories 테이블)
├── transactions (1:N) → AccountBook.category (PROTECT)
└── budgets (1:N) → Budget.category (PROTECT)
```

**주요 모델**:
- **User**: 커스텀 사용자 모델 (is_admin 필드 추가)
- **Category**: 수입/지출 카테고리
- **AccountBook**: 거래 내역
- **Budget**: 예산 관리

### 3. 백엔드 API 🔧
**인증 API**:
- `POST /api/auth/register/` - 회원가입
- `POST /api/auth/login/` - 로그인

**기능**:
- 사용자 중복 검사 (아이디, 이메일)
- 비밀번호 암호화
- 세션 기반 인증

### 4. 프론트엔드 UI 🎨
**완성된 페이지**:
- **로그인 페이지**: 그라데이션 배경, 개발자 정보 표시
- **회원가입 페이지**: 비밀번호 확인, 유효성 검사
- **대시보드**: 권한별 다른 메뉴 표시

**디자인 특징**:
- 일관된 그라데이션 테마 (보라→파랑)
- 반응형 레이아웃
- 이모지 아이콘 활용

### 5. 권한 관리 🔐
**Admin 계정** (username: admin):
- 메뉴: 카테고리 관리, 설정
- 대시보드 접근 불가
- 빨간색 "관리자" 배지

**일반 사용자**:
- 메뉴: 대시보드, 거래내역, 거래등록, 예산관리, 리포트
- 파란색 "사용자" 배지

## 🚀 실행 방법

### 백엔드 실행
```bash
cd Money_check_project
python manage.py runserver
```

### 프론트엔드 실행
```bash
cd frontend
npm run dev
```

### 접속 정보
- **프론트엔드**: http://localhost:5173
- **백엔드**: http://localhost:8000
- **Admin 계정**: admin / admin

## 📁 주요 파일 구조
```
Money_check_project/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   └── App.tsx
├── accounts/
│   ├── models.py (커스텀 User 모델)
│   ├── views.py (인증 API)
│   └── urls.py
├── transactions/
│   └── models.py (Category, AccountBook, Budget)
├── backend/
│   ├── settings.py (CORS, 커스텀 User 설정)
│   └── urls.py
└── requirements.txt
```

## 🔄 다음 작업 예정

### 1. 카테고리 관리 (Admin)
- 카테고리 CRUD 기능
- 수입/지출 카테고리 분류

### 2. 거래 내역 관리 (User)
- 거래 등록/수정/삭제
- 거래 내역 조회/필터링

### 3. 예산 관리 (User)
- 예산 설정
- 예산 대비 지출 현황

### 4. 대시보드 데이터 연동
- 실제 거래 데이터 기반 통계
- 차트/그래프 표시

### 5. 리포트 기능
- 월별/연도별 통계
- 카테고리별 분석

## 🐛 해결된 이슈
1. **가상환경 충돌**: 직접 설치 방식으로 변경
2. **User 모델 충돌**: 커스텀 User 모델 설정
3. **CORS 에러**: 프론트엔드 도메인 허용 설정
4. **권한 분리**: admin/user 메뉴 분리

## 💡 개발 팁
- **상태 관리**: localStorage 활용한 로그인 상태 유지
- **권한 체크**: username 기반 admin 판별
- **에러 처리**: try-catch와 사용자 친화적 메시지
- **스타일링**: emotion/styled 활용한 컴포넌트 스타일링 
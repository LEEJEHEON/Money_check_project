# Money Check Project 개요 📊

## 1. 프로젝트 구조
```
Money_check_project/
├── frontend/           # React/TypeScript 프론트엔드
├── backend/            # Django 백엔드
├── transactions/       # 거래 관련 앱
├── accounts/          # 계정 관리 앱
├── venv/              # Python 가상환경
└── manage.py          # Django 프로젝트 관리
```

## 2. 기술 스택
### 프론트엔드
- React + TypeScript
- Emotion (스타일링)
- React Router DOM (라우팅)
- Axios (API 통신)

### 백엔드
- Django
- PostgreSQL
- Django REST Framework

## 3. 데이터베이스 모델
### Users
- 관리자/일반 유저 구분
- 사용자 인증 및 권한 관리

### Account_book
- 수입/지출 내역 관리
- 거래 날짜, 금액, 카테고리 등 기록

### Categories
- 수입/지출 카테고리 관리
- 사용자 정의 카테고리 지원

### Budgets
- 예산 설정 및 관리
- 카테고리별 예산 할당

## 4. 구현된 기능
### 로그인 페이지 (frontend/src/pages/Login.tsx)
- 사용자 인증 폼
- 에러 처리
- 스타일링 완료
- 백엔드 API 연동 준비

## 5. 다음 단계
1. 환경 설정
   - Node.js 설치 및 환경변수 설정
   - 프론트엔드 의존성 설치
   - 개발 서버 실행

2. 추가 구현 예정 기능
   - 회원가입
   - 대시보드
   - 거래 내역 관리
   - 예산 설정
   - 리포트 생성

## 6. API 엔드포인트
### 인증
- POST /api/auth/login/
- POST /api/auth/register/
- POST /api/auth/logout/

### 거래
- GET /api/transactions/
- POST /api/transactions/
- PUT /api/transactions/:id/
- DELETE /api/transactions/:id/

### 카테고리
- GET /api/categories/
- POST /api/categories/
- PUT /api/categories/:id/
- DELETE /api/categories/:id/

### 예산
- GET /api/budgets/
- POST /api/budgets/
- PUT /api/budgets/:id/
- DELETE /api/budgets/:id/ 
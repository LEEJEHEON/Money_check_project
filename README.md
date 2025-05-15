# Money_check_project
토이 프로젝트 (가계부 편)

## 프로젝트 설명 
엑셀로만 관리했던 가계부를 웹으로 구축하여 대시보드까지 해서 보기 쉽게 어디에서 이상한 돈이 빠져나가는지 관리하기 위한 목적

|Back|Django|
|Front|React / TypeScript / Vite|
|DB|PostgreDB|
|배포|Render|

## 프로젝트 시작하기 🚀

### 필수 요구사항
- Python 3.8 이상
- PostgreSQL 12 이상
- Node.js 16 이상

### 초기 설정
1. PostgreSQL에 데이터베이스 생성:
```sql
CREATE DATABASE money_check;
```

2. 프로젝트 초기화:
```bash
# 프로젝트 초기화 스크립트 실행
python init_project.py

# .env 파일 설정
# .env 파일을 열어서 DB_PASSWORD 등 필요한 정보를 수정해주세요

# 가상환경 활성화
# Windows:
.\\venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# 데이터베이스 마이그레이션
python manage.py migrate
```
   
node.js 설치 필요 

### 필요한 기능들: 
- 수입/지출 내역 기록
- 카테고리별 분류
- 월별/연도별 통계
- 대시보드 시각화
- 예산 설정 및 알림

### 화면 구상도 
1. 로그인 화면
    - admin 이랑 유저 나눠야됨. 
    - admin 은 계정 추가 및 유저 관리 가능 (유저의 금액까지는 못봄)  
    - 유저는 해당 유저의 관련된 정보들 열람 가능  

2. 로그인 후 첫 화면 
    - admin 은 계정 추가 및 유저 관리 버튼만 있음  
    - 유저는 dashboard가 먼저 나오는데, 이번달에 얼마를 썼는지 등을 알 수 있음
    - 옆 메뉴를 통해서 다른 화면으로 이동 가능. 다른 화면은 데이터 입력이 가능한 곳

### 데이터베이스 구조
1. Users (관리자/일반 유저 구분)
2. Account_book (수입/지출 내역)
3. Categories (카테고리 관리)
4. Budgets (예산 설정)

-- 할일 
Django 백엔드 설정
React/TypeScript 프론트엔드 설정
데이터베이스 스키마 설계
API 엔드포인트 설계
  
-- 꼭 필요한 기능이 뭔지 (추후 나중할일)
예산 알림 기능
카테고리별 지출 분석
정기 지출 자동 등록
영수증 사진 인식 기능

# 개발 환경 설정 가이드 🛠️

## 1. 백엔드 설정

### Python 패키지 설치
```bash
# 필요한 패키지 직접 설치
pip install django==4.2.7
pip install djangorestframework==3.14.0
pip install psycopg2-binary==2.9.9
pip install python-dotenv==1.0.0
pip install django-cors-headers==4.3.0
```

### 데이터베이스 설정
1. PostgreSQL 설치
2. 데이터베이스 생성
3. settings.py에서 데이터베이스 설정 업데이트

### Django 마이그레이션
```bash
python manage.py makemigrations
python manage.py migrate
```

## 2. 프론트엔드 설정

### Node.js 설치
1. [Node.js 웹사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 시 "시스템 환경 변수에 추가" 옵션 선택
3. 설치 후 터미널/PowerShell 재시작
4. 설치 확인:
   ```bash
   node --version
   npm --version
   ```

### 프로젝트 의존성 설치
```bash
cd frontend
npm install
```

### 필요한 패키지 설치
```bash
npm install @emotion/styled @emotion/react react-router-dom axios
npm install -D @types/react-router-dom
```

## 3. 개발 서버 실행

### 백엔드 서버
```bash
python manage.py runserver
```

### 프론트엔드 개발 서버
```bash
cd frontend
npm run dev
```

## 4. 환경 변수 설정

### 백엔드 (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### 프론트엔드 (.env)
```
VITE_API_URL=http://localhost:8000
```

## 5. 문제 해결

### 일반적인 문제
1. 포트 충돌
   - 기본 포트: 백엔드(8000), 프론트엔드(5173)
   - 포트 변경 방법 포함

2. CORS 이슈
   - Django CORS 설정 확인
   - 프론트엔드 API 요청 설정 확인

3. 데이터베이스 연결 문제
   - PostgreSQL 서비스 실행 확인
   - 데이터베이스 접속 정보 확인 
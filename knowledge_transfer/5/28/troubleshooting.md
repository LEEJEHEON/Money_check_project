# 문제 해결 가이드 🔧

## 🚨 해결된 주요 이슈

### 1. 가상환경 관련 문제
**문제**: 가상환경 설정의 복잡성과 버전 충돌

**해결책**:
- 가상환경 제거하고 직접 설치 방식 채택
- `requirements.txt`에 명확한 버전 명시
- 모든 설정 파일에서 가상환경 관련 내용 제거

**변경된 파일**:
- `setup_guide.md`
- `project_overview.md`
- `init/init_project.py`
- `init/config.yaml`
- `README.md`

### 2. User 모델 충돌 문제
**문제**: 커스텀 User 모델과 Django 기본 User 모델의 역참조 이름 충돌

**에러 메시지**:
```
accounts.User.groups: (fields.E304) Reverse accessor 'Group.user_set' for 'accounts.User.groups' clashes with reverse accessor for 'auth.User.groups'.
```

**해결책**:
```python
# settings.py에 추가
AUTH_USER_MODEL = 'accounts.User'

# views.py 수정
from .models import User  # Django 기본 User 대신 커스텀 User 사용
```

### 3. CORS 에러
**문제**: 프론트엔드(5173)에서 백엔드(8000)로 API 요청 시 CORS 에러

**해결책**:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

## 🔍 일반적인 문제 해결

### 1. 서버 실행 문제

**문제**: `python manage.py runserver` 실행 안됨

**체크리스트**:
1. 올바른 디렉토리에 있는지 확인 (`Money_check_project/`)
2. 필요한 패키지가 설치되어 있는지 확인
   ```bash
   pip install -r requirements.txt
   ```
3. 데이터베이스 마이그레이션 실행
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### 2. 프론트엔드 실행 문제

**문제**: `npm run dev` 실행 안됨

**체크리스트**:
1. Node.js가 설치되어 있는지 확인
   ```bash
   node --version
   npm --version
   ```
2. 의존성 설치
   ```bash
   cd frontend
   npm install
   ```
3. package.json 파일이 존재하는지 확인

### 3. 로그인 문제

**문제**: 로그인이 안됨

**체크리스트**:
1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
2. 사용자 계정이 존재하는지 확인
3. 네트워크 탭에서 API 요청/응답 확인
4. CORS 설정 확인

### 4. 데이터베이스 연결 문제

**문제**: PostgreSQL 연결 실패

**체크리스트**:
1. PostgreSQL 서비스가 실행 중인지 확인
2. 데이터베이스가 생성되어 있는지 확인
   ```sql
   CREATE DATABASE money_check;
   ```
3. `.env` 파일의 데이터베이스 설정 확인
4. `init/config.yaml`의 데이터베이스 정보 확인

## 🛠️ 디버깅 방법

### 1. 백엔드 디버깅

**로그 확인**:
```python
# views.py에 로그 추가
import logging
logger = logging.getLogger(__name__)

def login_view(request):
    logger.info(f"Login attempt for user: {username}")
    # ...
```

**Django Shell 사용**:
```bash
python manage.py shell
```
```python
from accounts.models import User
User.objects.all()  # 모든 사용자 확인
```

### 2. 프론트엔드 디버깅

**브라우저 개발자 도구**:
1. Network 탭: API 요청/응답 확인
2. Console 탭: JavaScript 에러 확인
3. Application 탭: localStorage 확인

**React 디버깅**:
```typescript
// 상태 확인
console.log('Current state:', { username, isLoggedIn });

// API 응답 확인
console.log('API response:', response.data);
```

### 3. 데이터베이스 디버깅

**PostgreSQL 직접 접속**:
```bash
psql -U username -d money_check
```

**테이블 확인**:
```sql
\dt  -- 테이블 목록
SELECT * FROM users;  -- 사용자 목록
```

## 🔧 성능 최적화

### 1. 백엔드 최적화

**쿼리 최적화**:
```python
# N+1 문제 해결
User.objects.select_related('profile').all()
```

**캐싱 적용** (향후):
```python
from django.core.cache import cache
```

### 2. 프론트엔드 최적화

**번들 크기 확인**:
```bash
npm run build
npm run preview
```

**메모리 누수 방지**:
```typescript
useEffect(() => {
  // cleanup function
  return () => {
    // 정리 작업
  };
}, []);
```

## 📋 체크리스트

### 개발 환경 설정 체크리스트
- [ ] Python 3.8+ 설치
- [ ] Node.js 16+ 설치
- [ ] PostgreSQL 설치 및 실행
- [ ] 필요한 패키지 설치 (`pip install -r requirements.txt`)
- [ ] 프론트엔드 의존성 설치 (`npm install`)
- [ ] 데이터베이스 마이그레이션 (`python manage.py migrate`)
- [ ] Admin 계정 생성 (`python manage.py createsuperuser`)

### 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 보안 설정 확인 (DEBUG=False)
- [ ] 환경 변수 설정
- [ ] 정적 파일 수집 (`python manage.py collectstatic`)
- [ ] 데이터베이스 백업

## 🆘 긴급 상황 대응

### 1. 데이터베이스 초기화
```bash
# 마이그레이션 파일 삭제 (주의!)
rm -rf */migrations/0*.py

# 새로운 마이그레이션 생성
python manage.py makemigrations
python manage.py migrate

# 슈퍼유저 재생성
python manage.py createsuperuser
```

### 2. 캐시 클리어
```bash
# 브라우저 캐시 클리어 (Ctrl+Shift+R)
# npm 캐시 클리어
npm cache clean --force

# Python 캐시 클리어
find . -name "*.pyc" -delete
find . -name "__pycache__" -delete
```

### 3. 의존성 재설치
```bash
# Python 패키지 재설치
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# Node.js 패키지 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📞 도움 요청 시 제공할 정보

1. **에러 메시지** (전체 스택 트레이스)
2. **실행 환경** (OS, Python 버전, Node.js 버전)
3. **재현 단계** (어떤 동작을 했을 때 발생하는지)
4. **관련 코드** (문제가 발생한 부분)
5. **로그 파일** (서버 로그, 브라우저 콘솔 로그) 
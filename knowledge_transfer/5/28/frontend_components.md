# 프론트엔드 컴포넌트 가이드 🎨

## 📁 컴포넌트 구조

```
frontend/src/
├── pages/
│   ├── Login.tsx          # 로그인 페이지
│   ├── Register.tsx       # 회원가입 페이지
│   └── Dashboard.tsx      # 대시보드 (권한별 분기)
├── App.tsx               # 라우터 설정
└── index.css            # 전역 스타일
```

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* 주요 색상 */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success-color: #28a745;
--danger-color: #dc3545;
--warning-color: #ffc107;
--info-color: #007bff;

/* 배경 */
--bg-light: #f5f5f5;
--bg-white: #ffffff;

/* 텍스트 */
--text-dark: #333;
--text-muted: #666;
```

### 타이포그래피
```css
/* 제목 */
font-size: 2rem;
font-weight: bold;

/* 본문 */
font-size: 1rem;
line-height: 1.5;

/* 작은 텍스트 */
font-size: 0.8rem;
```

## 🧩 주요 컴포넌트

### 1. 로그인 페이지 (Login.tsx)

**주요 기능:**
- 사용자 인증
- 로딩 상태 관리
- 에러 메시지 표시
- 회원가입 링크

**스타일 컴포넌트:**
```typescript
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  z-index: 1;
`;
```

### 2. 회원가입 페이지 (Register.tsx)

**주요 기능:**
- 사용자 등록
- 비밀번호 확인
- 중복 검사
- 성공/실패 메시지

**유효성 검사:**
```typescript
// 비밀번호 확인
if (password !== confirmPassword) {
  setError('비밀번호가 일치하지 않습니다.');
  return;
}
```

### 3. 대시보드 (Dashboard.tsx)

**권한별 메뉴:**
```typescript
const renderMenu = () => {
  if (isAdmin) {
    return (
      <MenuList>
        <MenuItem className="active">🏷️ 카테고리 관리</MenuItem>
        <MenuItem>⚙️ 설정</MenuItem>
      </MenuList>
    );
  } else {
    return (
      <MenuList>
        <MenuItem className="active">📊 대시보드</MenuItem>
        <MenuItem>💰 거래 내역</MenuItem>
        <MenuItem>📝 거래 등록</MenuItem>
        <MenuItem>💳 예산 관리</MenuItem>
        <MenuItem>📈 리포트</MenuItem>
      </MenuList>
    );
  }
};
```

**사이드바 스타일:**
```typescript
const Sidebar = styled.div`
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.li`
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-left-color: white;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    border-left-color: white;
  }
`;
```

## 🔄 상태 관리

### localStorage 활용
```typescript
// 로그인 정보 저장
localStorage.setItem('user_id', response.data.user_id);
localStorage.setItem('username', response.data.username);
localStorage.setItem('isLoggedIn', 'true');

// 로그인 상태 확인
const isLoggedIn = localStorage.getItem('isLoggedIn');
const storedUsername = localStorage.getItem('username');

// 로그아웃
localStorage.removeItem('user_id');
localStorage.removeItem('username');
localStorage.removeItem('isLoggedIn');
```

### 권한 체크
```typescript
// Admin 여부 확인
const isAdmin = storedUsername === 'admin';

// 로그인 상태 확인 후 리다이렉트
useEffect(() => {
  if (!isLoggedIn || !storedUsername) {
    navigate('/login');
    return;
  }
  setUsername(storedUsername);
  setIsAdmin(storedUsername === 'admin');
}, [navigate]);
```

## 🎯 라우터 설정

```typescript
// App.tsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
```

## 🔧 API 통신

### Axios 설정
```typescript
import axios from 'axios';

// 로그인 요청
const response = await axios.post('http://localhost:8000/api/auth/login/', {
  username,
  password,
});

// 에러 처리
try {
  // API 호출
} catch (err: any) {
  if (err.response?.data?.message) {
    setError(err.response.data.message);
  } else {
    setError('기본 에러 메시지');
  }
}
```

## 📱 반응형 디자인

### 그리드 시스템
```typescript
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;
```

### 카드 컴포넌트
```typescript
const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
```

## 🎨 스타일링 패턴

### 1. 컨테이너 패턴
```typescript
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;
```

### 2. 폼 패턴
```typescript
const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;
```

### 3. 버튼 패턴
```typescript
const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #357abd;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
```

## 🚀 성능 최적화

### 1. 컴포넌트 분리
- 재사용 가능한 컴포넌트 추출
- 스타일 컴포넌트 분리

### 2. 상태 최적화
- 필요한 상태만 관리
- useEffect 의존성 배열 최적화

### 3. 번들 최적화
- 코드 스플리팅 (향후 적용 예정)
- 이미지 최적화 (향후 적용 예정) 